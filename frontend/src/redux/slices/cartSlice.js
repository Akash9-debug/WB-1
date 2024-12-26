import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0
    },
    reducers: {
        initializeCart: (state, action) => {
            if (action.payload) {
                state.items = action.payload.items || [];
                state.total = action.payload.total || 0;
            } else {
                state.items = [];
                state.total = 0;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    }
});

export const { initializeCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 