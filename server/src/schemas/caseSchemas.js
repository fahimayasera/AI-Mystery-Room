import { z } from 'zod';

export const difficultyRules = {
  Easy: { suspects: 3, clues: 5, hints: 2, points: 100 },
  Medium: { suspects: 4, clues: 7, hints: 3, points: 150 },
  Hard: { suspects: 5, clues: 9, hints: 3, points: 200 },
};

export const createCaseInputSchema = z.object({
  scenario: z.string().trim().min(1, 'Scenario must not be empty.').max(500, 'Scenario must not exceed 500 characters.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
}).strict();

const identifier = z.string().trim().min(1).max(60);
const shortText = z.string().trim().min(1).max(160);
const narrative = z.string().trim().min(1).max(3000);

export const generatedCaseSchema = z.object({
  title: shortText,
  description: narrative,
  suspects: z.array(z.object({
    id: identifier,
    name: shortText,
    age: z.number().int().min(18).max(110),
    description: narrative,
    background: narrative,
    relationship: shortText,
  }).strict()),
  evidence: z.array(z.object({
    id: identifier,
    title: shortText,
    type: z.enum(['messages', 'image', 'cctv', 'document', 'other']),
    description: narrative,
    content: narrative,
    relatedSuspectId: identifier.nullable(),
    relatedClueIds: z.array(identifier),
    mediaUrl: z.string().url().nullable(),
  }).strict()),
  clues: z.array(z.object({
    id: identifier,
    title: shortText,
    description: narrative,
    relatedEvidenceId: identifier,
  }).strict()),
  hints: z.array(z.string().trim().min(1).max(500)),
  culpritId: identifier,
  explanation: narrative,
  sequenceOfEvents: z.array(z.string().trim().min(1).max(500)).min(2).max(10),
}).strict();

export function validateGeneratedCase(value, difficulty) {
  const parsed = generatedCaseSchema.safeParse(value);
  if (!parsed.success) return parsed;

  const rules = difficultyRules[difficulty];
  const generated = parsed.data;
  const suspectIds = new Set(generated.suspects.map((item) => item.id));
  const evidenceIds = new Set(generated.evidence.map((item) => item.id));
  const clueIds = new Set(generated.clues.map((item) => item.id));
  const allIdsUnique = (items) => new Set(items.map((item) => item.id)).size === items.length;
  const relationshipIdsValid = generated.evidence.every((item) =>
    (item.relatedSuspectId === null || suspectIds.has(item.relatedSuspectId)) &&
    item.relatedClueIds.every((id) => clueIds.has(id))) &&
    generated.clues.every((item) => evidenceIds.has(item.relatedEvidenceId));

  if (
    generated.suspects.length !== rules.suspects ||
    generated.clues.length !== rules.clues ||
    generated.hints.length !== rules.hints ||
    generated.evidence.length < 3 ||
    !allIdsUnique(generated.suspects) || !allIdsUnique(generated.evidence) || !allIdsUnique(generated.clues) ||
    !suspectIds.has(generated.culpritId) || !relationshipIdsValid
  ) {
    return { success: false, error: new z.ZodError([{ code: 'custom', path: [], message: 'The generated case does not satisfy difficulty counts or consistent relationship rules.' }]) };
  }

  return parsed;
}

export const clueParamsSchema = z.object({ caseId: z.string().regex(/^[a-f\d]{24}$/i), clueId: identifier });
export const caseIdParamsSchema = z.object({ caseId: z.string().regex(/^[a-f\d]{24}$/i) });
export const accusationInputSchema = z.object({ suspectId: identifier }).strict();
