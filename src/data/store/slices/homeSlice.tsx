import { createSlice } from '@reduxjs/toolkit';
// import { GetPosts, UserLoggedIn, UserRegistration, forgotPassword } from '../thunks/authThunk';

export const initialState = {
    objCurrentLocationOfUser: {}
};

const homeSlice = createSlice({
    name: 'homeSlice',
    initialState,
    reducers: {
        resetHomeSlice: (state) => {
            state.objCurrentLocationOfUser = {}
        }
        // setCurrentLocationOfUser: (state, action) => {
        //     state.objCurrentLocationOfUser = action?.payload
        // }
    },
});
export const {resetHomeSlice} = homeSlice.actions
// export const { setCurrentLocationOfUser } = homeSlice.actions;
export default homeSlice.reducer;