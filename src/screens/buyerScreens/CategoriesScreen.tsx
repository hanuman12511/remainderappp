import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import NavigationConstants from '../../navigators/NavigationConstant';
import Images from '../../assets/images';
import {PrimaryImage} from '../../components';
import {moderateScale} from '../../utils/ScalingUtils';
import {getCategorySubCategoryListtThunk} from '../../data/store/thunks/BuyerShowsThunk';
import {useDispatch, useSelector} from 'react-redux';
import {colors, Fonts} from '../../themes';
import Strings from '../../localization/Strings';

const CategoriesScreen = ({navigation}: any) => {
  const dispatch = useDispatch<any>();
  const [isrefreshing, setisrefresing] = useState(false);

  const [state, setState] = useState([]);
  const categrylist = useSelector(
    (state: any) => state.buyerShowState.categorySubcategoryList,
  );

  useEffect(() => {
    dispatch(getCategorySubCategoryListtThunk());
  }, []);

  useEffect(() => {
    let local = JSON.parse(JSON.stringify(categrylist));
    for (let i = 0; i < local.length; i++) {
      local[i].categryOPen = false;
    }
    setState(local);
  }, [categrylist]);

  const renderItem = ({item, index}) => (
    <Item
      title={item.name}
      isOpenDrawer={item.categryOPen}
      itemIndex={index}
      opectionItem={item.opectionitem}
    />
  );

  const loadCategryData = () => {
    dispatch(getCategorySubCategoryListtThunk());
  };

  function onSubCategryButtonPress(itemindex, opectionItem) {
    let local: any = JSON.parse(JSON.stringify(state));
    local[itemindex].categryOPen = !state[itemindex]?.categryOPen;
    setState(local);
  }

  const onSubCategryItemButtonPress = (categryName, categryId) => {
    navigation.navigate({
      name: NavigationConstants.SubCategoryScreen,
      params: {
        categryName: categryName,
        categryId: categryId,
      },
    });
  };

  const subCategreyItemlist = subCategaryItem => {
    return subCategaryItem.map(element => {
      if (element.name == null) {
        return null;
      } else {
        return (
          <View key={element.id}>
            <TouchableOpacity
              onPress={() =>
                onSubCategryItemButtonPress(element.name, element.id)
              }>
              <Text style={styles.drawerItemStyle}>{element.name}</Text>
            </TouchableOpacity>
          </View>
        );
      }
    });
  };
  const shopAllButtonPress = (categoryId: any, catagroyName: any) => {
    navigation.navigate({
      name: NavigationConstants.ShopAllCategoryScreen,
      params: {
        categryId: categoryId,
        categryName: catagroyName,
      },
    });
  };

  const Item = ({title, isOpenDrawer, itemIndex, opectionItem}: any) => (
    <View style={styles.mainItemViewStyle}>
      <View
        style={{
          ...styles.itemViewStyle,
          borderBottomLeftRadius: isOpenDrawer
            ? moderateScale(0)
            : moderateScale(5),
          borderBottomRightRadius: isOpenDrawer
            ? moderateScale(0)
            : moderateScale(5),
        }}>
        <Text adjustsFontSizeToFit={true} style={styles.title}>
          {title}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              shopAllButtonPress(state[itemIndex]?.id, state[itemIndex]?.name);
            }}
            style={{
              backgroundColor: colors.pinkA2,
              paddingHorizontal: moderateScale(10),
              justifyContent: 'center',
              borderRadius: moderateScale(5),
              borderWidth: moderateScale(1),
              borderColor: colors.pinkA2,
            }}>
            <Text
              style={{
                fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
                color: colors.white,
              }}>
              {Strings.shopAll}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSubCategryButtonPress(itemIndex, opectionItem)}
            style={{
              alignItems: 'center',
              paddingVertical: moderateScale(10),
              paddingHorizontal: moderateScale(10),
            }}>
            <PrimaryImage
              primaryImgSource={
                isOpenDrawer ? Images.upArrowImage : Images.icondown
              }
              primaryImageStyle={styles.arrowIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isOpenDrawer ? (
        <View
          style={{
            ...styles.viewItemStyleView,
            borderBottomWidth:
              state[itemIndex].subCategroyLists[0].id == 0
                ? moderateScale(0)
                : moderateScale(1),
          }}>
          {subCategreyItemlist(state[itemIndex]?.subCategroyLists)}
        </View>
      ) : null}
    </View>
  );
  //
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={state}
          renderItem={renderItem}
          style={{backgroundColor: colors.white}}
          refreshControl={
            <RefreshControl
              refreshing={isrefreshing}
              onRefresh={loadCategryData}
            />
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  itemViewStyle: {
    backgroundColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
    borderTopLeftRadius: moderateScale(5),
    borderTopRightRadius: moderateScale(5),
  },
  title: {
    color: colors.white,
    fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(2),
    fontSize: moderateScale(16),
    textAlign: 'left',
    alignSelf: 'center',
    flex: 1,
  },
  arrowIconStyle: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  mainItemViewStyle: {
    margin: moderateScale(10),
  },
  drawerItemStyle: {
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    fontSize: moderateScale(15),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    color: colors.black,
  },
  viewItemStyleView: {
    borderLeftColor: colors.black21,
    borderLeftWidth: moderateScale(1),
    borderBottomColor: colors.black21,
    borderRightColor: colors.black21,
    borderRightWidth: moderateScale(1),
    borderBottomStartRadius: moderateScale(5),
    borderBottomEndRadius: moderateScale(5),
  },
});

export default CategoriesScreen;
