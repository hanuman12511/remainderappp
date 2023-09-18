import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSellerScheduledShowListLoadMoreThnuk, getSellerScheduledShowListThnuk,getSellerScheduledShowSearch } from '../thunks/sellerShowsThunk';

export const initialState = {
    sellerScheduleShowLists: [],
    isSellListPageEnd: false
};

const sellerShowSlice = createSlice({
    name: 'sellerShowSlice',
    initialState,

    reducers: {
        setIsSellListPageEnd: (state, action) => {
            state.isSellListPageEnd = action?.payload
        },
        resetSellerSlice: (state) => {
            state.sellerScheduleShowLists = [],
            state.isSellListPageEnd = false
        }
    },
    extraReducers: {
        [getSellerScheduledShowListThnuk.fulfilled.toString()]: (state: any, action: PayloadAction<any>) => {
            state.sellerScheduleShowLists = [...action?.payload]
        },
        [getSellerScheduledShowListLoadMoreThnuk.fulfilled.toString()]: (state: any, action: PayloadAction<any>) => {
            state.isSellListPageEnd = (action.payload.length === 0)
            state.sellerScheduleShowLists = [...state.sellerScheduleShowLists, ...action?.payload]
        },[getSellerScheduledShowSearch.fulfilled.toString()]: (state: any, action: PayloadAction<any>) => {
            state.sellerScheduleShowLists=[]
            state.isSellListPageEnd = (action.payload.length === 0)
            state.sellerScheduleShowLists = [...state.sellerScheduleShowLists, ...action?.payload]
        },
    }
});

export const { setIsSellListPageEnd, resetSellerSlice } = sellerShowSlice.actions;
export default sellerShowSlice.reducer;