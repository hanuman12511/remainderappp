import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {showAllLiveShowOrSheduledShow} from '../../data/store/thunks/BuyerShowsThunk';
import {getTime} from '../../utils/UtilityFunc';
import FlashMessageRef from '../../utils/FlashMessageRef';
import Fonts from '../../assets/fonts';
import Images from '../../assets/images';
import {useDispatch, useSelector} from 'react-redux';
import React, {useRef, useState, useEffect} from 'react';
import {colors} from '../../themes';
import Strings from '../../localization/Strings';
import {moderateScale} from '../../utils/ScalingUtils';
import {SafeAreaView} from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const ShowAllCateoreScreen = ({navigation, route}) => {
  let pumber = 1;
  let psize = 10;

  const pageNo = useRef(1);
  const pageSize = useRef(10);

  const {isLiveAll, isscheduledAll, categoryId, fromWichShow} = route?.params;
  const dispatch = useDispatch<any>();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let showData = {
      pageNumber: pumber,
      pageSize: psize,
      isLiveAll: isLiveAll,
      isscheduledAll: isscheduledAll,
      categoryId: categoryId,
    };
    dispatch(showAllLiveShowOrSheduledShow(showData));
  }, []);

  const arrshowAllCategorylist = useSelector(
    (state: any) => state.buyerShowState.showLiveorSheduledShowList,
  );

  const arrSheduleAllCategorylist = useSelector(
    (state: any) => state.buyerShowState.showSheduledShowList,
  );

  const onBackButtonPress = () => {
    navigation.goBack();
  };

  const renderSellerShowListItem = ({item}: any) => {
    return (
      <SellerShowItem
        startFrom={getTime(item?.startDateTime)}
        productName={item?.title}
        categoryName={item?.categoryName}
        subCategoryName={item?.subCategoryName}
        thumbnail={item?.thumbanilUrl}
        onPressPlayBtn={() => console.log('hello ', item)}
      />
    );
  };

  const onRefresh = React.useCallback(() => {
    let showData = {
      pageNumber: pumber,
      pageSize: psize,
      isLiveAll: isLiveAll,
      isscheduledAll: isscheduledAll,
      categoryId: categoryId,
    };
    dispatch(showAllLiveShowOrSheduledShow(showData));
  }, []);
  const handleLoadMore = () => {
    if (!arrSheduleAllCategorylist) {
      pageNo.current = pageNo.current + 1;
      let data: any = {
        pageNumber: pageNo.current,
        pageSize: pageSize.current,
        isLiveAll: isLiveAll,
        isscheduledAll: isscheduledAll,
        categoryId: categoryId,
      };
      dispatch(showAllLiveShowOrSheduledShow(data));
    }
  };
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Header onBackButtonPress={onBackButtonPress} />
          <View style={{flex: 1}}>
            <View style={styles.showCon}>
              <Text style={styles.whichShowTextStyle}>{fromWichShow}</Text>
              <FlatList
                data={
                  isLiveAll ? arrshowAllCategorylist : arrSheduleAllCategorylist
                }
                renderItem={renderSellerShowListItem}
                keyExtractor={item => item?.liveShowId}
                ItemSeparatorComponent={ItemSeparatorComponent}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                style={{flex: 1, marginTop: moderateScale(5)}}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                ListEmptyComponent={
                  <View
                    style={{
                      height: SCREEN_HEIGHT - moderateScale(250),
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text>{Strings.noSellerScheduledShows}</Text>
                  </View>
                }
                onEndReachedThreshold={0.4}
                onEndReached={handleLoadMore}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

interface headerProps {
  onBackButtonPress: any;
}
const Header = ({onBackButtonPress}: headerProps) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackButtonPress}>
        <Image source={Images.backIcon} />
      </TouchableOpacity>
      <Image source={Images.logo} style={styles.headerLogoImg} />
      <View style={{flex: 1}}></View>
    </View>
  );
};
export default ShowAllCateoreScreen;

interface SellerShowItemProps {
  startFrom: any;
  productName: any;
  categoryName: any;
  subCategoryName: any;
  thumbnail: any;
  onPressPlayBtn: any;
}

