import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import Images from '../../assets/images';
import AuthRepo from '../../data/repo/AuthRepo';
import {
  resetSellerSlice,
  setIsSellListPageEnd,
} from '../../data/store/slices/sellerShowSlice';
import {resetUserSlice} from '../../data/store/slices/userDetailSlice';
import {
  createCustomerThunk,
  getUserStripeDetailThunk,
} from '../../data/store/thunks/BuyerShowsThunk';
import {
  getSellerScheduledShowListLoadMoreThnuk,
  getSellerScheduledShowListThnuk,
  getSellerScheduledShowSearch,
} from '../../data/store/thunks/sellerShowsThunk';
import Strings from '../../localization/Strings';
import NavigationConstants from '../../navigators/NavigationConstant';
import {colors, Fonts} from '../../themes';
import FlashMessageRef from '../../utils/FlashMessageRef';
import {moderateScale} from '../../utils/ScalingUtils';
import * as SessionManager from '../../utils/SessionManager';

import {resetBuyerSlice} from '../../data/store/slices/buyerShowSlice';
import {resetHomeSlice} from '../../data/store/slices/homeSlice';
import {
  getTime,
  showAlert,
  showAlertWithTwoButtons,
} from '../../utils/UtilityFunc';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

const SellerLiveShow = ({navigation}: any) => {
  const [searchShow, setSearchShow] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const pageNo = useRef(1);
  const pageSize = useRef(10);
  const status = useSelector((state: any) => state.buyerShowState.status);

  const dispatch = useDispatch<any>();

  const arrSellerScheduleShowLists = useSelector(
    (state: any) => state.sellerShowState.sellerScheduleShowLists,
  );
  const isSellListPageEnd = useSelector(
    (state: any) => state.sellerShowState.isSellListPageEnd,
  );

  useFocusEffect(
    React.useCallback(() => {
      getSellerScheduledShowList();
    }, []),
  );

  const getSellerScheduledShowList = (pageNo = 1, pageSize = 10) => {
    let data: any = {
      pageNumber: pageNo,
      pageSize: pageSize,
    };
    dispatch(getSellerScheduledShowListThnuk(data));
  };

  useEffect(() => {
    // Checking for the stripe customer existance
    dispatch(getUserStripeDetailThunk());
  }, []);

  useEffect(() => {
    if (status) {
      if (!status?.stripeCustomerId && !status?.stripeCustomerId?.length) {
        // creating an stripe account for the user
        dispatch(createCustomerThunk());
      } else {
        if (!status?.isCardAdded) {
          // creating the payment intent
          // dispatch(paymentSetupIntentThunk());
        }
      }
    }
  }, [status, status?.stripeCustomerId, status?.isCardAdded]);

  const onPressSearchButton = () => {
    let searchData = {
      pageNumber: 1,
      pageSize: 1,
      search: searchShow,
    };

    if (searchShow == '') {
      FlashMessageRef.show({message: Strings.productNamePlaceholder});
    } else {
      dispatch(getSellerScheduledShowSearch(searchData));
    }
  };
  const onSearchShowChange = (txt: any) => {
    setSearchShow(txt);
    if (txt.length == 0) {
      getSellerScheduledShowList();
    }
  };

  const onLogoutBtnPress = () => {
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

  const checkPermissionsForCamera = useCallback(data => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        console.log(result);
        if (
          result === 'denied' ||
          result === 'blocked' ||
          result === 'unavailable'
        ) {
          createCameraAlert();
        } else {
          checkPermissionsForRecordAudio(data);
        }
      })
      .catch(error => {
        console.log('This is the error', error);
      });
  }, []);

  const checkPermissionsForRecordAudio = useCallback(data => {
    console.log(' this is *************** ' + JSON.stringify(data));
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    )
      .then(result => {
        console.log(result);
        if (
          result === 'denied' ||
          result === 'blocked' ||
          result === 'unavailable'
        ) {
          createRecordAudioaAlert();
        } else {
          // navigation.navigate(NavigationConstants.SellerLiveStreamingScreen)
          navigation.navigate({
            name: NavigationConstants.SellerLiveStreamingScreen,
            params: {
              rtmpURL: data?.rtmpURL,
              streamKey: data?.streamKey,
              liveShowId: data?.liveShowId,
              roomARN: data?.roomARN,
              regionName: data?.regionName,
              isGiveWayProduct: data?.isGiveWayProduct,
              channelArnForAuction: data?.channelARN,
            },
          });
        }
      })
      .catch(error => {
        console.log('This is the error', error);
      });
  }, []);

  const onPressPlayBtn = (item: any) => {
    console.log('onPressItem', item);

    checkPermissionsForCamera(item);

    // navigation.navigate({
    //     name: NavigationConstants.SellerLiveStreamingScreen,
    //     params: {
    //         rtmpURL: item?.rtmpURL,
    //         streamKey: item?.streamKey,
    //         liveShowId: item?.liveShowId
    //     }
    // })
  };

  const renderSellerShowListItem = ({item}: any) => {
    return (
      <SellerShowItem
        startFrom={getTime(item?.startDateTime)}
        productName={item?.productName}
        categoryName={item?.categoryName}
        subCategoryName={item?.subCategoryName}
        thumbnail={item?.thumbanilUrl}
        onPressPlayBtn={() => onPressPlayBtn(item)}
        // onPressPlayBtn={() => console.log("hello love", item)}
      />
    );
  };

  const onPressSearchBtn = () => {
    FlashMessageRef.show({message: Strings.inProgress, success: true});
  };

  const wait = (timeout: number | undefined) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    pageNo.current = 1;
    setRefreshing(true);
    dispatch(setIsSellListPageEnd(false));
    getSellerScheduledShowList();
    setSearchShow('');
    // setArrJobMasterData(arrSearchedJobMasterData)
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const handleLoadMore = () => {
    if (!isSellListPageEnd) {
      pageNo.current = pageNo.current + 1;
      let data: any = {
        pageNumber: pageNo.current,
        pageSize: pageSize.current,
      };
      dispatch(getSellerScheduledShowListLoadMoreThnuk(data));
    }
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Header
            searchText={searchShow}
            onSearchTextChange={onSearchShowChange}
            onLogoutBtnPress={onLogoutBtnPress}
            onPressSearchBtn={onPressSearchButton}
          />
          <View style={{flex: 1}}>
            {arrSellerScheduleShowLists.length > 0 ? (
              <View style={styles.showCon}>
                <FlatList
                  data={arrSellerScheduleShowLists}
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
            ) : (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: Fonts.FONT_FAMILY_REGULAR,
                  fontSize: moderateScale(14),
                  textAlign: 'center',
                  marginTop: moderateScale(20),
                }}>
                {Strings.noDataFound}
              </Text>
            )}

            {/* <SellerShowList
                                    SellerShowListData={arrSellerScheduleShowLists}
                                    renderSellerShowListItem={renderSellerShowListItem}
                                /> */}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SellerLiveShow;

