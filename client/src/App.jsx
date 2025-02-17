import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import VerifyOtp from './pages/VerifyOtp';
import PageNotFound from './pages/PageNotFound';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import UserForm from './pages/UserForm.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/form" element={<UserForm />} />

        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
