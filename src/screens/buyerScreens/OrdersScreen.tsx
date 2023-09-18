import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {getOrderHistory} from '../../data/store/thunks/BuyerShowsThunk';
import Fonts from '../../assets/fonts';
import Images from '../../assets/images';
import React, {useState, useEffect, useRef} from 'react';
import {colors} from '../../themes';
import Strings from '../../localization/Strings';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from '../../utils/ScalingUtils';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SecondaryInput} from '../../components';
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Item = ({
  title,
  amount,
  datetime,
  complited,
  ratingAndReview,
  status,
}: any) => (
  <View style={styles.parentViewStyle}>
    <View style={styles.productNameAndPrice}>
      <Text style={styles.productNameStyle}>{title}</Text>
      <Text style={styles.productAmountStyle}>$ {amount}</Text>
    </View>
    <View style={{flexDirection: 'row'}}>
      <Text style={styles.statusStyle}>Status : {status}</Text>
    </View>
    <View style={{marginBottom: moderateScale(5), flexDirection: 'row'}}>
      <Text style={styles.statusStyle}>Date/Time :{datetime.split('T')}</Text>
    </View>
  </View>
);
const OrdersScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch<any>();
  const [isrefreshing, setisrefresing] = useState(false);
  let pagenuber = 1;
  let pagesize = 10;
  useEffect(() => {
    let data = {
      pageNo: pagenuber,
      pageSize: pagesize,
    };
    dispatch(getOrderHistory(data));
  }, []);

  const orderHistory = useSelector(
    (state: any) => state.buyerShowState.orderHistory,
  );

  const loadOrderData = () => {
    let data = {
      pageNo: pagenuber,
      pageSize: pagesize,
    };

    dispatch(getOrderHistory(data));
  };

  const renderItem = ({item}: any) => (
    <Item
      title={item.productName}
      amount={item.amount}
      datetime={item.createdOn}
      complited={item.complited}
      ratingAndReview={item.createdOn}
      status={item.status}
    />
  );

  const onBackButtonPress = () => {
    (state: any) => (state.buyerShowState.orderHistory = null);
    navigation.goBack();
  };

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBackButtonPress}>
          <Image source={Images.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{Strings.orders}</Text>
        <View></View>
      </View>
    );
  };
  const handleLoadMore = () => {
    pagenuber = pagenuber + 1;

    loadOrderData();
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
      <ImageBackground
        source={Images.whiteBackground}
        resizeMode={'cover'}
        style={styles.backgroundImgStyle}>
        <Header />
        <View style={styles.orderParentViewStyle}>
          {orderHistory.length > 0 ? (
            <FlatList
              data={orderHistory}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.keyExtractor}
              showsHorizontalScrollIndicator={true}
              refreshControl={
                <RefreshControl
                  refreshing={isrefreshing}
                  onRefresh={loadOrderData}
                />
              }
              onEndReached={handleLoadMore}
            />
          ) : (
            <Text
              style={{
                color: colors.black,
                fontFamily: Fonts.OpenSans_Regular,
                fontSize: moderateScale(14),
                textAlign: 'center',
                marginTop: moderateScale(20),
              }}>
              {Strings.noDataFound}
            </Text>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OrdersScreen;

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
    fontSize: moderateScale(18),
    fontFamily: Fonts.OpenSans_Regular,
  },

  title: {
    fontSize: moderateScale(32),
  },

  productNameAndPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(5),
  },
  productNameStyle: {
    fontWeight: 'bold',
    color: colors.black,
    fontFamily: Fonts.OpenSans_Bold,
    fontSize: moderateScale(18),
  },
  productAmountStyle: {
    fontWeight: 'bold',
    color: colors.pinkA2,
    fontSize: moderateScale(18),
    fontFamily: Fonts.OpenSans_Bold,
  },
  complitedAndRatingReviewStyle: {
    flexDirection: 'row',
    paddingVertical: moderateScale(10),
  },
  complitedStyle: {
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    borderRadius: 50,
  },
  statusStyle: {
    color: colors.black,
    fontFamily: Fonts.OpenSans_Regular,
    fontSize: moderateScale(14),
  },
  whiteTextcolorStyle: {
    color: colors.white,
  },
  orderParentViewStyle: {
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(5),
  },
  parentViewStyle: {
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    borderWidth: moderateScale(1),
    marginTop: moderateScale(10),
    borderColor: colors.grayA5,
    backgroundColor: colors.white,
    marginBottom: moderateScale(5),
  },
});
