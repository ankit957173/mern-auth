import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpFailure, signUpStart, clearError, signUpSuccess, signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import { ToastNotify } from "../components/ToastNotify.js"

import OAuth from "../components/OAuth";
export default function SignUp() {
  const passwordRef = useRef();
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    // Dispatch an action to clear the error when the component mounts or when the page is refreshed
    dispatch(clearError());
  }, [dispatch]);
  useEffect(() => {
    // Focus on the input field when the component mounts
    inputRef.current.focus();
  }, []);
  useEffect(() => {
    if (error) {
      ToastNotify(error.error)
    }
    dispatch(clearError());
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const showPassword = () => {
    if (passwordRef.current.type === "password") {
      passwordRef.current.type = "text"
    }
    else {
      passwordRef.current.type = "password"
    }

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    //isme puri url se bhi kr skte the lekin ab half url vite.config.js me daal diye as a proxy

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
      // console.log(data)
      //jaisa ki hum fetch use kr rhe h to hum setError ko ese set krenge
      // if errorHandler contains error then show error

      if (data.success === false) {

        dispatch(signUpFailure(data));
        return;
      }
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

        //jaisa ki hum fetch use kr rhe h to hum setError ko ese set krenge
        if (data.success === false) {
          dispatch(signInFailure(data));
          return;
        }

        ToastNotify('Welcome To TrustLink!!')
        setTimeout(() => {
          dispatch(signInSuccess(data));
          navigate("/home");
        }, 2000);
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      } catch (error) {
        dispatch(signInFailure(error));
      }


      dispatch(signUpSuccess(data));



    } catch (error) {
      dispatch(signUpFailure(error));
      // console.log(error);
    }
    //reset the form data to empty on submit
  };

  return (<>
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
        <div className="relative ">
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
        {/* link may be without { } also */}
        <Link to={"/sign-in"}>

          <span className="text-blue-500">Log In</span>
        </Link>
      </div>


    </div>
  </>
  );
}
