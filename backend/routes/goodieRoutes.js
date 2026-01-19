import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  requestGoodieOrder,
  listActiveGoodies
} from '../controllers/goodieController.js';

const router = express.Router();

router.get('/', requireAuth, listActiveGoodies);
router.post('/request', requireAuth, requestGoodieOrder);

export default router;