const SellerShowItem = ({
  startFrom,
  productName,
  categoryName,
  subCategoryName,
  thumbnail,
  onPressPlayBtn,
}: SellerShowItemProps) => {
  return (
    <View style={styles.item}>
      <View style={styles.thumbnailCon}>
        <Image source={{uri: thumbnail}} style={styles.thumbnail} />
        <View style={styles.absoluteCon}>
          <TouchableOpacity onPress={onPressPlayBtn}>
            <Image source={Images.play} style={styles.playBtn} />
          </TouchableOpacity>
          <View style={styles.startFromTextContainer}>
            <Text style={styles.startFrom}>{'Start from: ' + startFrom}</Text>
          </View>
        </View>
      </View>
      <View style={styles.txtContainer}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.categoryName}>{categoryName}</Text>
        <View style={styles.gridAndSubCategoryStyle}>
          {subCategoryName ? (
            <Image source={Images.grid} style={styles.gridImg} />
          ) : null}
          <Text style={styles.subCategoryTxt}>{subCategoryName}</Text>
        </View>
      </View>
    </View>
  );
};

const ItemSeparatorComponent = () => {
  return <View style={styles.seperator} />;
};
const styles = StyleSheet.create({
  headerCon: {
    backgroundColor: colors.black,
    paddingVertical: moderateScale(10),
    paddingTop: moderateScale(25),
  },
  headerSubCon: {
    flexDirection: 'row',
  },
  headerLogoImg: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: 'contain',
    marginLeft: moderateScale(20),
  },
  searchContainer: {
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(5),
  },
  searchImg: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  searchTxtStyle: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    color: colors.white,
    fontSize: moderateScale(18),
    paddingVertical:
      Platform.OS === 'ios' ? moderateScale(10) : moderateScale(10),
  },

  showCon: {
    flex: 1,
    paddingHorizontal: moderateScale(5),
  },
  seperator: {},
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: moderateScale(10),
  },
  thumbnailCon: {
    width: moderateScale(165),
    height: moderateScale(210),
  },
  item: {
    flex: 1 / 2,
    paddingTop: moderateScale(15),
    paddingLeft: moderateScale(10),
  },
  productName: {
    backgroundColor: colors.white,
    fontSize: moderateScale(14),
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    textAlign: 'left',
    fontWeight: '500',
    lineHeight: moderateScale(16),
    color: colors.black,
  },
  categoryName: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
    lineHeight: moderateScale(17),
    fontWeight: '700',
    color: colors.black,
  },
  gridAndSubCategoryStyle: {
    flexDirection: 'row',
    paddingTop: moderateScale(7),
    alignItems: 'center',
  },
  gridImg: {
    width: moderateScale(10.3),
    height: moderateScale(10.3),
    resizeMode: 'contain',
  },
  subCategoryTxt: {
    color: colors.skycc,
    fontSize: moderateScale(12),
    textAlign: 'left',
    lineHeight: moderateScale(17),
    paddingLeft: moderateScale(5),
  },
  txtContainer: {
    paddingVertical: moderateScale(5),
    width: '100%',
  },
  playBtn: {
    width: moderateScale(45),
    height: moderateScale(45),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  absoluteCon: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // alignItems: 'center',
    justifyContent: 'flex-end',
  },
  startFrom: {
    color: colors.white,
    fontSize: moderateScale(12),
    fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
    lineHeight: moderateScale(17),
    textAlign: 'center',
    paddingVertical: moderateScale(5),
  },
  settingImg: {
    width: moderateScale(25),
    height: moderateScale(25),
    resizeMode: 'contain',
    marginLeft: moderateScale(7),
  },
  startFromTextContainer: {
    backgroundColor: colors.transparent,
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
    alignSelf: 'center',
    width: moderateScale(100),
    textAlign: 'center',
  },
  whichShowTextStyle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.FONT_FAMILY_BOLD,
    color: colors.black,
    lineHeight: moderateScale(24),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
    fontWeight: 'bold',
  },
});
