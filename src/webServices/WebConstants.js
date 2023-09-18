const URLS = {
 // DEVELOPMENT: ' http://everyonetradesdemo.projectstatus.in/api/',
  DEVELOPMENT: 'https://renewalreminderapp.24livehost.com/api/',
  
 QA: 'http://everyonetradesqa.projectstatus.in/api/',
  PRODUCTION: 'http://everyonetradesuat.projectstatus.in/api/',
};
const WebConstants = {
  //Api constants
  BASE_URL: URLS.DEVELOPMENT,
  TERMS_CONDITIONS_URL:
    'http://everyonetradesdemo.projectstatus.in/home/termsandcondition',
  // BASE_URL: URLS.DEVELOPMENT,

  //Api keys

  //kLogin: 'UserAccount/Login',
  kLogin: 'api/Account/Login',
  kForgotPassword: '/UserAccount/forgotPassword',
  kLogout: 'UserAccount/Logout',
  kCountryList: 'UserAccount/countryList',
  kBuyerSignUp: '/UserAccount/SignUp',
  kEditProfile: 'UserAccount/editProfile',

  kBuyerShowList: 'Buyer/BuyerShowList',
  kchatRoomToken: 'Buyer/chatRoomToken',
  kCreateBid: 'Buyer/createBid',
  kGetLiveShowStatus: 'Buyer/LiveShowStatus',
  kSellerUpdateShowStatus: 'SellerAccountData/updateShowStatus',

  kCategorySubCategoryList: 'Buyer/categorySubCategoryList',

  kGetSubCategoryBySubCategoryid: 'Buyer/GetSubCategoryByCategoryId',

  kCreateBid: 'Buyer/createBid',
  kDashboarDetails: 'api/Vehicle/DashboardDetails',
  kAddremainder: 'api/Vehicle/AddVehicle',
  kGetLiveShowStatus: 'Buyer/LiveShowStatus',
  GetUserStripeDetail: 'UserAccount/GetUserStripeDetail',
  CreateCustomer: 'UserAccount/CreateCustomer',
  paymentSetupIntent: '/UserAccount/paymentSetupIntent',
  deleteCard: '/UserAccount/deleteCard',

  ksellerScheduledShow: 'SellerAccountData/sellerScheduledShow',
  kstartEndLiveShow: 'SellerAccountData/startEndLiveShow',
  kCreateAuction: '/SellerAccountData/createAuction',
  kEndAuction: '/SellerAccountData/endAuction',

  //order histroy
  korderhistory: 'Buyer/GetOrderHistory',
  //follow
  followApi: 'Buyer/follow',

  //verifyOTP
  kVerifyOtp: 'UserAccount/verifyOTP',

  //profile Details
  kProfileDetails: 'UserAccount/profileDetail',

  //Network code
  NetworkNoReachableStatusCode: 503,
};

export default WebConstants;
