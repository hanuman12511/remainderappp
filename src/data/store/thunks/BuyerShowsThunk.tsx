import { createAsyncThunk } from "@reduxjs/toolkit";
import NavigationConstants from "../../../navigators/NavigationConstant";
import * as NavigationObject from "../../../utils/NavigationObject";
import BuyerRepo from "../../repo/BuyerRepo";
import PaymentRepo from "../../repo/PaymentRepo";
import FlashMessageRef from "../../../utils/FlashMessageRef";



export const getDashbordDetailsthunk = createAsyncThunk(
  'getDashbordDetailsthunk',
  async () => {
    const res = await BuyerRepo.DashboardApi();
    return res;
  },
);

export const AddremailderThunk = createAsyncThunk(
  'AddremailderThunk',
  async (body: any) => {
    const res = await BuyerRepo.AddremainderApi(
      body.remainderType,
     body. vehicleType,
     body. vehicleTypeName,
     body. vehicleName,
     body. vehicleModel,
     body. vehicleManufacturingYear,
     body. vehicleRegistrationNumber,
     body. licenseNumber,
     body. licenseType,
     body. renewalFrequency,
    body.  registrationExpireDate,
      body.lastRenewalDate,
      );

    NavigationObject.navigate(NavigationConstants.Dashboard);
  },
);


export const buyerSignupThunk = createAsyncThunk(
  'buyerSignupThunk',
  async (body: any) => {
    const res = await BuyerRepo.buyerSignupApi(
      body.fullName,
      body.emailID,
      body.mobileNo,
      body.userName,
      body.password,
      body.invitationCode,
      body.countryId,
    );

    NavigationObject.navigate(NavigationConstants.VerifyOtpScreen, {
      mobileNumber: body.mobileNo,
    });
  },
);

export const getBuyerShowListThunk = createAsyncThunk(
  'getBuyerShowListThunk',
  async (body: any) => {
    const res = await BuyerRepo.BuyerShowListApi(
      body.pageNumber,
      body.pageSize,
      body.isLiveAll,
      body.isscheduledAll,
      body.categoryId,
    );

    return res;
  },
);

export const getCountryListThunk = createAsyncThunk(
  'getCountryListThunk',
  async () => {
    const res = await BuyerRepo.getCountryListApi();
    return res;
  },
);

export const getCategorySubCategoryListtThunk = createAsyncThunk(
  'getCategorySubCategoryListtThunk',
  async () => {
    const res = await BuyerRepo.getCategorySubCategryList();
    return res;
  },
);

export const getSubCategorybyCategoryListThunk = createAsyncThunk(
  'getSubCategorybyCategoryListThunk',
  async (body: any) => {
    const res = await BuyerRepo.getSubCategoryByCategory(body.CategoryId);
    return res;
  },
);
export const followAPI = createAsyncThunk('followAPI', async (body: any) => {
  const res: any = await BuyerRepo.followAPI(
    body.followingUserId,
    body.categoryId,
    body.isFollow,
  );

  if (res?.response_code == 200) {
    FlashMessageRef.show({message: res?.success_message, success: true});
  }

  return res;
});

export const getProfileDetails = createAsyncThunk(
  'getProfileDetails',
  async () => {
    const res = await BuyerRepo.getProfileDetails();

    return res;
  },
);

export const getOrderHistory = createAsyncThunk(
  'getOrderHistory',
  async (body: any) => {
    const res = await BuyerRepo.orderHistor(body.pageNo, body.pageSize);
    return res;
  },
);

export const getBuyerSubCatoryShowlist = createAsyncThunk(
  'getBuyerSubCatorylist',
  async (body: any) => {
    const res = await BuyerRepo.BuyerShowListApi(
      body.pageNumber,
      body.pageSize,
      body.isLiveAll,
      body.isscheduledAll,
      body.categoryId,
    );
    return res;
  },
);

export const showAllLiveShowOrSheduledShow = createAsyncThunk(
  'showAllLiveShowOrSheduledShow',
  async (body: any) => {
    const res = await BuyerRepo.BuyerShowListApi(
      body.pageNumber,
      body.pageSize,
      body.isLiveAll,
      body.isscheduledAll,
      body.categoryId,
    );
    console.log('@123' + JSON.stringify(res));
    return res;
  },
);
export const getUserStripeDetailThunk = createAsyncThunk(
    "getUserStripeDetailThunk", async () => {
        const res = await PaymentRepo.GetUserStripeDetail()
        return res
    },
)

export const deleteCardThunk = createAsyncThunk(
    "deleteCardThunk", async () => {
        const res = await PaymentRepo.DeleteCard()
        return res
    },
)

export const createCustomerThunk = createAsyncThunk(
    "createCustomerThunk", async () => {
        const res = await PaymentRepo.CreateCustomer()
        return res
    },
)

export const paymentSetupIntentThunk = createAsyncThunk(
    "paymentSetupIntentThunk", async () => {
        const res = await PaymentRepo.paymentSetupIntent()
        return res
    },
)





