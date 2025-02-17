import React from 'react';

const About = () => {
    return (
        <main className='px-4 py-12 max-w-2xl mx-auto'>
            <div className="animate-bounce">
                <h1 className="text-5xl font-bold text-center text-gray-800">About</h1>
            </div>
            <p className='mb-4 text-slate-700'>
                This project is developed and managed by <span className='font-bold'>Ankit Singh Tanwar</span>. Currently, this
                application offers various functionalities such as <span className='font-bold'>SignUp</span>, <span className='font-bold'>SignIn</span>, <span className='font-bold'>SignIn with Google</span>, <span className='font-bold'>Update Profile (including Password, Profile Picture, Email, Username)</span>. It also includes high-level server-side constraints like <span className='font-bold'>password length and complexity checks</span>, <span className='font-bold'>user existence checks</span>, <span className='font-bold'>email validity checks</span>, and <span className='font-bold'>username and email uniqueness</span>. It also provides access to the Home page only to authenticated users.
            </p>
            <p className='mb-4 text-slate-700'>
                The Home Page consists of a <span className='font-bold'>Password Manager</span> for you to store passwords of different websites, so no more remembering passwords. The next page consists of a <span className='font-bold'>TrustLink Enquiry Form</span> which you can integrate with websites that require data collection, such as course selling websites or college admission enquiry forms. It allows you to collect data and send it to admins.
                The first and basic step to test this project is <span className='font-bold'>authentication</span>. You need to authenticate yourself, and after <span className='font-bold'>SignUp/SignIn</span>, you will be redirected to the home/<span className='font-bold'>Password Manager</span>. Then you can test this project.
            </p>
            <p className='mb-4 text-slate-700'>
                The front-end of the application is built with <span className='font-bold'>React</span> and uses <span className='font-bold'>React Router</span> for client-side routing. The back-end is built with <span className='font-bold'>Node.js</span> and <span className='font-bold'>Express</span>, and <span className='font-bold'>MongoDB</span> is used as the database. Authentication is implemented using <span className='font-bold'>JSON Web Tokens (JWT)</span> and <span className='font-bold'>OAuth</span>.
            </p>
            <p className='mb-4 text-slate-700'>
                Check out my second app, <a href="https://chatty-tepr.onrender.com/" className='font-bold text-green-500  '>Chatty</a>, a real-time chat application with cool features like changing to more than 32 themes and sending cool messages/images to friends with Realtime filter Online/Offline Status.
            </p>
        </main>
    );
}

export default About;