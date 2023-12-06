import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    productCrops: []
}

export const productCropSlice = createSlice({
    name: 'crops',
    initialState,
    reducers: {
        setProductCrops: (state, action) => {
            state.productCrops = action.payload
        }
    }
})

export const {
    setProductCrops
} = productCropSlice.actions

export default productCropSlice.reducer