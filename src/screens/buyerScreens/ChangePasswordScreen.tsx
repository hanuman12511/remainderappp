import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {PrimaryButton, PrimaryImage, SecondaryInput} from '..//../components';
import Fonts from '../../assets/fonts';
import Images from '../../assets/images';
import React, {useRef, useState} from 'react';
import {colors} from '../../themes';
import Strings from '../../localization/Strings';
import {moderateScale} from '../../utils/ScalingUtils';
import {SafeAreaView} from 'react-native-safe-area-context';

const ChangePasswordScreen = ({navigation, route}: any) => {
  const [oldPassword, setoldPassword] = useState('');
  const [newPassword, setnewpassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const oldPasswordRef = useRef<any>(null);
  const newPasswordRef = useRef<any>(null);
  const confirmNewPasswordRef = useRef<any>(null);

  const onChangeOldPasswordName = (txt: any) => {
    setoldPassword(txt);
  };

  const onChangeNewPassword = (txt: any) => {
    setnewpassword(txt);
  };
  const onChangeConfirmNewPassword = (txt: any) => {
    setconfirmPassword(txt);
  };

  const onBackButtonPress = () => {
    navigation.goBack();
  };
  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBackButtonPress}>
          <Image source={Images.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{Strings.changepassword}</Text>
        <View></View>
      </View>
    );
  };

  const onPressSubmitButton = () => {};
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
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
            <View style={styles.changePasswordImgContainer}>
              <PrimaryImage
                primaryImgSource={Images.changePasswordImage}
                primaryImageStyle={styles.changePasswordImgStyle}
              />
            </View>
            <View style={styles.ChangePasswordContainer}>
              <SecondaryInput
                value={oldPassword}
                onChangeText={onChangeOldPasswordName}
                inputName={Strings.oldpassword}
                placeholder={Strings.oldpassword}
                maxLength={50}
                fontsFamily={Fonts.OpenSans_SemiBold}
                returnKeyType="next"
                refObj={oldPasswordRef}
                onSubmitEditing={() => {
                  newPasswordRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={newPassword}
                onChangeText={onChangeNewPassword}
                inputName={Strings.newpassword}
                placeholder={Strings.newpassword}
                maxLength={50}
                fontsFamily={Fonts.OpenSans_SemiBold}
                returnKeyType="next"
                refObj={newPasswordRef}
                onSubmitEditing={() => {
                  confirmNewPasswordRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                refObj={confirmNewPasswordRef}
                inputName={Strings.confirmnewpassword}
                placeholder={Strings.confirmnewpassword}
                value={confirmPassword}
                onChangeText={onChangeConfirmNewPassword}
                maxLength={20}
                onSubmitEditing={onPressSubmitButton}
                returnKeyType="done"
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                fontsFamily={Fonts.OpenSans_SemiBold}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />

              <PrimaryButton
                primaryBtnStyle={styles.submitBtn}
                onPrimaryButtonPress={onPressSubmitButton}
                primaryBtnTitle={Strings.submit}
                primaryBtnTitleStyle={styles.submitBtnTxtStyle}
              />
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

export default ChangePasswordScreen;
const styles = StyleSheet.create({
  backgroundImgStyle: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.black,
    paddingVertical: moderateScale(30),
    paddingHorizontal: moderateScale(15),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  headerText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: Fonts.OpenSans_Regular,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  changePasswordImgContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePasswordImgStyle: {
    width: moderateScale(200),
    height: moderateScale(150),
    resizeMode: 'contain',
  },
  ChangePasswordContainer: {
    flex: 0.9,
    paddingHorizontal: moderateScale(20),
  },

  submitBtn: {
    backgroundColor: colors.pinkA2,
    paddingVertical: moderateScale(15),
    alignItems: 'center',
    borderRadius: moderateScale(8),
    marginVertical: moderateScale(20),
  },
  submitBtnTxtStyle: {
    fontSize: moderateScale(14),
  },
});