const createCameraAlert = () =>
  showAlert(
    Strings.cameraPermissionTitle,
    Strings.cameraPermissionMessage,
    (showAlert.prototype.handler = () => {
      Linking.openSettings();
    }),
  );

const createRecordAudioaAlert = () =>
  showAlert(
    Strings.recordPermissionTitle,
    Strings.recordPermissionMessage,
    (showAlert.prototype.handler = () => {
      Linking.openSettings();
    }),
  );

interface headerProps {
  searchText: any;
  onSearchTextChange: any;
  onLogoutBtnPress?: any;
  onPressSearchBtn?: any;
}

const Header = ({
  searchText,
  onSearchTextChange,
  onLogoutBtnPress,
  onPressSearchBtn,
}: headerProps) => {
  return (
    <View style={styles.headerCon}>
      <View style={styles.headerSubCon}>
        <Image source={Images.logo} style={styles.headerLogoImg} />
        <TouchableOpacity style={styles.searchContainer}>
          <Image source={Images.search} style={styles.searchImg} />
          <TextInput
            value={searchText}
            onChangeText={onSearchTextChange}
            style={styles.searchTxtStyle}
            placeholderTextColor={colors.gray}
            onSubmitEditing={onPressSearchBtn}
            returnKeyType="search"
            autoCorrect={false}
            placeholder={Strings.search}
            editable={true}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogoutBtnPress}>
          <Image source={Images.logout} style={styles.settingImg} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    // justifyContent: 'flex-end',
    paddingTop: moderateScale(25),
    alignItems: 'center',
  },
  headerSubCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    alignItems: 'center',
  },
  headerLogoImg: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: 'contain',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.black21,
    paddingHorizontal: moderateScale(20),
    borderColor: colors.gray,
    borderWidth: moderateScale(0.5),
    borderRadius: moderateScale(25),
    alignItems: 'center',
    marginLeft: moderateScale(20),
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
    // width: '100%',
    // height: '100%'
  },
  item: {
    flex: 1 / 2,
    // backgroundColor: 'green',
    // marginHorizontal: moderateScale(10),
    paddingTop: moderateScale(15),
    paddingLeft: moderateScale(10),
    // width: '48%',
    // height: '50%'
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
    paddingBottom: moderateScale(15),
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
    // width: moderateScale(21.63),
    // height: moderateScale(21.63),
    width: moderateScale(25),
    height: moderateScale(25),
    resizeMode: 'contain',
    marginLeft: moderateScale(7),
  },
  startFromTextContainer: {
    backgroundColor: colors.transparent,
  },
});
