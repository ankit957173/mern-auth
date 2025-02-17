import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ToastNotify } from './ToastNotify';

const PrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const [justLoggedOut, setJustLoggedOut] = useState(false);

    useEffect(() => {
        if (location.state?.fromLogout) {
            setJustLoggedOut(true);
        } else if (!currentUser && location.pathname !== "/sign-in" && location.pathname !== "/sign-up" && location.pathname !== "/" && !justLoggedOut) {
            ToastNotify('You are not logged in. Please log in to access this page.');
        }
    }, [currentUser, location.pathname, location.state, justLoggedOut]);

    useEffect(() => {
        if (justLoggedOut) {
            const timer = setTimeout(() => {
                setJustLoggedOut(false);
            }, 3000); // Reset after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [justLoggedOut]);

    return currentUser && currentUser.verified ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;