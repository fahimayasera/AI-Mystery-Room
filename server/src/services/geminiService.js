import { GoogleGenAI } from '@google/genai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { generatedCaseSchema, difficultyRules, validateGeneratedCase } from '../schemas/caseSchemas.js';

let client;
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('Mystery generation is not configured.');
    error.statusCode = 503;
    error.publicMessage = error.message;
    throw error;
  }
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

function buildPrompt(scenario, difficulty) {
  const rules = difficultyRules[difficulty];
  return `Create a self-contained fictional detective mystery based on this premise: ${JSON.stringify(scenario)}

Difficulty: ${difficulty}. Return exactly ${rules.suspects} suspects, exactly ${rules.clues} distinct clues, and exactly ${rules.hints} progressive hints. Include at least three evidence items. Create exactly one culprit and make every clue, evidence item, timeline, and suspect detail consistent with the solution. The culprit must be one of the listed suspect IDs. Hints should guide reasoning and never directly name or reveal the culprit. Include believable evidence items of varied kinds when suitable (messages, image, CCTV, document, other); mediaUrl must be null unless there is a real fictional media URL to include. IDs must be unique short stable identifiers within their collection. Every clue must refer to an existing evidence ID, every evidence relatedClueIds entry must refer to an existing clue ID, and relatedSuspectId must be an existing suspect ID or null. The description is public case background; keep the culprit and solution only in the dedicated private solution fields. Do not include markdown or prose outside the JSON object.`;
}

export async function generateMystery({ scenario, difficulty }) {
  let response;
  try {
    response = await getClient().models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      contents: buildPrompt(scenario, difficulty),
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: zodToJsonSchema(generatedCaseSchema, { target: 'jsonSchema7' }),
        temperature: 0.8,
      },
    });
  } catch (providerError) {
    console.error(
      `Gemini generation request failed (${providerError?.status || providerError?.code || 'unknown'}): ${providerError?.message || providerError}`,
    );
    const error = new Error('The mystery generator is temporarily unavailable. Please try again.');
    error.statusCode = 502;
    error.publicMessage = error.message;
    throw error;
  }

  if (!response?.text) {
    const error = new Error('The mystery generator returned an empty response. Please try again.');
    error.statusCode = 502;
    error.publicMessage = error.message;
    throw error;
  }

  let decoded;
  try {
    decoded = JSON.parse(response.text);
  } catch {
    const error = new Error('The mystery generator returned invalid case data. Please try again.');
    error.statusCode = 502;
    error.publicMessage = error.message;
    throw error;
  }

  const validated = validateGeneratedCase(decoded, difficulty);
  if (!validated.success) {
    const error = new Error('The generated mystery did not pass validation. Please generate another case.');
    error.statusCode = 502;
    error.publicMessage = error.message;
    throw error;
  }
  return validated.data;
}
