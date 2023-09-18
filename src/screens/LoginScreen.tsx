import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import { useDispatch } from 'react-redux'
import Fonts from '../assets/fonts'
import Images from '../assets/images'
import { PrimaryButton, PrimaryImage, PrimaryInput, PrimaryText } from '../components'
import { UserLoggedIn } from '../data/store/thunks/authThunk'
import Strings from '../localization/Strings'

import { colors } from '../themes'
import FlashMessageRef from '../utils/FlashMessageRef'
import { moderateScale } from '../utils/ScalingUtils'
import { isStrEmpty } from '../utils/UtilityFunc'
import * as SpinnerRef from '../utils/SpinnerRef'
import NavigationConstants from '../navigators/NavigationConstant'

const LoginScreen = ({navigation}: any) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [fcm, setFcm] = useState("fcmtoken")

  const userNameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const dispatch = useDispatch<any>();

  useFocusEffect(
    React.useCallback(() => {
      setUserName('');
      setPassword('');
    }, []),
  );

  // React.useEffect(() => {
  //   const backAction = () => {
  //     BackHandler.exitApp()
  //     return true
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);
/* 
  useEffect(() => {
    
    getToken()
  }, [])

  const getToken = () => {
    SpinnerRef.show()
    messaging()
      .getToken()
      .then(async fcmToken => {
        if (fcmToken) {
          console.log('fcmToken:>>', fcmToken);
          setFcm(fcmToken)
        }
      })
      .catch(err => {
        console.log(err.message);
      }).finally(() => {
        SpinnerRef.hide()
      })
  }; */

  const onChangeUserName = (txt: any) => {
    setUserName(txt);
  };

  const onChangePassword = (txt: any) => {
    setPassword(txt);
  };

  const onForgotBtnPress = () => {
   // navigation.navigate(NavigationConstants.ForgotPassword);
  };

  const validateInputs = () => {
    if (isStrEmpty(userName.trim())) {
      FlashMessageRef.show({message: Strings.userNameValidation});
      return false;
    } else if (isStrEmpty(password.trim())) {
      FlashMessageRef.show({message: Strings.passwordValidation});
      return false;
    } else {
      return true;
    }
  };

  const onPressLoginButton = () => {
    let data = {
      email: userName,
      password: password,
      deviceType: Platform.OS === 'ios' ? 2 : 1,
      deviceToken: fcm,
    }

    if (validateInputs()) {
      dispatch(UserLoggedIn(data));
    }
  };

  function onPressSignupButton(){
    navigation.navigate(NavigationConstants.UserSignUpScreen);
  }

  return (
    <ImageBackground
      source={Images.backgroundImg}
      resizeMode={'cover'}
      style={styles.backgroundImgStyle}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps={'handled'}
        extraHeight={10}>
        <View style={styles.logoContainer}>
          <PrimaryImage
            primaryImgSource={Images.logo}
            primaryImageStyle={styles.logoStyle}
          />
        </View>
        <View style={styles.signInContainer}>
          <PrimaryText
            text={Strings.signIn}
            primaryTextStyle={styles.signInStyle}
          />
          <PrimaryInput
            value={userName}
            onChangeText={onChangeUserName}
            inputName={Strings.userNmae}
            inputIcon={Images.userIcon}
            placeholder={Strings.userNamePlaceholder}
            maxLength={50}
            returnKeyType="next"
            refObj={userNameRef}
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
          />
          <PrimaryInput
            refObj={passwordRef}
            passwordInput={true}
            inputName={Strings.password}
            inputIcon={Images.userIcon}
            placeholder={Strings.passwordPlaceholder}
            value={password}
            onChangeText={onChangePassword}
            maxLength={20}
            onSubmitEditing={onPressLoginButton}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={onForgotBtnPress}>
            <Text style={styles.forgotPassStyle}>{Strings.forgotPassword}</Text>
          </TouchableOpacity>

          <PrimaryButton
            primaryBtnStyle={styles.loginBtn}
            onPrimaryButtonPress={onPressLoginButton}
            primaryBtnTitle={Strings.login}
            primaryBtnTitleStyle={styles.loginbtnTxtStyle}
          />
          <View style={styles.hrline}/>
          <View style={styles.signupview}>
            <Text>new user create</Text>
            <Text> Account?</Text>
            <TouchableOpacity onPress={onPressSignupButton}>
              <Text>Sign-Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundImgStyle: {
    flex: 1,
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(20),
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyle: {
    width: moderateScale(189),
    height: moderateScale(168),
    resizeMode: 'contain',
  },
  signInContainer: {
    flex: 0.6,
  },
  signInStyle: {
    color: colors.white,
    fontSize: moderateScale(21),
    lineHeight: moderateScale(30),
    fontFamily: Fonts.OpenSans_Regular,
  },
  textInputStyle: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    borderColor: colors.gray,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    marginVertical: moderateScale(15),
    fontSize: moderateScale(18),
  },
  loginBtn: {
    backgroundColor: colors.pinkA2,
    paddingVertical: moderateScale(15),
    alignItems: 'center',
    borderRadius: moderateScale(8),
    marginVertical: moderateScale(20),
  },
  loginbtnTxtStyle: {
    fontSize: moderateScale(14),
  },
  forgotPassStyle: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    fontFamily: Fonts.OpenSans_SemiBold,
    color: colors.skycc,
    paddingVertical: moderateScale(5),
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  hrline:{
    backgroundColor:colors.blue,
    height:moderateScale(1)
  },
  signupview:{
    flex:1,
    
  }
});
