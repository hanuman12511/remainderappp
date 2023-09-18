import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import Fonts from '../../assets/fonts';
import Images from '../../assets/images';
import React, {useState} from 'react';
import {colors} from '../../themes';
import Strings from '../../localization/Strings';
import {moderateScale} from '../../utils/ScalingUtils';
import {SafeAreaView} from 'react-native-safe-area-context';

const DATA = [
  {
    id: '1',
    title: Strings.newOrderReceived,
    submessageis: Strings.loremIpsom,
  },
  {
    id: '2',
    title: Strings.newOrderReceived,
    submessageis: Strings.loremIpsom,
  },
  {
    id: '3',
    title: Strings.newOrderReceived,
    submessageis: Strings.loremIpsom,
  },
];

const Item = ({title, submessageis}) => (
  <View style={styles.notificationItemStyle}>
    <Image style={styles.notificationIconStyle} source={Images.logo} />
    <View style={styles.notificationContentStyle}>
      <Text style={styles.notificationTitileStyle}>{title}</Text>
      <Text style={styles.notificationDesstyle}>{submessageis}</Text>
    </View>
  </View>
);
const NotificationScreen = ({navigation, route}: any) => {
  const [isrefreshing, setisrefresing] = useState(false);

  const onBackButtonPress = () => {
    navigation.goBack();
  };

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBackButtonPress}>
          <Image source={Images.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{Strings.notification}</Text>
        <View></View>
      </View>
    );
  };
  const loadNotificationData = () => {
    setisrefresing(true);
    setTimeout(() => {
      setisrefresing(false);
    }, 4000);
  };
  const renderItem = ({item}) => (
    <Item title={item.title} submessageis={item.submessageis} />
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
      <ImageBackground
        source={Images.whiteBackground}
        resizeMode={'cover'}
        style={styles.backgroundImgStyle}>
        <Header />
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isrefreshing}
              onRefresh={loadNotificationData}
            />
          }
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NotificationScreen;

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

  title: {
    fontSize: 32,
  },

  notificationItemStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: moderateScale(20),
    borderWidth: 1,
    borderRadius: moderateScale(5),
    borderColor: colors.black,
    paddingHorizontal: moderateScale(20),
    margin: moderateScale(10),
  },
  notificationContentStyle: {
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(20),
  },
  notificationTitileStyle: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: moderateScale(20),
  },
  notificationIconStyle: {
    width: moderateScale(45),
    height: moderateScale(45),
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: colors.black,
    resizeMode: 'center',
  },
  notificationDesstyle: {
    color: colors.black,
  },
});
