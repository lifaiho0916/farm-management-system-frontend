import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    categories: []
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload
        }
    }
})

export const {
    setCategories
} = categorySlice.actions

export default categorySlice.reducer