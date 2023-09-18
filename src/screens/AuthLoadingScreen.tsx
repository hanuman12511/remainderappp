import {CommonActions} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {ActivityIndicator, ImageBackground, StyleSheet} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Images from '../assets/images';
import {colors} from '../themes';
import * as SessionManager from '../utils/SessionManager';

const AuthLoadingScreen = ({navigation, route}: any) => {
  useEffect(() => {
    const init = async () => {
      SplashScreen.hide();

      // const timer = setTimeout(() => {
      //     navigation.navigate(NavigationConstants.LoginScreen)
      // }, 1000);
      // return () => clearTimeout(timer);
      const loginData = await SessionManager.getLoginData();
      if (loginData != null) {
        if (loginData?.isSeller) {
          goToSellerShowsScreen();
        } else {
          goToBuyerShowsScreen();
        }
      } else {
        goToLogin();
      }
    };
    init();
  }, []);

  const goToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'LoginScreen'}],
      }),
    );
  };

  const goToSellerShowsScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'SellerLiveShow'}],
      }),
    );
  };

  const goToBuyerShowsScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Dashboard'}],
      }),
    );
  };

  // const goToEditProfileScreen = () => {
  //     navigation.dispatch(CommonActions.reset({
  //         index: 1,
  //         routes: [{ name: "EditUserProfileScreen" }]
  //     }))
  // };

  // const goToHomeDrawerNav = () => {
  //     navigation.dispatch(CommonActions.reset({
  //         index: 1,
  //         routes: [{ name: "HomeDrawerNav" }]
  //     }))
  // };

  return (
    <ImageBackground
      source={Images.backgroundImg}
      resizeMode={'cover'}
      style={styles.backgroundImgStyle}>
      <ActivityIndicator
        style={{width: 150, height: 150}}
        size="large"
        color={colors.pinkA2}
      />
    </ImageBackground>
  );
};

export default AuthLoadingScreen;

const styles = StyleSheet.create({
  backgroundImgStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
