import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  MONGODB_URI: z.string().trim().min(1),
  GEMINI_API_KEY: z.string().trim().min(1),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
});

export function validateEnvironment(environment) {
  const parsed = envSchema.safeParse(environment);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
    const error = new Error(`Invalid or missing environment settings: ${missing}`);
    error.publicMessage = error.message;
    throw error;
  }

  return {
    port: parsed.data.PORT,
    mongodbUri: parsed.data.MONGODB_URI,
    geminiApiKey: parsed.data.GEMINI_API_KEY,
    clientUrl: parsed.data.CLIENT_URL,
  };
}
