# Authentication Project

## Introduction

Welcome to Authentication App! This is a full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack. It includes authentication features that allow users to sign up, log in, and log out, and provides access to protected routes only for authenticated users.

The front-end of the application is built with React and uses React Router for client-side routing. The back-end is built with Node.js and Express, and uses MongoDB as the database. Authentication is implemented using JSON Web Tokens (JWT) and OAuth.

This application is intended as a starting point for building full-stack web applications with authentication using the MERN stack. You can add anything as a homepage for your application.

## Live Demo

The application is deployed at [https://mern-auth-axuo.onrender.com/](https://mern-auth-axuo.onrender.com/)

## Environment Variables

The application uses the following environment variables:

- `JWT_SECRET`: Your JWT secret key
- `MONGO`: Your MongoDB Atlas URL
- `VITE_API_SECRET_KEY`: Your API secret key

If anyone requests these environment variables, I will send them unconditionally.

## Features

- User registration and login
- Access control with protected routes
- Profile picture update
- Email, username, and password update
- User deletion
- Google Sign-In
- Password length and complexity checks
- User existence checks
- Email validity checks
- Username and email uniqueness

## Running the Project Locally

Please ensure that you have installed all the necessary dependencies before running the project.

1. Head to the root folder and run `npm install`. Navigate to the `client` directory and run `npm install`.

You can run the project on your local machine by following these steps:

1. Open two separate command line interfaces (CLI).
2. In the first CLI, navigate to the `client` directory and run the command `npm run dev`.
3. In the second CLI, navigate to the `api` directory and run the command `npm run dev`.

## Additional Features

Check out my second app, [Chatty](https://chatty-tepr.onrender.com/), a real-time chat application with cool features like changing to more than 32 themes and sending cool messages and images to friends.