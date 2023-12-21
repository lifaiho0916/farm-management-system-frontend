import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    toPay: null,
    toPays: []
}

export const toPaySlice = createSlice({
    name: 'toPay',
    initialState,
    reducers: {
        setToPay: (state, action) => {
            state.toPay = action.payload
        },
        setToPays: (state, action) => {
            state.toPays = action.payload
        }
    }
})

export const {
    setToPay,
    setToPays
} = toPaySlice.actions

export default toPaySlice.reducer