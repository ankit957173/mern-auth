import express from 'express';
//normal test krenge to error aayega isliye {} use kro
import { test, updateUser, deleteUser, getPasswords, deleteParticularPassword, pushPassword } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();
router.get('/', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/getPasswords/:id', verifyToken, getPasswords);
router.post('/pushPassword/:id/', verifyToken, pushPassword);
router.delete('/deleteParticularPassword/:id/:uuid', verifyToken, deleteParticularPassword);

export default router;
