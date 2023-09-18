import { createSlice } from '@reduxjs/toolkit';
import { createCustomerThunk } from '../thunks/BuyerShowsThunk';
// import { GetPosts, UserLoggedIn, UserRegistration, forgotPassword } from '../thunks/authThunk';

export const initialState = {
    userData: []
};

const userDetailSlice = createSlice({
    name: 'userDetailSlice',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            console.log("state", state)
            console.log("action", action)
            state.userData = action?.payload
        },
        resetUserSlice: (state) => {
            state.userData = []
        }
    },
});

export const { setUserInfo, resetUserSlice } = userDetailSlice.actions;
export default userDetailSlice.reducer;