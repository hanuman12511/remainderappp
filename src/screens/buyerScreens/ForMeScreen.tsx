import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  LogBox,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../../assets/images';
import BuyerRepo from '../../data/repo/BuyerRepo';
import {getBuyerShowListThunk} from '../../data/store/thunks/BuyerShowsThunk';
import Strings from '../../localization/Strings';
import NavigationConstants from '../../navigators/NavigationConstant';
import {colors, Fonts} from '../../themes';
import FlashMessageRef from '../../utils/FlashMessageRef';
import {moderateScale} from '../../utils/ScalingUtils';

const ForMeScreen = ({navigation}: any) => {
  const dispatch = useDispatch<any>();

  const arrBuyerLiveListData = useSelector(
    (state: any) => state.buyerShowState.buyerLiveShowList,
  );

  const arrBuyerScheduledListData = useSelector(
    (state: any) => state.buyerShowState.buyerScheduleShowLists,
  );

  const userDetail = useSelector(
    (state: any) => state.userDetailState.userData,
  );
  const buyerName = userDetail?.name;
  const buyerProfileImg = userDetail?.userAvatar;
  const buyerId = userDetail?.userId;

  console.log('userDetaillllll', userDetail);
  console.log('buyerProfileImg', buyerProfileImg);

  const [refreshing, setRefreshing] = useState(false);
  const [timePassed, setTimePassed] = useState(false);

  console.log(
    '@123123 arrBuyerLiveListDataarrBuyerLiveListData',
    JSON.stringify(arrBuyerLiveListData),
  );

  // useEffect(() => {
  //   getBuyerShowsList()
  // }, [])

  useFocusEffect(
    React.useCallback(() => {
      getBuyerShowsList();
    }, []),
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const getBuyerShowsList = (pageNo = 1, pageSize = 10) => {
    let data: any = {
      pageNumber: pageNo,
      pageSize: pageSize,
      isLiveAll: true,
      isscheduledAll: true,
      categoryId: 0,
    };
    dispatch(getBuyerShowListThunk(data));
  };

  const onPressScheduledPlayBtn = () => {
    FlashMessageRef.show({message: Strings.liveShowNotStarted});
  };

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   getBuyerShowsList()
  // }, []);

  const wait = (timeout: number | undefined) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getBuyerShowsList();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getTime = (data: any) => {
    let dateAndTime = data.toString().split(' ');
    let time = dateAndTime[1];
    return time;
  };

  // const onPressLivePlayBtn = async (item: any) => {
  //   let data = {
  //     liveShowId: item?.liveShowId
  //   }

  //   let biddingMetaDataObjFromParams = await BuyerRepo.GetLiveShowStatusApi(data?.liveShowId)
  //   console.log("GetLiveShowStatusApiGetLiveShowStatusApiGetLiveShowStatusApi res", biddingMetaDataObjFromParams)
  //   if (biddingMetaDataObjFromParams) {
  //     navigation.navigate({
  //       name: NavigationConstants.BuyerLiveShow,
  //       params: {
  //         playbackUrl: item?.playbackUrl,
  //         CHAT_ROOM_ID: item?.roomARN,
  //         CHAT_REGION: item?.chatRegion,
  //         sellerName: item?.sellerName,
  //         sellerProfileImg: item?.sellerImage,
  //         buyerName: buyerName,
  //         buyerProfileImg: buyerProfileImg,
  //         channelARNForCreateBid: item?.channelARN,
  //         liveShowId: item?.liveShowId,
  //         biddingMetaDataObjFromParams: biddingMetaDataObjFromParams,
  //         productName: item?.title
  //       }
  //     })
  //   }
  // }

  const onPressLivePlayBtn = async (item: any) => {
    console.log('itemmmmm', item);
    let data = {
      liveShowId: item?.liveShowId,
    };

    let response: any = await BuyerRepo.GetLiveShowStatusApi(data?.liveShowId);
    console.log(
      'GetLiveShowStatusApiGetLiveShowStatusApiGetLiveShowStatusApi res',
      response,
    );

    if (response?.response_code === 200) {
      let biddingMetaDataObjFromParams = response?.response_packet;

      if (biddingMetaDataObjFromParams) {
        navigation.navigate({
          name: NavigationConstants.BuyerLiveShow,
          params: {
            playbackUrl: item?.playbackUrl,
            CHAT_ROOM_ID: item?.roomARN,
            CHAT_REGION: item?.chatRegion,
            sellerName: item?.sellerName,
            sellerProfileImg: item?.sellerImage,
            buyerName: buyerName,
            buyerProfileImg: buyerProfileImg,
            channelARNForCreateBid: item?.channelARN,
            liveShowId: item?.liveShowId,
            biddingMetaDataObjFromParams: biddingMetaDataObjFromParams,
            productName: item?.title,
            sellerId: item?.sellerId,
            buyerId: buyerId,
          },
        });
      }
    } else if (response?.response_code === 223) {
      console.log('2233333');
      navigation.navigate({
        name: NavigationConstants.BuyerLiveShow,
        params: {
          playbackUrl: item?.playbackUrl,
          CHAT_ROOM_ID: item?.roomARN,
          CHAT_REGION: item?.chatRegion,
          sellerName: item?.sellerName,
          sellerProfileImg: item?.sellerImage,
          buyerName: buyerName,
          buyerProfileImg: buyerProfileImg,
          channelARNForCreateBid: item?.channelARN,
          liveShowId: item?.liveShowId,
          productName: item?.title,
          sellerId: item?.sellerId,
          buyerId: buyerId,
        },
      });
    } else {
      console.log('something wrong with GetLiveShowStatusApi');
    }
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
    console.log('scheduled item', item?.thumbanilUrl);
    return (
      <ScheduledShowItem
        startFrom={getTime(item?.startDateTime)}
        productName={item?.title}
        categoryName={item?.categoryName}
        subCategoryName={item?.subCategoryName}
        thumbnail={item?.thumbanilUrl}
        onPressPlayBtn={() => onPressScheduledPlayBtn()}
      />
    );
  };

  return (
    <ImageBackground
      source={Images.whiteBackground}
      resizeMode={'cover'}
      style={styles.backgroundImgStyle}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{marginBottom: moderateScale(20), marginTop: moderateScale(20)}}
        refreshControl={
          <RefreshControl
            // tintColor={textColors.black}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View style={{}}>
          {arrBuyerLiveListData.length > 0 ||
          arrBuyerScheduledListData.length > 0 ? (
            <View style={{}}>
              <LiveShowList
                LiveShowListData={arrBuyerLiveListData}
                renderLiveShowListItem={renderLiveShowListItem}
                navigation={navigation}
                showLiveShowTitle={
                  arrBuyerLiveListData.length > 0 ? true : false
                }
              />

              <ScheduledShowsList
                scheduledShowsListData={arrBuyerScheduledListData}
                renderScheduledShowsListItem={renderScheduledShowsListItem}
                navigation={navigation}
                showScheduledShowTitle={
                  arrBuyerScheduledListData.length > 0 ? true : false
                }
              />
            </View>
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>{Strings.noBuyerScheduledShows}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ForMeScreen;

//Live Show Code

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

const onPressLiveShowAllButton = navigation => {
  navigation.navigate({
    name: NavigationConstants.ShowAllCateoreScreen,
    params: {
      isLiveAll: true,
      isscheduledAll: false,
      categoryId: 0,
      fromWichShow: Strings.liveShows,
    },
  });
};

const onPressScheduledShowAllButton = navigation => {
  navigation.navigate({
    name: NavigationConstants.ShowAllCateoreScreen,
    params: {
      isLiveAll: false,
      isscheduledAll: true,
      categoryId: 0,
      fromWichShow: Strings.scheduledShows,
    },
  });
};
interface LiveShowListProps {
  LiveShowListData: any;
  renderLiveShowListItem: any;
  showLiveShowTitle: any;
  navigation: any;
}

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
            onPress={() => onPressLiveShowAllButton(navigation)}
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
            marginBottom: moderateScale(5),
          }}>
          <Text style={styles.liveShowTxt}>{Strings.scheduledShows}</Text>
          <TouchableOpacity
            onPress={() => onPressScheduledShowAllButton(navigation)}
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
    paddingVertical: moderateScale(5),
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
    paddingBottom: moderateScale(15),
  },
  startFrom: {
    color: colors.white,
    fontSize: moderateScale(12),
    fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
    lineHeight: moderateScale(17),
    textAlign: 'center',
    paddingTop: moderateScale(5),
  },
  liveShowTxt: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.FONT_FAMILY_BOLD,
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
  backgroundImgStyle: {
    flex: 1,
    // justifyContent: 'center',
    // paddingHorizontal: moderateScale(20)
  },
  startFromTextContainer: {
    backgroundColor: colors.transparent,
  },

  showAllTextStyle: {
    color: colors.pinkA2,
    fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
    fontSize: moderateScale(14),
    fontWeight: '400',
    paddingHorizontal: moderateScale(20),
  },
});
