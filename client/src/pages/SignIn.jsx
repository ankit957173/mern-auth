import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { signInStart, signInSuccess, signInFailure, clearError } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import { ToastContainer } from 'react-toastify';
import { ToastNotify } from "../components/ToastNotify";

export default function SignIn() {
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
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        ToastNotify(data.message);
        return;
      }
      document.cookie = `access_token=${data.token}; path=/;`;
      ToastNotify('Welcome Back!!');
      //first notify user with success message then after 2 seconds redirect to /home page
      setTimeout(() => {

        dispatch(signInSuccess(data));
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        navigate("/home");
      }, 2000)
    } catch (error) {
      console.log("inside catch")
      console.log("error during sign-in:", error);
      dispatch(signInFailure(error));
      ToastNotify('Internal Server Error. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Log In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
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
          </div>
          <Link to={"/forgot-password"}>
            <span className="text-blue-500">Forgotten password?</span>
          </Link>
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Log In"}
          </button>
          <div className="relative text-center w-full font-semibold uppercase">or</div>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5">
          <p>New to TrustLink?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-500">Create an account</span>
          </Link>
        </div>
      </div>
    </>
  );
}