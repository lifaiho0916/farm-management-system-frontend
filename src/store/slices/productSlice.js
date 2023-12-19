import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    product: null,
    products: []
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.product = action.payload
        },
        setProducts: (state, action) => {
            state.products = action.payload
        }
    }
})

export const {
    setProduct,
    setProducts
} = productSlice.actions

export default productSlice.reducer