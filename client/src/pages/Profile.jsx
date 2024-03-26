import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase'
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserSuccess, deleteUserStart } from '../redux/user/userSlice';

export default function Profile() {
    const dispatch = useDispatch()
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);

    const [image, setImage] = useState(undefined);
    const [imagePercent, setimagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false);
    useEffect(() => {
        if (image) { handleFileUpload(image); }
    }, [image]);
    const handleFileUpload = async (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setimagePercent(Math.round(progress));
            },
            (error) => {
                setImageError(true);
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, profilePicture: downloadURL })
                );
            }
        );
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
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

        } catch (error) {
            dispatch(updateUserFailure(error));
            // console.log(error);
        }
    };
    const handleDelete = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data));
                return;
            }
            dispatch(deleteUserSuccess(data));
            // deleteUserStart(true);
        } catch (error) {
            dispatch(deleteUserFailure(error));
            // console.log(error);
        }
    };
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                {/* useRef reference ke liye kaam aata h file ka ref image se h yaha */}
                {/** firebase storage rules 
                  match /{allPaths=**} {
      allow read;
      allow write: if 
      request.resource.size< 3*1024*1024 &&
      request.resource.contentType.matches('image/.*');
    } */}
                <input type="file" ref={fileRef} className="hidden"
                    accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
                <img src={formData.profilePicture || currentUser.profilePicture}
                    alt="profile"
                    className='h-24 w-24 self-center 
                    cursor-pointer rounded-full object-cover mt-2'
                    onClick={() => fileRef.current.click()} />
                <p className='text-sm self-center'>{imageError ? (
                    <span className='text-red-700'>Error uploading image(file
                        must be less than 3)</span>
                ) : imagePercent > 0 && imagePercent < 100 ? (
                    <span className='text-slate-700'>{`Uploading: ${imagePercent}%`}</span>
                ) : imagePercent === 100 ? (
                    <span className='text-green-700'>Image uploaded successfully!</span>
                )
                    : ('')}

                </p>
                <input defaultValue={currentUser.username} type="text" id='username' placeholder='Username' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
                <input defaultValue={currentUser.email} type="email" id='email' placeholder='Email' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
                <input type="password" id='password' placeholder='Password' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
                <button className='bg-slate-700 text-white p-3 rounded-lg
                 uppercase hover:opacity-90 disabled:opacity-80'> {loading ? 'Loading...' : 'Update'}</button>
            </form>
            <div className="flex justify-between mt-3">
                <span className="bg-transparent hover:bg-red-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent cursor-pointer rounded"
                    onClick={handleDelete}>Delete Account</span>
                <span className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded cursor-pointer">Sign out</span>
            </div>
            <p className='text-green-700'>{loading && "Updating profile..."}</p>
            <p className='text-green-700'>{updateSuccess && "Profile updated successfully!"}</p>
            <p className='text-red-700'>{error && "Something went wrong!"}</p>
        </div>
    )
}
