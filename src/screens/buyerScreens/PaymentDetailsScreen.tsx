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
import {isStrEmpty, isValidEmail} from '../../utils/UtilityFunc';
import Strings from '../../localization/Strings';
import {moderateScale} from '../../utils/ScalingUtils';
import {SafeAreaView} from 'react-native-safe-area-context';
import FlashMessageRef from '../../utils/FlashMessageRef';

const PaymentDetailsScreen = ({navigation, route}: any) => {
  const [cardHolderName, setcardholderName] = useState('');
  const [cardNumber, setcardnumber] = useState('');
  const [expDate, setexpDate] = useState('');
  const [cvv, setcvv] = useState('');

  const cardHolderNameRef = useRef<any>(null);
  const cardNumberRef = useRef<any>(null);
  const expDateRef = useRef<any>(null);
  const cvvRef = useRef<any>(null);

  const validateInputs = () => {
    if (isStrEmpty(cardHolderName.trim())) {
      FlashMessageRef.show({message: Strings.cardHolderNamevaliation});
      return false;
    } else if (isStrEmpty(cardNumber.trim())) {
      FlashMessageRef.show({message: Strings.cardHolderNamevaliation});
      return false;
    } else if (isStrEmpty(expDate.trim())) {
      FlashMessageRef.show({message: Strings.expvalidaton});
      return false;
    } else if (isStrEmpty(cvv.trim())) {
      FlashMessageRef.show({message: Strings.cvvvaliation});
      return false;
    }
    {
      return true;
    }
  };
  const onChangeCardHolderName = (txt: any) => {
    setcardholderName(txt);
  };
  const onChangeCardNumber = (txt: any) => {
    setcardnumber(txt);
  };

  const onChangeExpDate = (txt: any) => {
    setexpDate(txt);
  };
  const onChangeCVV = (txt: any) => {
    setcvv(txt);
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
        <Text style={styles.headerText}>{Strings.paymentDetails}</Text>
        <View></View>
      </View>
    );
  };
  const onPressPayButton = () => {
    if (validateInputs()) {
      FlashMessageRef.show({message: 'Successfulty ', success: true});
    }
  };
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
            <View style={styles.paymentDetailsImgContainer}>
              <PrimaryImage
                primaryImgSource={Images.paymentImage}
                primaryImageStyle={styles.paymentDetails}
              />
            </View>
            <View style={styles.paymentDetailsContainer}>
              <SecondaryInput
                value={cardHolderName}
                onChangeText={onChangeCardHolderName}
                inputName={Strings.cardHolderName}
                placeholder={Strings.cardHolderName}
                maxLength={50}
                fontsFamily={Fonts.OpenSans_SemiBold}
                returnKeyType="next"
                refObj={cardHolderNameRef}
                onSubmitEditing={() => {
                  cardNumberRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={cardNumber}
                onChangeText={onChangeCardNumber}
                inputName={Strings.cardNumber}
                placeholder={Strings.cardNumber}
                maxLength={50}
                fontsFamily={Fonts.OpenSans_SemiBold}
                keyboardType={'numeric'}
                returnKeyType="next"
                refObj={cardNumberRef}
                onSubmitEditing={() => {
                  expDateRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <View style={styles.expDateContainer}>
                <View style={{flex: 0.45}}>
                  <SecondaryInput
                    value={expDate}
                    onChangeText={onChangeExpDate}
                    inputName={Strings.expDate}
                    placeholder={Strings.expDate}
                    maxLength={10}
                    keyboardType={'numeric'}
                    returnKeyType="next"
                    fontsFamily={Fonts.OpenSans_SemiBold}
                    refObj={expDateRef}
                    onSubmitEditing={() => {
                      cvvRef.current.focus();
                    }}
                    inputLableColor={colors.black}
                    secondaryInputColor={colors.black}
                    placeholderTextColor={colors.grayA5}
                    inputContainerBackgroundColor={colors.white}
                    secondaryInputBorderColor={colors.grayA5}
                  />
                </View>
                <View
                  style={{
                    flex: 0.45,
                    marginLeft: moderateScale(10),
                  }}>
                  <SecondaryInput
                    value={cvv}
                    onChangeText={onChangeCVV}
                    inputName={Strings.cvv}
                    placeholder={Strings.cvv}
                    maxLength={5}
                    keyboardType={'numeric'}
                    returnKeyType="done"
                    refObj={cvvRef}
                    onSubmitEditing={onPressPayButton}
                    inputLableColor={colors.black}
                    fontsFamily={Fonts.OpenSans_SemiBold}
                    secondaryInputColor={colors.black}
                    placeholderTextColor={colors.grayA5}
                    inputContainerBackgroundColor={colors.white}
                    secondaryInputBorderColor={colors.grayA5}
                  />
                </View>
              </View>

              <PrimaryButton
                primaryBtnStyle={styles.payBtn}
                onPrimaryButtonPress={onPressPayButton}
                primaryBtnTitle={Strings.pay}
                primaryBtnTitleStyle={styles.payBtnTxtStyle}
              />
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

export default PaymentDetailsScreen;

const styles = StyleSheet.create({
  backgroundImgStyle: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.black,
    paddingVertical: moderateScale(30),
    paddingHorizontal: moderateScale(30),
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
  paymentDetailsImgContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDetails: {
    width: moderateScale(200),
    height: moderateScale(150),
    resizeMode: 'contain',
  },
  paymentDetailsContainer: {
    flex: 0.9,
    paddingHorizontal: moderateScale(20),
  },

  payBtn: {
    backgroundColor: colors.pinkA2,
    paddingVertical: moderateScale(15),
    alignItems: 'center',
    borderRadius: moderateScale(8),
    marginVertical: moderateScale(20),
  },
  payBtnTxtStyle: {
    fontSize: moderateScale(14),
  },
  expDateContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
