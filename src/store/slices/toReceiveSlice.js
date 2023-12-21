import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    toReceive: null,
    toReceives: []
}

export const toReceiveSlice = createSlice({
    name: 'toReceives',
    initialState,
    reducers: {
        setToReceive: (state, action) => {
            state.toReceive = action.payload
        },
        setToReceives: (state, action) => {
            state.toReceives = action.payload
        }
    }
})

export const {
    setToReceive,
    setToReceives
} = toReceiveSlice.actions

export default toReceiveSlice.reducer