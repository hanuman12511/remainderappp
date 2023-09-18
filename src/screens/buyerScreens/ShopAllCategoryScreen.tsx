import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import NavigationConstants from '../../navigators/NavigationConstant';
import {useDispatch, useSelector} from 'react-redux';
import {
  getSubCategorybyCategoryListThunk,
  followAPI,
  getBuyerSubCatoryShowlist,
} from '../../data/store/thunks/BuyerShowsThunk';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Fonts from '../../assets/fonts';
import Strings from '../../localization/Strings';
import {moderateScale} from '../../utils/ScalingUtils';
import React, {useEffect} from 'react';
import Images from '../../assets/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../themes';

const onSubCategoryButtonPress = () => {
  console.log('sub category button press ');
};

const Item = ({title}) => (
  <View style={styles.item}>
    <TouchableOpacity onPress={onSubCategoryButtonPress}>
      <Text style={styles.titleStyle}>{title}</Text>
    </TouchableOpacity>
  </View>
);
const ShopAllCategoryScreen = ({navigation, route}: any) => {
  const {categryName, categryId} = route?.params;
  const dispatch = useDispatch<any>();

  useEffect(() => {
    let data = {
      CategoryId: categryId,
    };
    dispatch(getSubCategorybyCategoryListThunk(data));

    let showData = {
      pageNumber: 1,
      pageSize: 10,
      isLiveAll: true,
      isscheduledAll: true,
      categoryId: 0,
    };
    dispatch(getBuyerSubCatoryShowlist(showData));
  }, []);

  const subcategrylist = useSelector(
    (state: any) => state.buyerShowState.subcategorySubcategoryList,
  );

  const arrBuyerLiveListData = useSelector(
    (state: any) => state.buyerShowState.shopAllShowList,
  );

  const onBackButtonPress = () => {
    navigation.goBack();
  };

  const arrBuyerScheduledListData = useSelector(
    (state: any) => state.buyerShowState.shopAllShudledShowList,
  );

  interface headerProps {
    onBackButtonPress: any;
    onMenuButtonPress: any;
  }

  const renderItem = ({item}) => <Item title={item.name} />;
  const Header = ({onBackButtonPress, onMenuButtonPress}: headerProps) => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBackButtonPress}>
          <Image source={Images.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{categryName}</Text>
        <TouchableOpacity
          style={styles.followButtonStyle}
          onPress={onMenuButtonPress}>
          <Text style={styles.followTextStyle}>{Strings.follow}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const onFlowButtonPress = () => {
    let followData = {
      followingUserId: 0,
      categoryId: categryId,
      isFollow: true,
    };
    dispatch(followAPI(followData));
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
            onMenuButtonPress={onFlowButtonPress}
          />
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            keyboardShouldPersistTaps={'handled'}
            extraHeight={10}>
            <View style={styles.subCategoryScreenStyle}>
              {subcategrylist.length > 0 ? (
                <View style={{}}>
                  <Text style={styles.allCategoryStyle}>
                    {Strings.allCategories}
                  </Text>

                  <FlatList
                    data={subcategrylist}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                  />
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: colors.black}}></Text>
                </View>
              )}

              {arrBuyerLiveListData.length > 0 ||
              arrBuyerScheduledListData.length > 0 ? (
                <View style={{}}>
                  <LiveShowList
                    LiveShowListData={arrBuyerLiveListData}
                    renderLiveShowListItem={renderLiveShowListItem}
                    showLiveShowTitle={
                      arrBuyerLiveListData.length > 0 ? true : false
                    }
                    navigation={navigation}
                  />

                  <ScheduledShowsList
                    scheduledShowsListData={arrBuyerScheduledListData}
                    renderScheduledShowsListItem={renderScheduledShowsListItem}
                    showScheduledShowTitle={
                      arrBuyerScheduledListData.length > 0 ? true : false
                    }
                    navigation={navigation}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: colors.black}}>
                    {Strings.noBuyerScheduledShows}
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

const getTime = (data: any) => {
  let dateAndTime = data.toString().split(' ');
  let time = dateAndTime[1];
  return time;
};
const onPressLivePlayBtn = async (item: any) => {
  console.log('itemmmmm', item);
};
const renderLiveShowListItem = ({item}: any) => {
  return (
    <LiveShowItem
      startFrom={getTime(item?.startDateTime)}
      productName={item?.title}
      categoryName={item?.categoryName}
      subCategoryName={item?.subCategoryName}
      thumbnail={item?.thumbanilUrl}
      onPressPlayBtn={() => onPressLivePlayBtn(item)}
    />
  );
};

const renderScheduledShowsListItem = ({item}: any) => {
  return (
    <ScheduledShowItem
      startFrom={getTime(item?.startDateTime)}
      productName={item?.title}
      categoryName={item?.categoryName}
      subCategoryName={item?.subCategoryName}
      thumbnail={item?.thumbanilUrl}
      onPressPlayBtn={() => console.log('onpress show list ')}
    />
  );
};
interface LiveShowListProps {
  LiveShowListData: any;
  renderLiveShowListItem: any;
  showLiveShowTitle: any;
  navigation: any;
}

export default ShopAllCategoryScreen;

