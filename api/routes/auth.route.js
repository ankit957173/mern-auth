import express from 'express';
import { signup, signin, google, signout, findemail, updatepassword, getUserProfile, checkVerified } from '../controllers/auth.controller.js';
import { verifyCode, verifyCodeSignUp, resendOtp, verifyToken } from '../utils/verifyUser.js';
import { sendform } from '../utils/sendForm.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profilebackend', checkVerified, verifyToken, getUserProfile);
router.post('/google', google);
router.post('/signout', signout);
router.post('/findemail', findemail);
router.post('/updatepassword', updatepassword);
//forgotpassword wala verify code 
router.post('/verifycode', verifyCode);
router.post('/send-form', sendform);
router.post('/verify-otp', verifyCodeSignUp);
router.post('/resend-otp', resendOtp);

export default router;