import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const suspectSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: String, required: true },
  background: { type: String, required: true },
  relationship: { type: String, required: true },
}, { _id: false });

const evidenceSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['messages', 'image', 'cctv', 'document', 'other'], required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  relatedSuspectId: { type: String, default: null },
  relatedClueIds: { type: [String], default: [] },
  mediaUrl: { type: String, default: null },
}, { _id: false });

const clueSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  relatedEvidenceId: { type: String, required: true },
  discovered: { type: Boolean, default: false },
}, { _id: false });

const solutionSchema = new Schema({
  culpritId: { type: String, required: true },
  explanation: { type: String, required: true },
  sequenceOfEvents: { type: [String], required: true },
}, { _id: false });

const resultSchema = new Schema({
  accusationSuspectId: { type: String, required: true },
  correct: { type: Boolean, required: true },
  actualCulpritId: { type: String, required: true },
  explanation: { type: String, required: true },
  sequenceOfEvents: { type: [String], required: true },
  score: { type: Number, required: true, min: 0 },
  correctAccusationPoints: { type: Number, required: true },
  cluePoints: { type: Number, required: true },
  hintPenalty: { type: Number, required: true },
  submittedAt: { type: Date, required: true },
}, { _id: false });

const mysteryCaseSchema = new Schema({
  title: { type: String, required: true },
  scenario: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  suspects: { type: [suspectSchema], required: true },
  evidence: { type: [evidenceSchema], required: true },
  clues: { type: [clueSchema], required: true },
  hints: { type: [String], required: true, select: false },
  solution: { type: solutionSchema, required: true, select: false },
  usedHints: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['active', 'submitted'], default: 'active' },
  result: { type: resultSchema, default: undefined, select: false },
}, { timestamps: true, versionKey: false });

mysteryCaseSchema.index({ createdAt: -1 });

export default model('MysteryCase', mysteryCaseSchema);
