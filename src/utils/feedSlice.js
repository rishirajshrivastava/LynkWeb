import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            state = action.payload;
            return state;
        },
        removeFeed: (state) => {
            state = null;
            return state;
        }
    },
})

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;