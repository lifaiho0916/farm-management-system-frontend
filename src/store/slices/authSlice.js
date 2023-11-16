import { createSlice } from '@reduxjs/toolkit';
import { AUTH_TOKEN } from 'constants/AuthConstant';

export const initialState = {
    user: null,
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
            localStorage.removeItem(AUTH_TOKEN)
        },
        showLoading: (state) => {
            state.loading = true
        },
        hideLoading: (state) => {
            state.loading = false
        },
        signInSuccess: (state, action) => {
            localStorage.setItem(AUTH_TOKEN, action.payload)
            state.token = action.payload
        },
        setAuthUser: (state) => {
            state.user = state.payload
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
    signInSuccess,
    setAuthUser
} = authSlice.actions

export default authSlice.reducer