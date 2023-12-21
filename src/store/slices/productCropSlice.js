import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    productCrop: null,
    productCrops: []
}

export const productCropSlice = createSlice({
    name: 'crops',
    initialState,
    reducers: {
        setProductCrop: (state, action) => {
            state.productCrop = action.payload
        },
        setProductCrops: (state, action) => {
            state.productCrops = action.payload
        }
    }
})

export const {
    setProductCrop,
    setProductCrops
} = productCropSlice.actions

export default productCropSlice.reducer