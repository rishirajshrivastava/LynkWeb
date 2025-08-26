import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addUser: (state, action) => {
            if (action.payload && action.payload.user) {
                return action.payload.user;
            } else if (action.payload) {
                return action.payload;
            }
            return null;
        },
        removeUser: (state, action) => {
            return null;
        },
    }
})

export const {addUser,removeUser} = userSlice.actions;
export default userSlice.reducer;