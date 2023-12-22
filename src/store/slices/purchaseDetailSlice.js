import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    purchaseDetails: []
}

export const purchaseDetailSlice = createSlice({
    name: 'purchaseDetail',
    initialState,
    reducers: {
        setPurchaseDetails: (state, action) => {
            state.purchaseDetails = action.payload
        }
    }
})

export const {
    setPurchaseDetails
} = purchaseDetailSlice.actions

export default purchaseDetailSlice.reducer