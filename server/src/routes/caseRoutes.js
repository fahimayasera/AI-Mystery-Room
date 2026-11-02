import { Router } from 'express';
import {
  createCase,
  discoverClue,
  getCase,
  getResult,
  requestHint,
  submitAccusation,
} from '../controllers/caseController.js';

const router = Router();
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.post('/', asyncRoute(createCase));
router.get('/:caseId', asyncRoute(getCase));
router.post('/:caseId/clues/:clueId/discover', asyncRoute(discoverClue));
router.post('/:caseId/hints', asyncRoute(requestHint));
router.post('/:caseId/accuse', asyncRoute(submitAccusation));
router.get('/:caseId/result', asyncRoute(getResult));

export default router;
