import React, {useState} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import Images from '../../assets/images';
import {useDispatch} from 'react-redux';
import Strings from '../../localization/Strings';
import {colors, Fonts} from '../../themes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale} from '../../utils/ScalingUtils';
import {PrimaryButton, PrimaryImage} from '..//../components';
import OTPInput from 'react-native-otp-forminput';
import FlashMessageRef from '../../utils/FlashMessageRef';
import {verifyOTPThunk} from '../../data/store/thunks/authThunk';

const VerifyOtpScreen = ({navigation, route}: any) => {
  const {mobileNumber} = route?.params;
  const [inputOtp, setinputOtp] = useState('');
  const dispatch = useDispatch<any>();

  const onPressVerifyButton = () => {
    if (inputOtp.length != 4) {
      FlashMessageRef.show({message: Strings.pleaseEnterTheOtp});
    } else {
      let data = {
        mobileNo: mobileNumber,
        otp: inputOtp,
      };
      dispatch(verifyOTPThunk(data));
    }
  };

  const onPressReSendOtpText = () => {};

  return (
    <ImageBackground
      source={Images.whiteBackground}
      resizeMode={'cover'}
      style={styles.backgroundImgStyle}>
      <Header />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps={'handled'}
        extraHeight={10}>
        <View style={styles.container}>
          <View style={styles.changePasswordImgContainer}>
            <View style={{width: moderateScale(200)}}>
              <View>
                <View>
                  <PrimaryImage
                    primaryImgSource={Images.otpImages}
                    primaryImageStyle={styles.otpIconStyle}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: moderateScale(35)}}>
            <Text style={styles.verifyYourMobileStyle}>
              {Strings.verifyYourMobile}
            </Text>
            <Text style={styles.pleaseEnterTheOtpStyle}>
              {Strings.pleaseEnterTheOtp}
            </Text>
          </View>
          <View style={styles.otpViewStyle}>
            <OTPInput
              onFilledCode={true}
              onChange={(code: any) => {
                setinputOtp(code);
              }}
              type="filled"
              defaultValue="1"
              borderColor="black"
              currentBorderColor="black"
              inputStyle={{
                backgroundColor: 'white',
                fontSize: moderateScale(23),
                fontWeight: '600',
                fontFamily: Fonts.FONT_FAMILY_BOLD,
                color: colors.black,
              }}
            />
          </View>

          <View style={styles.resendOtpViewStyle}>
            <Text style={styles.dontHaveAnAccountTextStyle}>
              {Strings.didntHaveReciveOTP}
            </Text>

            <Text
              onPress={onPressReSendOtpText}
              style={styles.resendOtpTextStyle}>
              {Strings.reSendOTP}
            </Text>
          </View>
          <View style={styles.primaryButtonViewStyle}>
            <PrimaryButton
              primaryBtnStyle={styles.submitBtn}
              onPrimaryButtonPress={onPressVerifyButton}
              primaryBtnTitle={Strings.verify}
              primaryBtnTitleStyle={styles.verfifyBtnTxtStyle}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default VerifyOtpScreen;

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{Strings.VerifyOTP}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImgStyle: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.black,
    paddingVertical: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
  },
  container: {
    paddingHorizontal: moderateScale(20),
    flex: 1,
    // alignItems: 'center',
  },
  verifyYourMobileStyle: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.FONT_FAMILY_BOLD,
    lineHeight: moderateScale(27),
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pleaseEnterTheOtpStyle: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    lineHeight: moderateScale(20),
    color: colors.black,
    textAlign: 'center',
  },
  changePasswordImgContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyOTPImgStyle: {
    width: moderateScale(200),
    height: moderateScale(150),
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  resendOtpViewStyle: {
    flexDirection: 'row',
    paddingVertical: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dontHaveAnAccountTextStyle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    color: colors.black,
  },
  resendOtpTextStyle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    color: colors.pinkA2,
    paddingHorizontal: moderateScale(5),
  },
  submitBtn: {
    backgroundColor: colors.pinkA2,
    paddingVertical: moderateScale(15),
    alignItems: 'center',
    borderRadius: moderateScale(8),
    marginVertical: moderateScale(20),
  },
  verfifyBtnTxtStyle: {
    fontSize: moderateScale(14),
  },
  primaryButtonViewStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: moderateScale(20),
  },
  otpViewStyle: {
    marginTop: moderateScale(15),
  },
  otpIconStyle: {
    resizeMode: 'contain',
  },
});
