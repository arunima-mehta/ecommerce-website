import express from 'express';
import { processQuery } from '../controllers/chatController.js';
import { optionalAuth } from '../middleware/auth.js';

const chatRouter = express.Router();

// Use optionalAuth instead of auth - allows both authenticated and guest users
chatRouter.post('/query', optionalAuth, processQuery);

export default chatRouter;