interface LiveShowListItemProps {
  startFrom: any;
  productName: any;
  categoryName: any;
  subCategoryName: any;
  thumbnail: any;
  onPressPlayBtn: any;
}
const LiveShowItem = ({
  startFrom,
  productName,
  categoryName,
  subCategoryName,
  thumbnail,
  onPressPlayBtn,
}: LiveShowListItemProps) => {
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

const onPressLIVEShowAllButton = navigation => {
  navigation.navigate({
    name: NavigationConstants.ShowAllCateoreScreen,
    params: {
      isLiveAll: true,
      isscheduledAll: false,
      categoryId: 0,
      fromWichShow: 'Live Shows',
    },
  });
};

const LiveShowList = ({
  LiveShowListData,
  renderLiveShowListItem,
  showLiveShowTitle,
  navigation,
}: LiveShowListProps) => {
  return (
    <View style={styles.showCon}>
      {showLiveShowTitle ? (
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: moderateScale(5),
          }}>
          <Text style={styles.liveShowTxt}>{Strings.liveShows}</Text>
          <TouchableOpacity
            onPress={() => onPressLIVEShowAllButton(navigation)}
            style={{
              borderRadius: moderateScale(5),
              paddingHorizontal: moderateScale(5),

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.showAllTextStyle}>{Strings.showAll}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        data={LiveShowListData}
        renderItem={renderLiveShowListItem}
        keyExtractor={item => item?.liveShowId}
        ItemSeparatorComponent={ItemSeparatorComponent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const ItemSeparatorComponent = () => {
  return <View style={styles.seperator} />;
};

// Scheduled Show Code

const onPressSheduleShowAllButton = navigation => {
  navigation.navigate({
    name: NavigationConstants.ShowAllCateoreScreen,
    params: {
      isLiveAll: false,
      isscheduledAll: true,
      categoryId: 0,
      fromWichShow: 'Scheduled Shows',
    },
  });
};
interface ScheduledShowListItemProps {
  startFrom: any;
  productName: any;
  categoryName: any;
  subCategoryName: any;
  thumbnail: any;
  onPressPlayBtn: any;
}

const ScheduledShowItem = ({
  startFrom,
  productName,
  categoryName,
  subCategoryName,
  thumbnail,
  onPressPlayBtn,
}: ScheduledShowListItemProps) => {
  console.log('ScheduledShowItem', thumbnail);
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

interface ScheduledShowsListProps {
  scheduledShowsListData: any;
  renderScheduledShowsListItem: any;
  showScheduledShowTitle: boolean;
  navigation: any;
}

const ScheduledShowsList = ({
  scheduledShowsListData,
  renderScheduledShowsListItem,
  showScheduledShowTitle,
  navigation,
}: ScheduledShowsListProps) => {
  return (
    <View style={styles.showCon}>
      {showScheduledShowTitle ? (
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={styles.liveShowTxt}>{Strings.scheduledShows}</Text>
          <TouchableOpacity
            onPress={() => onPressSheduleShowAllButton(navigation)}
            style={{
              paddingHorizontal: moderateScale(5),
              borderRadius: moderateScale(5),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.showAllTextStyle}>{Strings.showAll}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        data={scheduledShowsListData}
        renderItem={renderScheduledShowsListItem}
        keyExtractor={item => item?.liveShowId}
        ItemSeparatorComponent={ItemSeparatorComponent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
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
    alignSelf: 'center',
    width: moderateScale(100),
    textAlign: 'center',
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  followButtonStyle: {
    backgroundColor: colors.pinkA2,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(50),
    borderWidth: moderateScale(1),
    alignItems: 'center',
  },
  followTextStyle: {
    color: colors.white,
    fontFamily: Fonts.OpenSans_SemiBold,
    fontSize: moderateScale(13),
  },

  subCategoryScreenStyle: {
    flex: 0.9,
    paddingHorizontal: moderateScale(20),
  },
  allCategoryStyle: {
    fontFamily: Fonts.OpenSans_Bold,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.black,
    marginVertical: moderateScale(10),
  },
  titleStyle: {
    color: colors.black,
    fontSize: moderateScale(14),
    paddingHorizontal: moderateScale(20),
    backgroundColor: colors.graye2,
    alignSelf: 'center',
    margin: moderateScale(5),
    borderRadius: moderateScale(20),
    paddingVertical: moderateScale(5),
    fontFamily: Fonts.OpenSans_Regular,
  },
  liveTextstyle: {
    color: colors.black,
    fontFamily: Fonts.OpenSans_SemiBold,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  showAllTextStyle: {
    color: colors.pinkA2,
    fontFamily: Fonts.OpenSans_SemiBold,
    fontSize: moderateScale(14),
    fontWeight: '100',
  },
  showAllbuttonStyle: {
    backgroundColor: colors.pinkA2,
    borderRadius: moderateScale(100),
    borderWidth: moderateScale(1),
    borderColor: colors.pinkA2,
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(10),
  },
  liveShowTxt: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.OpenSans_Bold,
    color: colors.black,
    lineHeight: moderateScale(24),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
  },
  scheduledShowTxt: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.FONT_FAMILY_BOLD,
    color: colors.black,
    lineHeight: moderateScale(24),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
  },
  showCon: {
    paddingHorizontal: moderateScale(5),
  },
  seperator: {},
  thumbnail: {
    // width: '100%',
    // height: '100%',
    flex: 1,
    resizeMode: 'contain',
    borderRadius: moderateScale(10),
  },
  thumbnailCon: {
    width: moderateScale(165),
    height: moderateScale(210),
  },
  item: {
    flex: 1,
    paddingHorizontal: moderateScale(5),
  },
  productName: {
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
    // textShadowColor: 'red',
    // textShadowOffset: {
    //   width: 5,
    //   height: 5
    // },
    // textShadowRadius: 50
  },
  txtContainer: {
    width: moderateScale(165),
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
    paddingBottom: moderateScale(5),
  },
  startFrom: {
    color: colors.white,
    fontSize: moderateScale(12),
    fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
    lineHeight: moderateScale(17),
    textAlign: 'center',
    paddingTop: moderateScale(5),
  },
  startFromTextContainer: {
    backgroundColor: colors.transparent,
  },
});
