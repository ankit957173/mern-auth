import React from 'react'
import { useState, useRef, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { ToastNotify } from '../components/ToastNotify'
import { forgotFailure, forgotSucess, forgotStart, clearError } from '../redux/user/userSlice'


const ForgotPassword = () => {
  const passwordRef = useRef();
  const passwordRef2 = useRef();


  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [found, setFound] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(clearError());
  }, [dispatch]);
  useEffect(() => {

    if (error) {
      ToastNotify(error.error)
    }
  })
  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handlePasswordChange = (e) => {
    handlepassword(e);
    setFormData({ ...formData, password: e.target.value });
  };

  const handlepassword = (e) => {
    setPassword(e.target.value);
  };
  const passwordsMatch = password === confirmPassword;
  const showPassword = (fieldId) => {
    const passwordField = document.getElementById(fieldId);
    if (passwordField.type === "password") {
      passwordField.type = "text";
    } else {
      passwordField.type = "password";
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit1 = async (e) => {
    e.preventDefault();
    try {

      dispatch(forgotStart());
      const res = await fetch("/api/auth/findemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      //jaisa ki hum fetch use kr rhe h to hum setError ko ese set krenge
      if (data.success === false) {
        dispatch(forgotFailure(data));
        return;
      }
      dispatch(forgotSucess());
      setFound(true);
      ToastNotify('Enter New Password')
    }
    catch (error) {

      console.log('Email not found');
      console.log(error);
    }
  }

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      dispatch(clearError());

      dispatch(forgotStart());

      const res = await fetch("/api/auth/updatepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(forgotFailure(data));
        return;
      }
      dispatch(forgotSucess());


      ToastNotify('Password Updated Successfully')

      setTimeout(() => {
        navigate('/sign-in');
      }, 3000);

    }
    catch (error) {
      console.log('Failed to update password');
      console.log(error);
    }
  }

  return (found == false ? <><ToastContainer />
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Find Your Account</h1>

      <form onSubmit={handleSubmit1} className="flex flex-col gap-3">

        <input
          required
          type="email"
          placeholder="Enter Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          Search
        </button>

      </form>
      <div className="flex gap-2 mt-5">

        <Link to={"/sign-in"}>

          <span className="text-blue-500">Cancel</span>
        </Link>
      </div>
      <p className="text-red-700 mt-3">{error ? error.error || "Something went wrong in forgot password" : ''}</p>



    </div></>
    :
    <><ToastContainer />
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Set New Password</h1>

        <form onSubmit={handleSubmit2} className="flex flex-col gap-3">


          <div className="relative ">
            <input
              type="password"
              placeholder="Set New Password"
              id="password"
              className="bg-slate-100 p-3 rounded-lg w-full"
              onChange={handlePasswordChange}
              ref={passwordRef}
            />
            <span
              className="absolute right-[3px] top-[4px] cursor-pointer mt-2"
              onClick={() => showPassword('password')}
            >
              <lord-icon
                src="https://cdn.lordicon.com/fmjvulyw.json"
                trigger="hover"
                style={{ width: "25px", height: "25px" }}
              ></lord-icon>
            </span>
          </div>
          <div className="relative ">
            <input
              type="password"
              placeholder="Confirm New Password"
              id="confirmPassword"
              className="bg-slate-100 p-3 rounded-lg w-full"
              onChange={handleChangeConfirmPassword}
              ref={passwordRef2}
            />
            <span
              className="absolute right-[3px] top-[4px] cursor-pointer mt-2"
              onClick={() => showPassword('confirmPassword')}
            >
              <lord-icon
                src="https://cdn.lordicon.com/fmjvulyw.json"
                trigger="hover"
                style={{ width: "25px", height: "25px" }}
              ></lord-icon>
            </span>
          </div>

          <button
            type="submit"
            className={`bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 ${!passwordsMatch && 'opacity-50 pointer-events-none'}`}
            disabled={!passwordsMatch}
          >
            Update Password
          </button>

        </form>
        <div className="flex gap-2 mt-5">

          <Link to={"/sign-in"}>

            <span className="text-blue-500">Cancel</span>
          </Link>
        </div>
        <p className="text-red-700 mt-3">{error ? error.error || "Something went wrong in forgot password" : ''}</p>

      </div>
    </>
  )
}

export default ForgotPassword
