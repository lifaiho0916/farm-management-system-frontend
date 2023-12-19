import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    purchases: []
}

export const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        setPurchases: (state, action) => {
            state.purchases = action.payload
        }
    }
})

export const {
    setPurchases
} = purchaseSlice.actions

export default purchaseSlice.reducer