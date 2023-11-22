import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    cards: [],
    subscription: null
}

export const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setCards: (state, action) => {
            state.cards = action.payload
        },
        setSubscription: (state, action) => {
            state.subscription = action.payload
        }
    }
})

export const {
    setCards,
    setSubscription
} = subscriptionSlice.actions

export default subscriptionSlice.reducer