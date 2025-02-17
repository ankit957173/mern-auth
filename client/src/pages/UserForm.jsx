import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    // Fetch currentUser from state using useSelector
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        if (currentUser) {
            // Include currentUser's email in the formData
            setFormData((prevFormData) => ({
                ...prevFormData,
                accountHolderEmail: currentUser.email
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Ensure the name fields do not contain numbers
        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            e.target.value = value.replace(/\d/g, '');
        }

        // Set the form data
        setFormData({ ...formData, [name]: e.target.value });
    };

    const isEmailValid = (email) => {
        // Basic email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate mobile number length
        if (formData.mobileNumber.length !== 10) {
            toast.error('Mobile number must be exactly 10 digits.', { autoClose: 3000 });
            return; // Prevent form submission
        }

        // Validate email format
        if (formData.email && !isEmailValid(formData.email)) {
            toast.error('Please enter a valid email address.', { autoClose: 3000 });
            return; // Prevent form submission
        }

        setLoading(true); // Set loading to true when form submission starts

        const response = await fetch('/api/auth/send-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        setLoading(false); // Set loading to false when form submission is done
        if (response.ok) {
            toast.success('Form submitted successfully!', { autoClose: 3000 });
            setFormData({
                firstName: '',
                middleName: '',
                lastName: '',
                mobileNumber: '',
                email: '',
                message: '',
                accountHolderEmail: currentUser ? currentUser.email : ''
            }); // Clear form data
            console.log("Form data sent successfully!");
        } else {
            toast.error('Error submitting the form.', { autoClose: 3000 });
            console.error("Error sending form data");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">TrustLink Enquiry Form</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Middle Name</label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Mobile Number</label>
                        <input
                            type="number"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="submit-button w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <div className="dotted-spinner">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    ) : (
                        'Submit'
                    )}
                </button>
            </form>
        </div>
    );
};

export default UserForm;