import { Router } from 'express';
import { streamPresence } from '../controllers/presence.controller';

const router = Router();

// No auth middleware — anonymous visitors are welcome
router.get('/stream', streamPresence);

export default router;
