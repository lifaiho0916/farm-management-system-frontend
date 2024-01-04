import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    purchaseDetail: null,
    purchaseDetails: []
}

export const purchaseDetailSlice = createSlice({
    name: 'purchaseDetail',
    initialState,
    reducers: {
        setPurchaseDetail: (state, action) => {
            state.purchaseDetail = action.payload
        },
        setPurchaseDetails: (state, action) => {
            state.purchaseDetails = action.payload
        }
    }
})

export const {
    setPurchaseDetail,
    setPurchaseDetails
} = purchaseDetailSlice.actions

export default purchaseDetailSlice.reducer