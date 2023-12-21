import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    productSale: null,
    productSales: []
}

export const productSaleSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        setProductSale: (state, action) => {
            state.productSale = action.payload
        },
        setProductSales: (state, action) => {
            state.productSales = action.payload
        }
    }
})

export const {
    setProductSale,
    setProductSales
} = productSaleSlice.actions

export default productSaleSlice.reducer