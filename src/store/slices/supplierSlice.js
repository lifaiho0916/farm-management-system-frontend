import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    suppliers: []
}

export const supplierSlice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        setSuppliers: (state, action) => {
            state.suppliers = action.payload
        }
    }
})

export const {
    setSuppliers
} = supplierSlice.actions

export default supplierSlice.reducer