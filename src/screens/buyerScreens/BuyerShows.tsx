import {CommonActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {usePaymentSheet} from '@stripe/stripe-react-native';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../../assets/images';
import AuthRepo from '../../data/repo/AuthRepo';
import {setUserInfo} from '../../data/store/slices/userDetailSlice';
import {
  createCustomerThunk,
  deleteCardThunk,
  getUserStripeDetailThunk,
  paymentSetupIntentThunk,
} from '../../data/store/thunks/BuyerShowsThunk';
import Strings from '../../localization/Strings';
import TopTabNav from '../../navigators/TopTabNav';
import {colors, Fonts} from '../../themes';
import FlashMessageRef from '../../utils/FlashMessageRef';
import {moderateScale} from '../../utils/ScalingUtils';
import * as SessionManager from '../../utils/SessionManager';
import {showAlertWithTwoButtons} from '../../utils/UtilityFunc';
import DeleteCard from '../../components/DeleteCard';
import moment from 'moment';
import {resetBuyerSlice} from '../../data/store/slices/buyerShowSlice';
import {resetHomeSlice} from '../../data/store/slices/homeSlice';
import {resetSellerSlice} from '../../data/store/slices/sellerShowSlice';
import {resetUserSlice} from '../../data/store/slices/userDetailSlice';
import NavigationConstants from '../../navigators/NavigationConstant';

const BuyerShows = ({navigation}: any) => {
  const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();
  const [searchShow, setSearchShow] = useState('');
  const [showModal, setShowModal] = useState(null);
  const dispatch = useDispatch<any>();
  const userData = useSelector((state: any) => state.userDetailState.userData);
  const card_deleted = useSelector(
    (state: any) => state.buyerShowState.card_deleted,
  );
  const paymentSetupIntent = useSelector(
    (state: any) => state.buyerShowState.paymentSetupIntent,
  );
  const status = useSelector((state: any) => state.buyerShowState.status);

  const initialsePaymentSheet = async () => {
    const {error} = await initPaymentSheet({
      customerId: paymentSetupIntent.customerId,
      setupIntentClientSecret: paymentSetupIntent.clinetSecret,
      allowsDelayedPaymentMethods: true,
      merchantDisplayName: 'MR. HERMIT',
    });
    if (error) {
      Alert.alert(`Bad happened ${error.message} and ${error.code}`);
    } else {
      // setReady(false)
      handleSetupPress();
    }
  };

  useEffect(() => {
    if (paymentSetupIntent) {
      initialsePaymentSheet();
    }
  }, [paymentSetupIntent]);

  const handleSetupPress = async () => {
    const res = await presentPaymentSheet();
    if (res.error) {
      if (res.error.code === 'Canceled') {
        handleSetupPress();
      } else {
        Alert.alert(`Bad happened ${res.error.message} and ${res.error.code}`);
      }
    } else {
      dispatch(getUserStripeDetailThunk());
    }
  };

  useEffect(() => {
    // Checking for the stripe customer existance
    dispatch(getUserStripeDetailThunk());
  }, [card_deleted]);

  useEffect(() => {
    if (status) {
      if (!status?.stripeCustomerId && !status?.stripeCustomerId?.length) {
        // creating an stripe account for the user
        dispatch(createCustomerThunk());
      } else {
        if (!status?.isCardAdded) {
          // creating the payment intent
          dispatch(paymentSetupIntentThunk());
        } else if (status?.isCardAdded) {
          if (parseInt(moment().format('YYYY')) === parseInt(status.expYear)) {
            if (parseInt(moment().format('MM')) >= parseInt(status.expMonth)) {
              setShowModal(status);
            }
          }
        }
      }
    }
  }, [status, status?.stripeCustomerId, status?.isCardAdded]);

  useEffect(() => {
    const init = async () => {
      const userData = await SessionManager.getLoginData();
      dispatch(setUserInfo(userData));
    };
    init();
  }, []);

  const onSearchShowChange = ({txt}: any) => {
    setSearchShow(txt);
  };

  const onNotificationBtnPress = () => {
    navigation.navigate(NavigationConstants.NotificationScreen);
  };

  const onSettingsBtnPress = async () => {
    navigation.navigate(NavigationConstants.DrawerNavigation);
  };

  const onPressSearchBtn = () => {
    FlashMessageRef.show({message: Strings.inProgress, success: true});
  };

  return (
    <>
      {showModal ? (
        <DeleteCard
          action={() => {
            setShowModal(null);
            dispatch(deleteCardThunk());
          }}
          data={showModal}
        />
      ) : null}
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
          <ImageBackground
            source={Images.whiteBackground}
            resizeMode={'cover'}
            style={styles.backgroundImgStyle}>
            <Header
              searchText={searchShow}
              onSearchTextChange={onSearchShowChange}
              onNotificationBtnPress={onNotificationBtnPress}
              onSettingsBtnPress={onSettingsBtnPress}
              onPressSearchBtn={onPressSearchBtn}
            />
            <TopTabNav navigation={undefined} />
          </ImageBackground>
        </SafeAreaView>
      </View>
    </>
  );
};

export default BuyerShows;

interface headerProps {
  searchText: any;
  onSearchTextChange: any;
  onNotificationBtnPress: any;
  onSettingsBtnPress: any;
  onPressSearchBtn: any;
}

const Header = ({
  searchText,
  onSearchTextChange,
  onNotificationBtnPress,
  onSettingsBtnPress,
  onPressSearchBtn,
}: headerProps) => {
  return (
    <>
      <View style={styles.headerCon}>
        <View style={styles.headerSubCon}>
          <Image source={Images.logo} style={styles.headerLogoImg} />
          <View style = {styles.searchContainer}>

          </View>
          {/* <TouchableOpacity
            style={styles.searchContainer}
            onPress={onPressSearchBtn}>
            <Image source={Images.search} style={styles.searchImg} />
            <TextInput
              value={searchText}
              onChangeText={onSearchTextChange}
              style={styles.searchTxtStyle}
              placeholderTextColor={colors.gray5B}
              placeholder={Strings.search}
              editable={false}
            />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={onNotificationBtnPress}>
            <Image
              source={Images.notifications}
              style={styles.notificationsImg}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsBtnPress}>
            <Image source={Images.setting} style={styles.settingImg} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImgStyle: {
    flex: 1,
    // justifyContent: 'center',
    // paddingHorizontal: moderateScale(20)
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

  headerCon: {
    backgroundColor: colors.black,
    paddingVertical: moderateScale(10),
    justifyContent: 'flex-end',
    paddingTop: moderateScale(25),
  },
  headerSubCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    alignItems: 'center',
  },
  headerLogoImg: {
    width: moderateScale(56),
    height: moderateScale(41),
    resizeMode: 'contain',
  },
  searchContainer: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.black21,
    paddingHorizontal: moderateScale(20),

    borderRadius: moderateScale(25),
    alignItems: 'center',
    width: moderateScale(190),
    // marginLeft: moderateScale(20)
  },
  searchImg: {
    width: moderateScale(14),
    height: moderateScale(14),
    resizeMode: 'contain',
  },
  searchTxtStyle: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    color: colors.white,
    fontSize: moderateScale(13),
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    paddingVertical: moderateScale(10),
  },
  notificationsImg: {
    width: moderateScale(19.37),
    height: moderateScale(22.89),
    resizeMode: 'contain',
  },
  settingImg: {
    width: moderateScale(21.63),
    height: moderateScale(21.63),
    resizeMode: 'contain',
  },
});
