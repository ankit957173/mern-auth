import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { signInStart, signInSuccess, signInFailure, clearError } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function SignIn() {
  const passwordRef = useRef();
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // loading = false;
    // Dispatch an action to clear the error when the component mounts or when the page is refreshed
    dispatch(clearError());
  }, [dispatch]);
  useEffect(() => {
    // Focus on the input field when the component mounts
    inputRef.current.focus();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const showPassword = () => {
    // passwordRef.current.type = "text"
    if (passwordRef.current.type === "password") {
      // ref.current.src = "icons/eye.png"
      passwordRef.current.type = "text"
    }
    else {
      passwordRef.current.type = "password"
      // ref.current.src = "icons/eyecross.png"
    }

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    //isme puri url se bhi kr skte the lekin ab half url vite.config.js me daal diye as a proxy

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
      dispatch(signInSuccess(data));
      navigate("/home");
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    } catch (error) {
      dispatch(signInFailure(error));
    }

    //reset the form data to empty on submit
    // reset the error to false

  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          ref={inputRef}
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
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an account?</p>
        {/* link may be without { } also */}
        <Link to={"/sign-up"}>

          <span className="text-blue-500">Sign Up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-3">{error ? error.error || "Something went wrong in signin" : ''}</p>
      {/* toast the error and show the error in toast */}



    </div>
  );
}
