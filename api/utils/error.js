import { toast } from 'react-toastify';

export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.message = message;
    error.statusCode = statusCode;

    // Show toast notification
    toast(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    return error;
}
