import express from 'express';
import { processQuery } from '../controllers/chatController.js';
import auth from '../middleware/auth.js';

const chatRouter = express.Router();

chatRouter.post('/query', auth, processQuery);

export default chatRouter;