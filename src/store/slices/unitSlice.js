import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    unit: null,
    units: []
}

export const unitSlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setUnit: (state, action) => {
            state.unit = action.payload
        },
        setUnits: (state, action) => {
            state.units = action.payload
        }
    }
})

export const {
    setUnit,
    setUnits
} = unitSlice.actions

export default unitSlice.reducer