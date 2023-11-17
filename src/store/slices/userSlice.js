import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    users: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        }
    }
})

export const {
    setUsers
} = userSlice.actions

export default userSlice.reducer