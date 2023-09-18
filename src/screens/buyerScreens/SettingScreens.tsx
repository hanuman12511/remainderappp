import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
} from 'react-native';
import {
  resetSellerSlice,
  setIsSellListPageEnd,
} from '../../data/store/slices/sellerShowSlice';
import {resetBuyerSlice} from '../../data/store/slices/buyerShowSlice';
import {resetHomeSlice} from '../../data/store/slices/homeSlice';
import AuthRepo from '../../data/repo/AuthRepo';
import {CommonActions} from '@react-navigation/native';
import * as SessionManager from '../../utils/SessionManager';
import {showAlertWithTwoButtons} from '../../utils/UtilityFunc';
import {useIsFocused} from '@react-navigation/native';
import {getProfileDetails} from '../../data/store/thunks/BuyerShowsThunk';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors} from '../../themes';
import React, {useEffect, useState} from 'react';
import Fonts from '../../assets/fonts';
import Strings from '../../localization/Strings';
import {moderateScale} from '../../utils/ScalingUtils';
import Images from '../../assets/images';
import {resetUserSlice} from '../../data/store/slices/userDetailSlice';
import {PrimaryImage} from '..//../components';
import {SafeAreaView} from 'react-native-safe-area-context';
import NavigationConstants from '../../navigators/NavigationConstant';
import WebConstants from '../../webServices/WebConstants';

const SettingScreens = ({navigation, route}: any) => {
  const dispatch = useDispatch<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState();
  const [profileImageUri, setProfileImgUri] = useState();

  const profileDetails = useSelector(
    (state: any) => state.buyerShowState.profileDetails,
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused == true) {
      dispatch(getProfileDetails());
    }
  }, [isFocused]);

  useEffect(() => {
    setName(profileDetails?.name);
    setEmail(profileDetails?.email);
    setFollowers(profileDetails?.followersCount);
    setFollowing(profileDetails?.followingCount);
    setProfileImgUri(profileDetails?.image);
  }, [profileDetails]);
  const onBackButtonPress = () => {
    navigation.goBack();
  };

  const onMenuButtonPress = () => {
    navigation.openDrawer();
  };

  const onEditButtonPress = () => {
    navigation.navigate(NavigationConstants.EditProfileScreen);
  };
  const onOrderButtonPress = () => {
    navigation.navigate(NavigationConstants.OrdersScreen);
  };
  const onTermsAndConditionButtonPresss = () => {
    Linking.openURL(WebConstants.TERMS_CONDITIONS_URL);
  };

  const onPressSharebutton = () => {};
  const onPressPrivacyPolicy = () => {
    Linking.openURL(WebConstants.TERMS_CONDITIONS_URL);
  };
  const onPressLogoutButton = () => {
    showAlertWithTwoButtons(
      Strings.logoutAlert,
      (showAlertWithTwoButtons.prototype.handler = async () => {
        await AuthRepo.logoutApi();
        await SessionManager.removeLoginData();
        dispatch(resetBuyerSlice());
        dispatch(resetHomeSlice());
        dispatch(resetSellerSlice());
        dispatch(resetUserSlice());
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'LoginScreen'}],
          }),
        );
      }),
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
        <ImageBackground
          source={Images.whiteBackground}
          resizeMode={'cover'}
          style={styles.backgroundImgStyle}>
          <Header
            onBackButtonPress={onBackButtonPress}
            onMenuButtonPress={onMenuButtonPress}
          />
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            keyboardShouldPersistTaps={'handled'}
            extraHeight={10}>
            <View style={styles.editProfileContainer}>
              <View style={styles.profilePicViewStyle}></View>
              <View style={styles.userNameAndEmailViewStyle}>
                <Image
                  source={{
                    uri: profileImageUri,
                  }}
                  style={styles.profileImageStyle}
                />

                <Text style={styles.userNameStyle}>{name} </Text>
                <Text style={styles.emailaddressStyle}>{email}</Text>
                <TouchableOpacity
                  style={styles.editButtonStyle}
                  onPress={onEditButtonPress}>
                  <Text style={{color: colors.white}}>
                    {Strings.editProfile}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.followersViewStyle}>
                <View style={styles.followerViewStyle}>
                  <View style={styles.followersItemView}>
                    <Text style={styles.followersViewStyles}>{followers}</Text>
                    <Text style={styles.followersTextStyle}>
                      {' '}
                      {Strings.followers}
                    </Text>
                  </View>
                  <View style={styles.followerDivStyle}></View>
                  <View style={{flex: 1}}>
                    <Text style={styles.followersViewStyles}>{following}</Text>
                    <Text style={styles.followersTextStyle}>
                      {' '}
                      {Strings.followers}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  ...styles.referAndEarnViewStyle,
                  marginTop: moderateScale(10),
                }}>
                <TouchableOpacity style={styles.viewItemStyle}>
                  <Text style={styles.itemTextStyle}>
                    {Strings.referAFriendAndEarnCredit}
                  </Text>
                  <View></View>
                  <PrimaryImage
                    primaryImgSource={Images.rightArrowIcon}
                    primaryImageStyle={styles.nextImageiconStyle}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewItemStyle}
                  onPress={onOrderButtonPress}>
                  <Text style={styles.itemTextStyle}>{Strings.orders}</Text>
                  <View></View>
                  <PrimaryImage
                    primaryImgSource={Images.rightArrowIcon}
                    primaryImageStyle={styles.nextImageiconStyle}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewItemStyle}
                  onPress={onPressSharebutton}>
                  <Text style={styles.itemTextStyle}>
                    {Strings.shareProfile}
                  </Text>
                  <View></View>
                  <PrimaryImage
                    primaryImgSource={Images.rightArrowIcon}
                    primaryImageStyle={styles.nextImageiconStyle}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.verifiedItemStyle}>
                  <Text style={styles.itemTextStyle}>
                    {Strings.verifiedBuyer}
                  </Text>
                  <View></View>
                  <PrimaryImage
                    primaryImgSource={Images.rightArrowIcon}
                    primaryImageStyle={styles.nextImageiconStyle}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  ...styles.referAndEarnViewStyle,
                  marginTop: moderateScale(10),
                }}>
                <TouchableOpacity
                  style={styles.viewItemStyle}
                  onPress={onPressPrivacyPolicy}>
                  <Text style={styles.itemTextStyle}>
                    {Strings.privacyPolicy}
                  </Text>
                  <View></View>
                  <PrimaryImage
                    primaryImgSource={Images.rightArrowIcon}
                    primaryImageStyle={styles.nextImageiconStyle}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewItemStyle}
                  onPress={onTermsAndConditionButtonPresss}>
                  <Text style={styles.itemTextStyle}>
                    {Strings.termsAndConditions}
                  </Text>
                  <View></View>
                  <PrimaryImage
                    primaryImgSource={Images.rightArrowIcon}
                    primaryImageStyle={styles.nextImageiconStyle}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.verifiedItemStyle,
                  }}>
                  <Text style={styles.itemTextStyle}>{Strings.help}</Text>
                  <View></View>
                  <PrimaryImage
                    primaryImgSource={Images.rightArrowIcon}
                    primaryImageStyle={styles.nextImageiconStyle}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  ...styles.referAndEarnViewStyle,
                  marginTop: moderateScale(10),
                  marginBottom: moderateScale(10),
                }}>
                <TouchableOpacity
                  onPress={onPressLogoutButton}
                  style={styles.viewItemStyle}>
                  <Text style={styles.itemTextStyle}>{Strings.logout}</Text>
                  <View></View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.viewItemStyle,
                    borderBottomColor: colors.white,
                  }}>
                  <Text style={styles.deleteButtonStyle}>
                    {Strings.deleteAccount}
                  </Text>
                  <View></View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

