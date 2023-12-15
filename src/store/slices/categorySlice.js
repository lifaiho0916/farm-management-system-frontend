import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    category: null,
    categories: []
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload
        },
        setCategories: (state, action) => {
            state.categories = action.payload
        }
    }
})

export const {
    setCategory,
    setCategories
} = categorySlice.actions

export default categorySlice.reducer