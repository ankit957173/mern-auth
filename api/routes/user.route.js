import express from 'express';
//normal test krenge to error aayega isliye {} use kro
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();
router.get('/', test);
router.post('/update/:id', verifyToken, updateUser)


export default router;
