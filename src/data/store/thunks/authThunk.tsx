import {createAsyncThunk} from '@reduxjs/toolkit';
import NavigationConstants from '../../../navigators/NavigationConstant';
import FlashMessageRef from '../../../utils/FlashMessageRef';
import * as NavigationObject from '../../../utils/NavigationObject';
import {resetScreen} from '../../../utils/NavigationObject';
import * as SessionManager from '../../../utils/SessionManager';
import AuthRepo from '../../repo/AuthRepo';

export const UserLoggedIn = createAsyncThunk(
  'userLoggedIn',
  async (body: any) => {
    const res: any = await AuthRepo.loginApi(
      body.email,
      body.password,
      body.deviceType,
      body.deviceToken,
    );
    await SessionManager.setLoginData(res);

    console.log('====================================');
    console.log('res', res);
    console.log('====================================');

    if (res?.isSeller) {
      resetScreen(NavigationConstants.SellerLiveShow);
    } else {
      resetScreen(NavigationConstants.Dashboard);
    }
  },
);

export const forgotPasswordThunk = createAsyncThunk(
  'forgotPasswordThunk',
  async (body: any) => {
    const res: any = await AuthRepo.forgotApi(body.emailID);

    FlashMessageRef.show({message: res?.success_message, success: true});
    NavigationObject.navigate(NavigationConstants.LoginScreen);
  },
);

//verify OTP
export const verifyOTPThunk = createAsyncThunk(
  'verifyOtpApi',
  async (body: any) => {
    const res: any = await AuthRepo.verifyOtp(body.mobileNo, body.otp);

    FlashMessageRef.show({message: res?.success_message, success: true});
    NavigationObject.navigate(NavigationConstants.LoginScreen);
  },
);

// export const changePasswordThunk = createAsyncThunk(

//     "changePasswordThunk", async (body) => {

//         const res = await AuthRepo.changePasswordApi(
//             body.oldPassword,
//             body.newPassword,
//             body.confirmPassword
//         )

//         if (res?.success_message) {
//             FlashMessageRef.show({ message: res?.success_message, success: true })
//             NavigationObject.navigate('HomeScreen')
//         } else {
//             FlashMessageRef.show({ message: res?.failure_message })
//         }

//         // NavigationObject.navigate('LoginScreen')
//     }

// )
