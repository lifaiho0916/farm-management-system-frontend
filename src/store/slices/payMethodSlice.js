import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    payMethods: []
}

export const payMethodSlice = createSlice({
    name: 'payMethod',
    initialState,
    reducers: {
        setPayMethods: (state, action) => {
            state.payMethods = action.payload
        }
    }
})

export const {
    setPayMethods
} = payMethodSlice.actions

export default payMethodSlice.reducer