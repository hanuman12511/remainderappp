import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import BuyerLiveShow from '../screens/buyerScreens/BuyerLiveShow';
// import { Home, Play } from '../screens';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import App from '../screens/Broadcast';
import BuyerShows from '../screens/buyerScreens/BuyerShows';
import BuyerSignUpScreen from '../screens/buyerScreens/BuyerSignUpScreen';
import ChangePasswordScreen from '../screens/buyerScreens/ChangePasswordScreen';
import NotificationScreen from '../screens/buyerScreens/NotificationScreen';
import PaymentDetailsScreen from '../screens/buyerScreens/PaymentDetailsScreen';
import VerifyOtpScreen from '../screens/buyerScreens/VerifyOtpScreen';
import Chat from '../screens/chat';
import ForgotPassword from '../screens/ForgotPassword';
import Home from '../screens/Home';
import LoginScreen from '../screens/LoginScreen';
import SellerLiveShow from '../screens/sellerScreens/SellerLiveShow';
import SellerLiveStreamingScreen from '../screens/sellerScreens/SellerLiveStreamingScreen';
import UserInfo from '../screens/sellerScreens/UserInfo';
import Testing from '../screens/Testing';
import DrawerNavigation from './DrawerNavigation';
import NavigationConstants from './NavigationConstant';
import TopTabNav from './TopTabNav';
import EditProfileScreen from '../screens/buyerScreens/EditProfileScreen';

import {createDrawerNavigator} from '@react-navigation/drawer';
import OrdersScreen from '../screens/buyerScreens/OrdersScreen';
import SettingScreens from '../screens/buyerScreens/SettingScreens';
import CategoriesScreen from '../screens/buyerScreens/CategoriesScreen';
import SubCategoryScreen from '../screens/buyerScreens/SubCategoryScreen';
import ShopAllCategoryScreen from '../screens/buyerScreens/ShopAllCategoryScreen';
import CategryFollowScreen from '../screens/buyerScreens/CategryFollowScreen';
import ShowAllCateoreScreen from '../screens/buyerScreens/ShowAllCateoreScreen';
import DashbordScreen from '../screens/DashboardScreen';
import Addremainder from '../screens/Addremainder';
import UserSignupScreen from '../screens/UserSignupScreen';
import ReminderScreen from '../screens/ReminderScreen';
import ReminderDetails from '../screens/RminderDetails';

// custom component screen

const Stack = createStackNavigator();
/* const Drawer = createDrawerNavigator(); */

const RootNavigator = () => {

  

  return (
    <Stack.Navigator
      initialRouteName=""
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
        <Stack.Screen name={'reminder'} component={ReminderDetails} />
        <Stack.Screen name={'addRemider'} component={ReminderScreen} />

      <Stack.Screen name={'AuthLoadingScreen'} component={AuthLoadingScreen} />
      <Stack.Screen name={'TopTabNav'} component={TopTabNav} />

      <Stack.Screen
        name={NavigationConstants.LoginScreen}
        component={LoginScreen}
      />
      <Stack.Screen
        name={NavigationConstants.Dashboard}
        component={DashbordScreen}
      />
      <Stack.Screen
        name={NavigationConstants.Addremainder}
        component={Addremainder}
      />
      <Stack.Screen
        name={NavigationConstants.UserSignUpScreen}
        component={UserSignupScreen}
      />
{/* 
      <Stack.Screen
        name={NavigationConstants.CategryFollowScreen}
        component={CategryFollowScreen}
      />

      <Stack.Screen
        name={NavigationConstants.ShopAllCategoryScreen}
        component={ShopAllCategoryScreen}
      />

      <Stack.Screen
        name={NavigationConstants.SubCategoryScreen}
        component={SubCategoryScreen}
      />

      <Stack.Screen
        name={NavigationConstants.CategoriesScreen}
        component={CategoriesScreen}
      />

      <Stack.Screen
        name={NavigationConstants.SettingScreen}
        component={SettingScreens}
      />

      <Stack.Screen
        name={NavigationConstants.ShowAllCateoreScreen}
        component={ShowAllCateoreScreen}
      />

      <Stack.Screen
        name={NavigationConstants.SellerLiveStreamingScreen}
        component={SellerLiveStreamingScreen}
      />

      <Stack.Screen
        name={NavigationConstants.OrdersScreen}
        component={OrdersScreen}
      />

      <Stack.Screen
        name={NavigationConstants.BuyerSignUpScreen}
        component={BuyerSignUpScreen}
      />
      <Stack.Screen
        name={NavigationConstants.VerifyOtpScreen}
        component={VerifyOtpScreen}
      />
      <Stack.Screen
        name={NavigationConstants.PaymentDetailsScreen}
        component={PaymentDetailsScreen}
      />
      <Stack.Screen
        name={NavigationConstants.NotificationScreen}
        component={NotificationScreen}
      />
      <Stack.Screen
        name={NavigationConstants.EditProfileScreen}
        component={EditProfileScreen}
      />
      <Stack.Screen
        name={NavigationConstants.ChangePasswordScreen}
        component={ChangePasswordScreen}
      />
      <Stack.Screen name={'BuyerLiveShow'} component={BuyerLiveShow} />
      <Stack.Screen name={NavigationConstants.Home} component={Home} />

      <Stack.Screen
        name={NavigationConstants.SellerLiveShow}
        component={SellerLiveShow}
      />
      <Stack.Screen
        name={NavigationConstants.BuyerShows}
        component={BuyerShows}
      />
      <Stack.Screen
        name={NavigationConstants.ForgotPassword}
        component={ForgotPassword}
      />
      <Stack.Screen name={'UserInfo'} component={UserInfo} />
      <Stack.Screen name={'Chat'} component={Chat} />
      <Stack.Screen name={'Testing'} component={Testing} />
      <Stack.Screen name={'App'} component={App} />
      <Stack.Screen
        name={NavigationConstants.DrawerNavigation}
        component={DrawerNavigation}
      /> */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
