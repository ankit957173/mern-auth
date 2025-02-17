import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';

import { clearError } from '../redux/user/userSlice';
import { ToastContainer } from 'react-toastify';

import { ToastNotify } from '../components/ToastNotify';

const Home = () => {
    const passwordRef = useRef();
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const { currentUser, error } = useSelector((state) => state.user);
    const [passwordArray, setPasswordArray] = useState(currentUser?.savedData || []);

    const getPasswords = async () => {
        try {
            const response = await fetch(`/api/user/getPasswords/${currentUser._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setPasswordArray(data);
        } catch (error) {
            console.error("Error in fetching data:", error);
        }
    };

    useEffect(() => {
        if (error) {
            ToastNotify(error.error);
        }
        dispatch(clearError());
        getPasswords();
    }, [error]);

    const savePassword = async (event) => {
        event.preventDefault();

        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newId = uuidv4(); // Generate a new UUID and store it in a variable
            await fetch(`/api/user/pushPassword/${currentUser._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: newId })
            });
            setPasswordArray([...passwordArray, { ...form, id: newId }]);
            setForm({ site: "", username: "", password: "" });
            ToastNotify('Password Saved!');
            getPasswords();
        } else {
            ToastNotify('Minimum 4 characters required');
        }
    };

    const deletePassword = async (id) => {
        let c = confirm("Do you really want to delete this password?");
        if (c) {
            await fetch(`/api/user/deleteParticularPassword/${currentUser._id}/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            setPasswordArray(passwordArray.filter(item => item.id !== id));
            ToastNotify('Password Deleted!');
        }
    };

    const editPassword = async (id) => {
        try {
            setForm({ ...passwordArray.filter(i => i.id === id)[0], id: id });
            await fetch(`/api/user/deleteParticularPassword/${currentUser._id}/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            setPasswordArray(passwordArray.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting password:", error);
            return;
        }
    };

    const copyText = (text) => {
        ToastNotify('Copied to clipboard!');
        navigator.clipboard.writeText(text);
    };

    const showPassword = () => {
        if (passwordRef.current.type === "password") {
            passwordRef.current.type = "text";
        } else {
            passwordRef.current.type = "password";
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer />
            <div className="absolute inset-0 -z-10 h-full w-full bg-=-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gray-500 opacity-20 blur-[100px]"></div>
            </div>
            <div className=" p-3 md:mycontainer min-h-[88.2vh] ">
                <h1 className='text-4xl text font-bold text-center'>
                    <span className='text-green-500'> &lt;</span>
                    <span>Trust</span><span className='text-green-500'>Link/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>

                <form onSubmit={savePassword}>
                    <div className="flex flex-col p-4 text-black gap-8 items-center">
                        <input ref={inputRef} value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="site" id="site" />
                        <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                            <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="username" id="username" />
                            <div className="relative">
                                <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name="password" id="password" />
                                <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/fmjvulyw.json"
                                        trigger="hover"
                                        style={{ "width": "25px", "height": "25px" }}>
                                    </lord-icon>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button type='submit' className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900'>
                            <lord-icon
                                src="https://cdn.lordicon.com/jgnvfzqg.json"
                                trigger="hover" >
                            </lord-icon>
                            Save
                        </button>
                    </div>
                </form>

                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div> No passwords to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.length > 0 ? (
                                passwordArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center '>
                                                <a href={item.site} target='_blank'>{item.site}</a>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center '>
                                                <span>{item.username}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center '>
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='justify-center py-2 border border-white text-center'>
                                            <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                                <lord-icon src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}></td>
                                </tr>
                            )}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    )
}

export default Home;