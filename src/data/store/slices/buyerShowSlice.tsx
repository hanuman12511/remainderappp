import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  getDashbordDetailsthunk,
  getBuyerShowListThunk,
  getCountryListThunk,
  getCategorySubCategoryListtThunk,
  getSubCategorybyCategoryListThunk,
  getProfileDetails,
  getOrderHistory,
  getBuyerSubCatoryShowlist,
  showAllLiveShowOrSheduledShow,
  createCustomerThunk,
  deleteCardThunk,
  getUserStripeDetailThunk,
  paymentSetupIntentThunk,
} from '../thunks/BuyerShowsThunk';

export const initialState = {
  buyerLiveShowList: [],
  buyerScheduleShowLists: [],
  countryData: [],
  categorySubcategoryList: [],
  subcategorySubcategoryList: [],
  profileDetails: {},
  orderHistory: [],
  shopAllShowList: [],
  shopAllShudledShowList: [],
  showLiveorSheduledShowList: [],
  showSheduledShowList: [],
  status: null,
  paymentSetupIntent: null,
  card_deleted: false,
  DashboarDetails:""
};




const buyerShowSlice = createSlice({
  name: 'buyerShowSlice',
  initialState,

  reducers: {
    resetBuyerSlice: (state) => {
      state.buyerLiveShowList = []
      state.buyerScheduleShowLists = []
      state.countryData = []
      state.status = null
      state.paymentSetupIntent = null
      state.card_deleted = false
    },

    DashBoadHome: (state) => {
    state.DashboarDetails=""  
    },


  },
  extraReducers: {


    [getDashbordDetailsthunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.DashboarDetails = [...action?.payload];},


    [getBuyerShowListThunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.buyerLiveShowList = [...action?.payload?.liveShowLists];
      state.buyerScheduleShowLists = [...action?.payload?.scheduleShowLists];
    },
    [getCountryListThunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.countryData = [...action?.payload?.countryData];
    },
    [getCategorySubCategoryListtThunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.categorySubcategoryList = [...action?.payload];
    },
    [getSubCategorybyCategoryListThunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.subcategorySubcategoryList = [...action?.payload];
    },
    [getProfileDetails.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.profileDetails = {...action?.payload};
    },
    [getOrderHistory.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      let tempArray: any = [];
      let AllCaseList = state.orderHistory ? state.orderHistory : [];
      tempArray = [...AllCaseList, ...action.payload.response_packet];

      state.orderHistory = [...state.orderHistory, ...tempArray];
    },

    [getBuyerSubCatoryShowlist.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.shopAllShowList = [...action?.payload?.liveShowLists];
      state.shopAllShudledShowList = [...action?.payload?.scheduleShowLists];
    },

    [showAllLiveShowOrSheduledShow.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.showLiveorSheduledShowList = [...action?.payload?.liveShowLists];
      state.showSheduledShowList = [...action?.payload?.scheduleShowLists];
    },
    [getUserStripeDetailThunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.status = action?.payload?.response_packet;
    },
    [deleteCardThunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      console.log('Main packet ????>>>>', action.payload);
      state.card_deleted = !state.card_deleted
    },
    [createCustomerThunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.status = {
        ...state.status,
        stripeCustomerId: action.payload.response_packet.customerId,
      };
    },
    [paymentSetupIntentThunk.fulfilled.toString()]: (
      state: any,
      action: PayloadAction<any>,
    ) => {
      state.paymentSetupIntent = action.payload.response_packet;

    },
  },
});

export const {resetBuyerSlice} = buyerShowSlice.actions

export default buyerShowSlice.reducer;
