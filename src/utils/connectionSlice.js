import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        addConnections: (state, action) => action.payload,
        addConnection: (state, action) => {
            if (state && Array.isArray(state)) {
                // Add new connection to the beginning of the array
                return [action.payload, ...state];
            }
            return [action.payload];
        },
        removeConnections: () => null,
    }
})
export const { addConnections, addConnection, removeConnections } = connectionSlice.actions
export default connectionSlice.reducer