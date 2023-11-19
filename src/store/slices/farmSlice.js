import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    farms: []
}

export const farmSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setFarms: (state, action) => {
            state.farms = action.payload
        }
    }
})

export const {
    setFarms
} = farmSlice.actions

export default farmSlice.reducer