import express from 'express';
import { signup, signin, google, signout, findemail, updatepassword } from '../controllers/auth.controller.js';
import { verifyCode } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);
router.post('/findemail', findemail);
router.post('/updatepassword', updatepassword);
router.post('/verifycode', verifyCode);

export default router;