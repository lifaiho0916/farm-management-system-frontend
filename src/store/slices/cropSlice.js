import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    crops: []
}

export const cropSlice = createSlice({
    name: 'crops',
    initialState,
    reducers: {
        setCrops: (state, action) => {
            state.crops = action.payload
        }
    }
})

export const {
    setCrops
} = cropSlice.actions

export default cropSlice.reducer