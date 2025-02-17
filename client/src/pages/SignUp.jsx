import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpFailure, signUpStart, signUpSuccess, clearError } from "../redux/user/userSlice";
import { ToastContainer } from 'react-toastify';
import { ToastNotify } from "../components/ToastNotify.js";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const passwordRef = useRef();
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (error) {
      ToastNotify(error.error);
    }
    dispatch(clearError());
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const showPassword = () => {
    if (passwordRef.current.type === "password") {
      passwordRef.current.type = "text";
    } else {
      passwordRef.current.type = "password";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signUpStart());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success) {
        dispatch(signUpFailure(data));
        ToastNotify(data.message); // Notify user with the error message
        return;
      }
      ToastNotify('OTP sent to your email. Please verify it.');
      //first notify user with success message then after 2 seconds redirect to otp page
      setTimeout(() => {
        dispatch(signUpSuccess(data.user)); // Dispatch with user data
        navigate("/verify-otp"); // Redirect to OTP verification page
      }, 2000);

    } catch (error) {
      console.error("Error during signup:", error);
      dispatch(signUpFailure(error));
      ToastNotify('Internal Server Error. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Username"
            id="username"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="bg-slate-100 p-3 rounded-lg w-full"
              onChange={handleChange}
              ref={passwordRef}
            />
            <span
              className="absolute right-[3px] top-[4px] cursor-pointer mt-2"
              onClick={showPassword}
            >
              <lord-icon
                src="https://cdn.lordicon.com/fmjvulyw.json"
                trigger="hover"
                style={{ width: "25px", height: "25px" }}
              ></lord-icon>
            </span>
            <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
          </div>
          <button
            disabled={loading}
            className="bg-slate-700 fontbo text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <div className="relative text-center w-full font-semibold uppercase">or</div>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-3">
          <p>Existing User?</p>
          <Link to={"/sign-in"}>
            <span className="text-blue-500">Log In</span>
          </Link>
        </div>
      </div>
    </>
  );
}