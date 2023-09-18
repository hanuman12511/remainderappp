import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import NavigationConstants from './NavigationConstant';
import Fonts from '../assets/fonts';
import {PrimaryImage} from '../components';
import Strings from '../localization/Strings';
import Images from '../assets/images';
import {moderateScale} from '../utils/ScalingUtils';
import {colors} from '../themes';

const CustomSideDrawer = props => {
  const onHomeButtonPress = () => {
    props.navigation.navigate(NavigationConstants.Home);
    props.navigation.closeDrawer();
  };
  const onChangePasswordButtonPress = () => {
    props.navigation.navigate(NavigationConstants.ChangePasswordScreen);

    props.navigation.closeDrawer();
  };
  const onPaymentDetailsButtonPress = () => {
    props.navigation.navigate(NavigationConstants.PaymentDetailsScreen);

    props.navigation.closeDrawer();
  };
  const onNotificationButtonPress = () => {
    props.navigation.navigate(NavigationConstants.NotificationScreen);
    props.navigation.closeDrawer();
  };

  return (
    <View style={{flex: 1}}>
      <View>
        <View
          style={{
            height: moderateScale(130),
            backgroundColor: 'black',
            alignItems: 'center',
          }}>
          <Image source={Images.logo} style={styles.drawerImageStyle} />
        </View>

        <TouchableOpacity
          style={styles.itemButtonStyle}
          onPress={onHomeButtonPress}>
          <PrimaryImage
            primaryImgSource={Images.home}
            primaryImageStyle={styles.iconHomeStyle}
          />
          <Text style={styles.drawerItemViewStyle}>{Strings.home}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemButtonStyle}
          onPress={onPaymentDetailsButtonPress}>
          <PrimaryImage
            primaryImgSource={Images.paymentcard}
            primaryImageStyle={styles.iconHomeStyle}
          />
          <Text style={styles.drawerItemViewStyle}>
            {Strings.paymentDetails}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemButtonStyle}
          onPress={onChangePasswordButtonPress}>
          <PrimaryImage
            primaryImgSource={Images.lock}
            primaryImageStyle={styles.iconHomeStyle}
          />
          <Text style={styles.drawerItemViewStyle}>
            {Strings.changePassword}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemButtonStyle}
          onPress={onNotificationButtonPress}>
          <PrimaryImage
            primaryImgSource={Images.notifications}
            primaryImageStyle={styles.iconHomeStyle}
          />
          <Text style={styles.drawerItemViewStyle}>{Strings.notification}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    height: moderateScale(200),
    resizeMode: 'contain',
    width: moderateScale(150),

    marginHorizontal: 5,
    backgroundColor: 'black',
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeiconstyle: {
    width: moderateScale(30),
    resizeMode: 'contain',
    paddingVertical: moderateScale(10),
    height: moderateScale(20),
    paddingHorizontal: moderateScale(10),
  },
  homeicon: {
    width: moderateScale(15),
    resizeMode: 'contain',
    paddingVertical: moderateScale(10),
    height: moderateScale(15),
    paddingHorizontal: moderateScale(10),
    tintColor: colors.black,
  },
  itemButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    resizeMode: 'contain',
    paddingVertical: moderateScale(10),
  },
  drawerItemViewStyle: {
    paddingHorizontal: moderateScale(20),
    fontSize: moderateScale(16),
    color: colors.black,
    fontFamily: Fonts.OpenSans_SemiBold,
  },
  drawerImageStyle: {
    height: moderateScale(100),
    width: moderateScale(100),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
    marginTop: moderateScale(20),
  },
  iconHomeStyle: {
    width: moderateScale(15),
    resizeMode: 'contain',
    paddingVertical: moderateScale(10),
    height: moderateScale(15),
    paddingHorizontal: moderateScale(10),
    tintColor: colors.black,
  },
});

export default CustomSideDrawer;
