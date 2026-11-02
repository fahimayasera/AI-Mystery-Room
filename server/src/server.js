import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import { validateEnvironment } from './config/env.js';
import app from './app.js';

async function startServer() {
  const config = validateEnvironment(process.env);
  await connectDatabase(config.mongodbUri);

  app.listen(config.port, () => {
    console.log(`AI Mystery Room API listening on http://localhost:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error('Full startup error:', error);
  process.exitCode = 1;
});
