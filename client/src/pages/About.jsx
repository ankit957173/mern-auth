import React from 'react';

const About = () => {
    return (
        <main className='px-4 py-12 max-w-2xl mx-auto'>
            <div className="animate-bounce">
                <h1 className="text-5xl font-bold text-center text-gray-800">About Us</h1>
            </div>
            <p className='mb-4 text-slate-700'>Our E-Authentication application, a project submitted to Rajasthan Technical University, Kota, is built using the MERN stack (MongoDB, Express, React, Node.js). It was developed by <span className='font-bold'>Ankit Singh Tanwar</span>, <span className='font-bold'>Arti Shekhawat</span>, <span className='font-bold'>Deependra Singh Shekhawat</span>, and <span className='font-bold'>Manisha</span> as part of the requirements for a Bachelor of Technology degree in Computer Science Engineering.</p>
            <p className='mb-4 text-slate-700'>
                The application offers various functionalities such as SignUp, SignIn, SignInWithGoogle, UpdateProfile (including Password, Profile Picture, Email, Username). It also includes high-level server-side constraints like password length and complexity checks, user existence checks, email validity checks, and username and email uniqueness checks. It also provides access to protected routes only for authenticated users.
            </p>
            <p className='mb-4 text-slate-700'>
                The front-end of the application is built with React and uses React Router for client-side routing. The back-end is built with Node.js and Express, and MongoDB is used as the database. Authentication is implemented using JSON Web Tokens (JWT).
            </p>
            <p className='mb-4 text-slate-700'>
                The project is deployed on Google Cloud Platform with all data stored in the cloud. It is designed to provide new user sign-ups, sign-ins, sign-outs, profile updates, and account deletion. It also includes functionality to prevent unauthenticated users from accessing certain pages.
            </p>
        </main>
    );
}

export default About;
