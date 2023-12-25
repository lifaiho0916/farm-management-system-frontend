import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    stocks: []
}

export const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {
        setStocks: (state, action) => {
            state.stocks = action.payload
        }
    }
})

export const {
    setStocks
} = stockSlice.actions

export default stockSlice.reducer