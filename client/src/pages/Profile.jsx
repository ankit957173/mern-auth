import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase';
import { ToastNotify } from '../components/ToastNotify';
import { signOut, updateUserStart, updateUserSuccess, clearError, updateUserFailure, deleteUserFailure, deleteUserSuccess, deleteUserStart } from '../redux/user/userSlice';
import { ToastContainer } from 'react-toastify';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const passwordRef = useRef();
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);

    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (image) { handleFileUpload(image); }
    }, [image]);

    useEffect(() => {
        if (error) {
            ToastNotify(error.error);
        }
        dispatch(clearError());
    }, [error, dispatch]);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username,
                email: currentUser.email,
                profilePicture: currentUser.profilePicture,
            });
        }
    }, [currentUser]);

    if (!currentUser || !currentUser.verified) {
        return <Navigate to="/verify-otp" replace />;
    }

    const handleFileUpload = async (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagePercent(Math.round(progress));
            },
            (error) => {
                setImageError(true);
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData((prevFormData) => ({ ...prevFormData, profilePicture: downloadURL }))
                );
            }
        );
    };

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
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            ToastNotify('Profile Updated');
            setTimeout(() => {
                navigate("/home");
            }, 3000);
        } catch (error) {
            dispatch(updateUserFailure(error));
            console.log(error);
        }
    };

    const getTokenFromCookies = () => {
        const tokenCookie = document.cookie
            .split(';')
            .find(row => row.trim().startsWith('access_token='));

        if (!tokenCookie) {
            return undefined;
        }

        // Split the cookie into key and value, and decode the value
        const token = tokenCookie.split('=')[1].trim();
        return decodeURIComponent(token);
    };

    const handleDelete = async () => {
        try {
            const confirmDelete = window.confirm("Do you really want to delete your account?");
            if (confirmDelete) {

                dispatch(deleteUserStart());
                const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                    method: "DELETE",

                });
                const data = await res.json();
                if (data.success === false) {
                    dispatch(deleteUserFailure(data));
                    return;
                }

                dispatch(deleteUserSuccess());
                ToastNotify('Account Deleted');
                navigate("/sign-in", { state: { fromLogout: true } }); // Redirect to sign-in page with fromLogout state
            }
        } catch (error) {
            dispatch(deleteUserFailure(error));
            console.log(error);
        }
    };

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/auth/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                dispatch(signOut()); // Clear user state in Redux
                navigate("/sign-in", { state: { fromLogout: true } }); // Redirect to sign-in page with fromLogout state
            } else {
                console.error("Signout failed");
            }
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='p-3 max-w-lg mx-auto'>
                <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input
                        type="file"
                        ref={fileRef}
                        className="hidden"
                        accept='image/*'
                        onChange={(e) => { setImageError(false); setImage(e.target.files[0]); }}
                    />
                    <img
                        src={formData.profilePicture || currentUser.profilePicture}
                        alt="profile"
                        className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
                        onClick={() => fileRef.current.click()}
                    />
                    <div className='text-sm self-center'>
                        <p>Click Above to Update Profile Image!</p>
                        {imageError ? (
                            <span className='text-red-700'>Error uploading image (file size must be less than 5 MB)</span>
                        ) : imagePercent > 0 && imagePercent < 100 ? (
                            <div className="rounded-lg dark:bg-gray-700 shadow-lg transition-all duration-500 ease-in-out">
                                <div
                                    className="rounded-lg bg-blue-600 text-md font-medium text-blue-100 text-center p-2 shadow-inner transition-width duration-500 ease-in-out"
                                    style={{ width: `${imagePercent}%`, fontSize: "1.5rem" }}
                                >
                                    {imagePercent}%
                                </div>
                            </div>
                        ) : imagePercent === 100 ? (
                            <span className='text-green-700 font-semibold text-lg'>Image uploaded successfully!</span>
                        ) : ('')}
                    </div>
                    <input
                        defaultValue={currentUser.username}
                        type="text"
                        id='username'
                        placeholder='Username'
                        className='bg-slate-100 rounded-lg p-3'
                        onChange={handleChange}
                    />
                    <input
                        defaultValue={currentUser.email}
                        type="email"
                        id='email'
                        placeholder='Email'
                        className='bg-slate-100 rounded-lg p-3'
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
                    <button
                        type='submit'
                        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80'
                    >
                        {loading ? 'Loading...' : 'Update'}
                    </button>
                </form>
                <div className="flex justify-between mt-3">
                    <span
                        className="bg-transparent hover:bg-red-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent cursor-pointer rounded"
                        onClick={handleDelete}
                    >
                        Delete Account
                    </span>
                    <span
                        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded cursor-pointer"
                        onClick={handleSignout}
                    >
                        Log out
                    </span>
                </div>
            </div>
        </>
    );
}