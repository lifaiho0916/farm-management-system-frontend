import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    supplier: null,
    suppliers: []
}

export const supplierSlice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        setSupplier: (state, action) => {
            state.supplier = action.payload
        },
        setSuppliers: (state, action) => {
            state.suppliers = action.payload
        }
    }
})

export const {
    setSupplier,
    setSuppliers
} = supplierSlice.actions

export default supplierSlice.reducer