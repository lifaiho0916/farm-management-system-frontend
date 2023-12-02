import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    farm: null,
    farms: []
}

export const farmSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setFarm: (state, action) => {
            state.farm = action.payload
        },
        setFarms: (state, action) => {
            state.farms = action.payload
        }
    }
})

export const {
    setFarm,
    setFarms
} = farmSlice.actions

export default farmSlice.reducer