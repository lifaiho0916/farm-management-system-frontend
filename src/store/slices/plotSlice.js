import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    plots: []
}

export const plotSlice = createSlice({
    name: 'plots',
    initialState,
    reducers: {
        setPlots: (state, action) => {
            state.plots = action.payload
        }
    }
})

export const {
    setPlots
} = plotSlice.actions

export default plotSlice.reducer