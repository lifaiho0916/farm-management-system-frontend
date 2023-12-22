import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    payMethod: null,
    payMethods: []
}

export const payMethodSlice = createSlice({
    name: 'payMethod',
    initialState,
    reducers: {
        setPayMethod: (state, action) => {
            state.payMethod = action.payload
        },
        setPayMethods: (state, action) => {
            state.payMethods = action.payload
        }
    }
})

export const {
    setPayMethod,
    setPayMethods
} = payMethodSlice.actions

export default payMethodSlice.reducer