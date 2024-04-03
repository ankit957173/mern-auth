import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpFailure, signUpStart, signUpSuccess, clearError } from "../redux/user/userSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import OAuth from "../components/OAuth";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    // Dispatch an action to clear the error when the component mounts or when the page is refreshed
    dispatch(clearError());
  }, [dispatch]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
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

      //jaisa ki hum fetch use kr rhe h to hum setError ko ese set krenge
      // if errorHandler contains error then show error

      if (data.success === false) {
        dispatch(signUpFailure(data));
        return;
      }
      //console.log(data)


      dispatch(signUpSuccess(data));

      navigate("/sign-in");

    } catch (error) {
      dispatch(signUpFailure(error));
      // console.log(error);
    }
    //reset the form data to empty on submit
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
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
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        {/* link may be without { } also */}
        <Link to={"/sign-in"}>

          <span className="text-blue-500">Sign In</span>
        </Link>
      </div>
      <p className="text-red-700 mt-3">{error ? error.error || "Something went wrong in SignUp" : ""}</p>


    </div>
  );
}
