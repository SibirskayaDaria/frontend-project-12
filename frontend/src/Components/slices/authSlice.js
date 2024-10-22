import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: localStorage.getItem("auth.username") || null,
    token: localStorage.getItem("auth.token") || null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        showState: (state) => {
            console.log(state);
        },

        setUserInfo: (state, action) => {
            state.token = action.payload.token;
            state.username = action.payload.username;
            window.localStorage.setItem("auth.token", action.payload.token);
            window.localStorage.setItem("auth.username", action.payload.username);
        }
    },
});


export const { showState, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
export const selectToken = (state) => state.auth.token;