export default SettingScreens;

interface headerProps {
  onBackButtonPress: any;
  onMenuButtonPress: any;
}

const Header = ({onBackButtonPress, onMenuButtonPress}: headerProps) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackButtonPress}>
        <Image source={Images.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{Strings.settings}</Text>
      <TouchableOpacity onPress={onMenuButtonPress}>
        <Image source={Images.menuImage} />
      </TouchableOpacity>
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
  },

  profilePicViewStyle: {
    alignSelf: 'center',
    marginTop: moderateScale(10),
  },
  profileImageStyle: {
    resizeMode: 'contain',
    borderRadius: 100,
    borderWidth: moderateScale(0.7),
    borderColor: colors.gray70,
    minWidth: moderateScale(150),
    minHeight: moderateScale(150),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
  },
  userNameStyle: {
    color: colors.black,
    fontSize: moderateScale(21),
    fontFamily: Fonts.OpenSans_SemiBold,
    fontWeight: 'bold',
  },
  nextImageiconStyle: {
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },

  editProfileContainer: {
    flex: 0.9,
    paddingHorizontal: moderateScale(20),
  },
  userNameAndEmailViewStyle: {
    alignItems: 'center',
  },
  editButtonStyle: {
    backgroundColor: colors.pinkA2,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(8),
    borderRadius: 100,
    marginTop: moderateScale(5),
  },
  referAndEarnViewStyle: {
    borderRadius: moderateScale(10),
    marginTop: moderateScale(5),
    borderColor: colors.grayE3,
    borderWidth: 1,
    backgroundColor: colors.white,
    elevation: 20,
    shadowColor: colors.gray,
  },
  viewItemStyle: {
    borderBottomColor: colors.grayE3,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(10),
    justifyContent: 'space-between',
  },
  deleteButtonStyle: {
    color: colors.pinkA2,
    fontFamily: Fonts.OpenSans_SemiBold,
    fontSize: moderateScale(16),
  },
  itemTextStyle: {
    fontFamily: Fonts.OpenSans_SemiBold,
    color: colors.black,
    fontSize: moderateScale(16),
    fontWeight: '400',
  },
  emailaddressStyle: {
    fontFamily: Fonts.OpenSans_Regular,
    color: colors.black,
    fontSize: moderateScale(14),
    fontWeight: '200',
  },
  followersViewStyle: {
    borderWidth: 1,
    minHeight: 100,
    borderRadius: 10,
    marginTop: moderateScale(15),
    backgroundColor: colors.white,
    justifyContent: 'center',
    borderColor: colors.grayE3,
    elevation: moderateScale(3),
    shadowColor: colors.white,
  },
  followersItemView: {
    flex: 1,
    alignSelf: 'center',
  },
  followersViewStyles: {
    alignSelf: 'center',
    fontSize: moderateScale(20),
    color: colors.blue,
    fontWeight: 'bold',
    paddingHorizontal: moderateScale(20),
  },
  followerDivStyle: {
    width: 1,
    height: moderateScale(70),
    backgroundColor: colors.grayE3,
  },
  followersTextStyle: {
    alignSelf: 'center',
    fontFamily: Fonts.OpenSans_Regular,
    paddingVertical: moderateScale(5),
    color: colors.black,
    fontSize: moderateScale(15),
  },
  verifiedItemStyle: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(10),
    justifyContent: 'space-between',
  },
  followerViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
