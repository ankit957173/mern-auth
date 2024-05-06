import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import PageNotFound from './pages/PageNotFound';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute.jsx';

export default function App() {
  return (
    < BrowserRouter>

      {/* header */}
      <Header />
      <Routes>
        {/* <div className="bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"> */}

        <Route path='/' element={<About />} />
        <Route element={<PrivateRoute />} >

          <Route path='/home' element={<Home />} />
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />} >
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/*' element={<PageNotFound />} />
        {/* </div> */}
      </Routes>

    </BrowserRouter>
  )
}
