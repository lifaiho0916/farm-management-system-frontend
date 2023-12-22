import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    purchase: null,
    purchases: []
}

export const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        setPurchase: (state, action) => {
            state.purchase = action.payload
        },
        setPurchases: (state, action) => {
            state.purchases = action.payload
        }
    }
})

export const {
    setPurchase,
    setPurchases
} = purchaseSlice.actions

export default purchaseSlice.reducer