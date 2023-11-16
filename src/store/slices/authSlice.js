import { createSlice } from '@reduxjs/toolkit';
import { AUTH_TOKEN } from 'constants/AuthConstant';

export const initialState = {
    loading: false,
    message: '',
    showMessage: false,
    redirect: '',
    token: localStorage.getItem(AUTH_TOKEN) || null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticated: (state, action) => {
            state.redirect = '/'
            state.token = action.payload
        },
        showAuthMessage: (state, action) => {
            state.message = action.payload
            state.showMessage = true
        },
        hideAuthMessage: (state) => {
            state.message = ''
            state.showMessage = false
        },
        signOutSuccess: (state) => {
            state.token = null
            state.redirect = '/'
        },
        showLoading: (state) => {
            state.loading = true
        },
        hideLoading: (state) => {
            state.loading = false
        },
        signInSuccess: (state, action) => {
            state.token = action.payload
        }
    }
})

export const {
    authenticated,
    showAuthMessage,
    hideAuthMessage,
    signOutSuccess,
    showLoading,
    hideLoading,
    signInSuccess
} = authSlice.actions

export default authSlice.reducer