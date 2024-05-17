import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentUser: null,
    loading: false,
    error: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        clearError: (state) => {
            state.error = false;
            state.loading = false;
        },
        signUpStart: (state) => {
            state.loading = true;
        },
        signUpSuccess: (state, action) => {
            state.loading = false;
            state.error = false;
        },
        signUpFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        forgotStart: (state) => {
            state.loading = true;
        },
        forgotSucess: (state, action) => {
            state.loading = false;
            state.error = false;
        },
        forgotFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const {
    clearError,
    signUpFailure, signUpStart, signUpSuccess,
    signInStart, signInSuccess,
    signInFailure, updateUserStart,
    updateUserSuccess, updateUserFailure
    , deleteUserStart, deleteUserSuccess,
    deleteUserFailure,
    signOut, forgotSucess, forgotFailure, forgotStart
} = userSlice.actions;
export default userSlice.reducer;