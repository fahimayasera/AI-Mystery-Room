import MysteryCase from '../models/MysteryCase.js';
import {
  accusationInputSchema,
  caseIdParamsSchema,
  clueParamsSchema,
  createCaseInputSchema,
  difficultyRules,
} from '../schemas/caseSchemas.js';
import { generateMystery } from '../services/geminiService.js';

function fail(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicMessage = message;
  return error;
}

function parseOrThrow(schema, value) {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw fail(400, parsed.error.issues.map((issue) => issue.message).join(' '));
  return parsed.data;
}

function publicCase(document) {
  const caseObject = document.toObject ? document.toObject() : document;
  return {
    id: String(caseObject._id),
    title: caseObject.title,
    scenario: caseObject.scenario,
    description: caseObject.description,
    difficulty: caseObject.difficulty,
    suspects: caseObject.suspects,
    evidence: caseObject.evidence,
    clues: caseObject.clues,
    usedHints: caseObject.usedHints,
    status: caseObject.status,
    createdAt: caseObject.createdAt,
    updatedAt: caseObject.updatedAt,
  };
}

function assertActive(document) {
  if (!document) throw fail(404, 'Mystery case not found.');
  if (document.status !== 'active') throw fail(409, 'This case has already been submitted.');
}

export async function createCase(req, res) {
  const input = parseOrThrow(createCaseInputSchema, req.body);
  const generated = await generateMystery(input);
  const created = await MysteryCase.create({
    title: generated.title,
    scenario: input.scenario,
    description: generated.description,
    difficulty: input.difficulty,
    suspects: generated.suspects,
    evidence: generated.evidence,
    clues: generated.clues.map((clue) => ({ ...clue, discovered: false })),
    hints: generated.hints,
    solution: {
      culpritId: generated.culpritId,
      explanation: generated.explanation,
      sequenceOfEvents: generated.sequenceOfEvents,
    },
  });
  res.status(201).json({ case: publicCase(created) });
}

export async function getCase(req, res) {
  const { caseId } = parseOrThrow(caseIdParamsSchema, req.params);
  const document = await MysteryCase.findById(caseId);
  if (!document) throw fail(404, 'Mystery case not found.');
  res.json({ case: publicCase(document) });
}

export async function discoverClue(req, res) {
  const { caseId, clueId } = parseOrThrow(clueParamsSchema, req.params);
  const document = await MysteryCase.findById(caseId);
  assertActive(document);
  const clue = document.clues.find((item) => item.id === clueId);
  if (!clue) throw fail(404, 'Clue not found in this case.');

  let newlyDiscovered = false;
  if (!clue.discovered) {
    const update = await MysteryCase.updateOne(
      { _id: caseId, status: 'active', clues: { $elemMatch: { id: clueId, discovered: false } } },
      { $set: { 'clues.$.discovered': true } },
    );
    newlyDiscovered = update.modifiedCount === 1;
  }
  const updated = await MysteryCase.findById(caseId);
  assertActive(updated);
  res.json({ case: publicCase(updated), newlyDiscovered });
}

export async function requestHint(req, res) {
  const { caseId } = parseOrThrow(caseIdParamsSchema, req.params);
  const current = await MysteryCase.findById(caseId).select('+hints');
  assertActive(current);
  const limit = difficultyRules[current.difficulty].hints;
  if (current.usedHints >= limit) throw fail(409, 'No hints remain for this difficulty.');

  const updated = await MysteryCase.findOneAndUpdate(
    { _id: caseId, status: 'active', $expr: { $lt: ['$usedHints', limit] } },
    { $inc: { usedHints: 1 } },
    { new: true },
  ).select('+hints');
  if (!updated) throw fail(409, 'No hints remain for this difficulty.');
  const hint = updated.hints[updated.usedHints - 1];
  if (!hint) throw fail(500, 'A hint could not be retrieved.');
  res.json({ hint, usedHints: updated.usedHints, hintsRemaining: limit - updated.usedHints });
}

export async function submitAccusation(req, res) {
  const { caseId } = parseOrThrow(caseIdParamsSchema, req.params);
  const { suspectId } = parseOrThrow(accusationInputSchema, req.body);
  const document = await MysteryCase.findById(caseId).select('+solution');
  assertActive(document);
  if (!document.suspects.some((suspect) => suspect.id === suspectId)) {
    throw fail(400, 'Select a suspect from this case.');
  }

  const correct = document.solution.culpritId === suspectId;
  const correctAccusationPoints = correct ? difficultyRules[document.difficulty].points : 0;
  const discoveredCount = document.clues.filter((clue) => clue.discovered).length;
  const cluePoints = discoveredCount * 5;
  const hintPenalty = document.usedHints * 10;
  const score = Math.max(0, correctAccusationPoints + cluePoints - hintPenalty);
  const submittedAt = new Date();
  const result = {
    accusationSuspectId: suspectId,
    correct,
    actualCulpritId: document.solution.culpritId,
    explanation: document.solution.explanation,
    sequenceOfEvents: document.solution.sequenceOfEvents,
    score,
    correctAccusationPoints,
    cluePoints,
    hintPenalty,
    submittedAt,
  };

  const saved = await MysteryCase.findOneAndUpdate(
    { _id: caseId, status: 'active' },
    { $set: { status: 'submitted', result } },
    { new: true },
  ).select('+solution +result');
  if (!saved) throw fail(409, 'This case has already been submitted.');
  res.json({ result: resultResponse(saved) });
}

function resultResponse(document) {
  const result = document.result.toObject ? document.result.toObject() : document.result;
  const suspect = (document.suspects ?? []).find((item) => item.id === result.accusationSuspectId);
  const culprit = (document.suspects ?? []).find((item) => item.id === result.actualCulpritId);
  return {
    correct: result.correct,
    accusedSuspect: suspect ? { id: suspect.id, name: suspect.name } : null,
    culprit: culprit ? { id: culprit.id, name: culprit.name } : null,
    explanation: result.explanation,
    sequenceOfEvents: result.sequenceOfEvents,
    score: result.score,
    scoring: {
      correctAccusationPoints: result.correctAccusationPoints,
      cluePoints: result.cluePoints,
      hintPenalty: result.hintPenalty,
    },
    discoveredClues: document.clues.filter((clue) => clue.discovered).length,
    usedHints: document.usedHints,
    submittedAt: result.submittedAt,
  };
}

export async function getResult(req, res) {
  const { caseId } = parseOrThrow(caseIdParamsSchema, req.params);
  const document = await MysteryCase.findById(caseId).select('+solution +result');
  if (!document) throw fail(404, 'Mystery case not found.');
  if (document.status !== 'submitted' || !document.result) {
    throw fail(409, 'Submit an accusation before requesting the result.');
  }
  res.json({ result: resultResponse(document) });
}
