import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  unstable_batchedUpdates,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import Fonts from '../../assets/fonts';
import Images from '../../assets/images';
import {
  PrimaryButton,
  PrimaryImage,
  PrimaryInput,
  PrimaryText,
  ValuePicker,
} from '../../components';
import {
  buyerSignupThunk,
  getCountryListThunk,
} from '../../data/store/thunks/BuyerShowsThunk';
import Strings from '../../localization/Strings';
import {colors} from '../../themes';
import FlashMessageRef from '../../utils/FlashMessageRef';
import {moderateScale} from '../../utils/ScalingUtils';
import {isStrEmpty, isValidEmail} from '../../utils/UtilityFunc';
import WebConstants from '../../webServices/WebConstants';

const BuyerSignUpScreen = ({navigation}: any) => {
  const [fullName, setFullName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [invicationAffiliationCode, setInvicationAffiliationCode] =
    useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isAgreeTermsAndConditions, setIsAgreeTermsAndConditions] =
    useState(false);
  const [countryCode, setCountryCode] = useState('+44');
  const [countryId, setCountryId] = useState('225');

  const fullNameRef = useRef<any>(null);
  const emailIdRef = useRef<any>(null);
  const userNameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const invicationAffiliationCodeRef = useRef<any>(null);
  const mobileNumberRef = useRef<any>(null);
  const countryPickerRef = useRef<any>(null);

  const dispatch = useDispatch<any>();

  const arrCountryListData = useSelector(
    (state: any) => state.buyerShowState.countryData,
  );

  // console.log("arrCountryListData", arrCountryListData)

  useFocusEffect(
    React.useCallback(() => {
      unstable_batchedUpdates(() => {
        setFullName('');
        setEmailId('');
        setUserName('');
        setPassword('');
        setInvicationAffiliationCode('');
        setMobileNumber('');
        setIsAgreeTermsAndConditions(false);
        // setCountryCode('')
        setCountryId('');
      });
    }, []),
  );

  useEffect(() => {
    dispatch(getCountryListThunk());
  }, []);

  const onChangeFullName = (txt: any) => {
    setFullName(txt);
  };

  const onChangeEmailId = (txt: any) => {
    setEmailId(txt);
  };

  const onChangeUserName = (txt: any) => {
    setUserName(txt);
  };

  const onChangePassword = (txt: any) => {
    setPassword(txt);
  };

  const onChangeInvitationAffiliationCode = (txt: any) => {
    setInvicationAffiliationCode(txt);
  };

  const onChangeMobileNumber = (txt: any) => {
    setMobileNumber(txt);
  };

  const onTermsAndConditionPress = () => {
    Linking.openURL(WebConstants.TERMS_CONDITIONS_URL);
  };

  const validateInputs = () => {
    if (isStrEmpty(fullName.trim())) {
      FlashMessageRef.show({message: Strings.fullNameValidation});
      return false;
    } else if (isStrEmpty(emailId.trim())) {
      FlashMessageRef.show({message: Strings.emailIdValidation});
      return false;
    } else if (!isValidEmail(emailId.trim())) {
      FlashMessageRef.show({message: Strings.emailValidation});
      return false;
    } else if (isStrEmpty(userName.trim())) {
      FlashMessageRef.show({message: Strings.userNameValidation});
      return false;
    } else if (isStrEmpty(password.trim())) {
      FlashMessageRef.show({message: Strings.passwordValidation});
      return false;
    } else if (isStrEmpty(invicationAffiliationCode.trim())) {
      FlashMessageRef.show({
        message: Strings.InvitationAffiliationCodeValidation,
      });
      return false;
    } else if (isStrEmpty(mobileNumber.trim())) {
      FlashMessageRef.show({message: Strings.mobileNumberValidation});
      return false;
    } else if (!isAgreeTermsAndConditions) {
      FlashMessageRef.show({message: Strings.tncValidation});
      return false;
    } else {
      return true;
    }
  };

  const onSelectCountryCode = (item: any) => {
    console.log('item00000', item);
    setCountryCode(item?.value);
    setCountryId(item?.countryId);
  };

  const onRegisterBtnPress = () => {
    let data = {
      fullName: fullName,
      emailID: emailId,
      mobileNo: '+9114619038',
      userName: userName,
      password: password,
      invitationCode: invicationAffiliationCode,
      countryId: '225',
    };

    console.log('data from signup page ', data);

    if (validateInputs()) {
      dispatch(buyerSignupThunk(data));

      // navigation.navigate({
      //   name: NavigationConstants.VerifyOtpScreen,
      //   params: {
      //     mobileNumber: mobileNumber,
      //     countryCode: countryCode,
      //   },
      // });
    }
  };

  const onCountryCodePress = () => {
    countryPickerRef.current.show();
  };

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
            text={Strings.signUp}
            primaryTextStyle={styles.signInStyle}
          />
          <PrimaryInput
            value={fullName}
            onChangeText={onChangeFullName}
            inputName={Strings.fullName}
            inputIcon={Images.userIcon}
            placeholder={Strings.fullNamePlaceholder}
            maxLength={100}
            returnKeyType="next"
            refObj={fullNameRef}
            onSubmitEditing={() => {
              emailIdRef.current.focus();
            }}
          />
          <PrimaryInput
            value={emailId}
            onChangeText={onChangeEmailId}
            inputName={Strings.emailId}
            inputIcon={Images.email}
            placeholder={Strings.emailAddressPlaceholder}
            maxLength={100}
            returnKeyType="next"
            refObj={emailIdRef}
            onSubmitEditing={() => {
              userNameRef.current.focus();
            }}
          />
          <PrimaryInput
            value={userName}
            onChangeText={onChangeUserName}
            inputName={Strings.userNmae}
            inputIcon={Images.userIcon}
            placeholder={Strings.userNamePlaceholder}
            maxLength={100}
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
            onSubmitEditing={() => {
              invicationAffiliationCodeRef.current.focus();
            }}
            returnKeyType="done"
          />
          <PrimaryInput
            value={invicationAffiliationCode}
            onChangeText={onChangeInvitationAffiliationCode}
            inputName={Strings.InvitationAffiliationCode}
            inputIcon={Images.affilicationcode}
            placeholder={Strings.InvitationAffiliationCodePlaceholder}
            maxLength={10}
            returnKeyType="next"
            refObj={invicationAffiliationCodeRef}
            onSubmitEditing={() => {
              mobileNumberRef.current.focus();
            }}
          />
          {/* Mobile number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputNameStyle}>{Strings.mobileNumber} </Text>
            <View style={styles.iconAndInputCon}>
              <PrimaryImage
                primaryImgSource={Images.mobile}
                primaryImageStyle={styles.iconStyle}
              />
              <TouchableOpacity onPress={onCountryCodePress}>
                <Text style={styles.countryCode}>{countryCode}</Text>
              </TouchableOpacity>
              <TextInput
                value={mobileNumber}
                onChangeText={onChangeMobileNumber}
                placeholder={Strings.mobileNumberPlaceholder}
                style={styles.inputStyle}
                placeholderTextColor={colors.white}
                autoCapitalize={'none'}
                autoCorrect={false}
                ref={mobileNumberRef}
                returnKeyType={'next'}
                onSubmitEditing={onRegisterBtnPress}
                maxLength={15}
                keyboardType={'number-pad'}
              />
            </View>
          </View>

          <View style={styles.termsAndConditionContainer}>
            <TouchableOpacity
              onPress={() =>
                setIsAgreeTermsAndConditions(!isAgreeTermsAndConditions)
              }>
              <Image
                source={
                  isAgreeTermsAndConditions
                    ? Images.checkboxChecked
                    : Images.checkbox
                }
                style={styles.checkBoxStyle}
              />
            </TouchableOpacity>
            <PrimaryText
              text={Strings.iAgreeToThe}
              primaryTextStyle={styles.iAgreeToTheText}
            />
            <PrimaryText
              onTextPress={onTermsAndConditionPress}
              text={Strings.termsAndCondition}
              primaryTextStyle={styles.termsAndConStyle}
            />
          </View>

          <PrimaryButton
            primaryBtnStyle={styles.loginBtn}
            onPrimaryButtonPress={onRegisterBtnPress}
            primaryBtnTitle={Strings.register}
            primaryBtnTitleStyle={styles.loginbtnTxtStyle}
          />
        </View>

        <ValuePicker
          ref={countryPickerRef}
          onSelect={(item: any, index: any) => onSelectCountryCode(item)}
          values={arrCountryListData}
        />
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default BuyerSignUpScreen;

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
  },
  loginbtnTxtStyle: {
    fontSize: moderateScale(14),
  },
  registerBtnStyle: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    fontFamily: Fonts.OpenSans_SemiBold,
    color: colors.skycc,
    paddingVertical: moderateScale(5),
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  termsAndConditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(20),
  },
  iAgreeToTheText: {
    color: colors.white,
    fontSize: moderateScale(13),
    fontFamily: Fonts.OpenSans_Regular,
    lineHeight: moderateScale(18),
    paddingLeft: moderateScale(10),
  },
  termsAndConStyle: {
    color: colors.white,
    fontSize: moderateScale(13),
    fontFamily: Fonts.OpenSans_Regular,
    lineHeight: moderateScale(18),
  },
  checkBoxStyle: {
    width: moderateScale(26),
    height: moderateScale(26),
  },

  dropdown: {
    width: moderateScale(100),
    height: moderateScale(20),
    backgroundColor: 'blue',
  },
  icon: {
    // marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.white,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.white,
  },
  countryCode: {
    color: colors.white,
    paddingLeft: moderateScale(5),
    fontFamily: Fonts.OpenSans_Regular,
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
  },
  iconAndInputCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.black21,
    borderColor: colors.gray44,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    alignItems: 'center',
    paddingVertical:
      Platform.OS == 'ios' ? moderateScale(10) : moderateScale(0),
  },
  iconStyle: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
  },
  inputStyle: {
    flex: 1,
    fontSize: moderateScale(12),
    fontFamily: Fonts.OpenSans_Regular,
    color: colors.white,
    paddingLeft: moderateScale(10),
  },

  inputNameStyle: {
    fontFamily: Fonts.OpenSans_Regular,
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    color: colors.white,
    paddingVertical: moderateScale(5),
  },
  inputContainer: {
    paddingTop: moderateScale(10),
  },
});
