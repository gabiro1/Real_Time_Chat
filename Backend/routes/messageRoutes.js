import express from 'express';
import { getUsersForSidebar, getAllMessages, markMessagesAsSeen, sendMessage } from '../controllers/messageController.js';
import { protectRoutes } from '../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.get('users', protectRoutes, getUsersForSidebar);
messageRouter.get('/:id', protectRoutes, getAllMessages);
messageRouter.put('mark/:id', protectRoutes, markMessagesAsSeen);
messageRouter.post('/send/:id', protectRoutes, sendMessage);

export default messageRouter;