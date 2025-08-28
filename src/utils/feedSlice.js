import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        // Set or replace feed array
        addFeed: (state, action) => {
            return action.payload;
        },
        // Clear feed entirely (used on logout)
        removeFeed: () => {
            return null;
        },
        // Remove a single profile by id from the feed array
        removeFromFeed: (state, action) => {
            if (Array.isArray(state)) {
                return state.filter(item => item._id !== action.payload);
            }
            if (state && Array.isArray(state?.data)) {
                return { ...state, data: state.data.filter(item => item._id !== action.payload) };
            }
            return state;
        }
    },
})

export const { addFeed, removeFeed, removeFromFeed } = feedSlice.actions;
export default feedSlice.reducer;