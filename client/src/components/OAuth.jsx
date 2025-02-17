import React from 'react'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom' //import useNavigate
import { ToastNotify } from './ToastNotify';
export default function OAuth() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })
            const data = await res.json()

            if (data) {
                ToastNotify('Welcome To TrustLink!!')
                setTimeout(() => {
                    dispatch(signInSuccess(data))
                    navigate("/home")
                }, 2000)
            } else {
                console.log("No data received from the server")
            }
        } catch (error) {
            console.log("could not login with google", error)
        }
    }

    return (
        <button type='button' onClick={handleGoogleClick} className='bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Continue with google
        </button>
    )
}