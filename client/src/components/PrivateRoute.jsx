import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'


export default function PrivateRoute() {
    // btao isme page navigate ho hi nhi rha tha { } currentUser ko {} isme bnd nhi kiya tha
    const { currentUser } = useSelector((state) => state.user)
    return currentUser ? <Outlet /> : <Navigate to='/sign-in' />

}
