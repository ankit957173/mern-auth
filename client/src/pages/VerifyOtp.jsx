import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { ToastContainer } from 'react-toastify';
import { ToastNotify } from "../components/ToastNotify.js";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: currentUser.email, otp }),
            });
            const data = await res.json();

            if (!data.success) {
                ToastNotify('Invalid OTP. Please try again.');
                return;
            }

            ToastNotify('OTP verified successfully!');
            document.cookie = `access_token=${data.token}; path=/;`;

            setTimeout(() => {
                dispatch(signInSuccess(data.user));
                navigate("/home"); // Redirect to profile upon successful verification
            }, 2000);

            setOtp(""); // Clear OTP input
        } catch (error) {
            console.error("Error verifying OTP:", error);
            dispatch(signInFailure(error));
            ToastNotify('Error verifying OTP. Please try again.');
        }
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: currentUser.email }),
            });
            const data = await res.json();
            if (!data.success) {
                ToastNotify('Error resending OTP. Please try again.');
                return;
            }

            ToastNotify('OTP resent to your email.');
        } catch (error) {
            console.error("Error resending OTP:", error);
            ToastNotify('Error resending OTP. Please try again.');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="p-3 max-w-lg mx-auto">
                <h1 className="text-3xl text-center font-semibold my-7">Verify OTP</h1>
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="bg-slate-100 p-3 rounded-lg"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button
                        className="bg-slate-700 fontbo text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    >
                        Verify OTP
                    </button>
                </form>
                <div className="flex gap-2 mt-3" onClick={handleResendOtp}>
                    <span className="text-blue-500 cursor-pointer">Resend OTP?</span>
                </div>
            </div>
        </>
    );
}