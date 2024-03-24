import express from 'express';
//normal test krenge to error aayega isliye {} use kro
import { test } from '../controllers/user.controller.js';
const router = express.Router();
router.get('/', test)

export default router;
