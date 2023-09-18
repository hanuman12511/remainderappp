import React, {useCallback, useMemo, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Images from '../assets/images';
import {deleteCardThunk} from '../data/store/thunks/BuyerShowsThunk';
import {colors, Fonts} from '../themes';
import {getScreenHeight, getScreenWidth} from '../utils/Common';

const DeleteCard = (props: any) => {
  const dispatch = useDispatch();
  return (
    <>
      <Modal
        visible={props.visible}
        animationType="slide"
        transparent={true}
        {...props}>
        <Pressable onPress={props.pressHandler} style={styles.modalScreen}>
          <View style={styles.modalContanier}>
            <View style={{height: getScreenHeight(3)}} />

            <Text style={styles.title}>
              Your card has been expired please delete the current card and add
              a new one
            </Text>

            <View style={styles.row}>
              <Image
                source={Images.visa}
                resizeMethod="auto"
                style={styles.image}
              />
              <Text style={styles.cardNumber}>
                {'**** **** ****'} {props.data.lastFour}
              </Text>
            </View>

            <View style={{height: getScreenHeight(3)}} />
            <View
              style={[
                styles.row,
                {
                  justifyContent: 'space-between',
                  paddingHorizontal: getScreenHeight(3),
                },
              ]}>
              <View>
                <Text style={styles.subtitle}>Expires On</Text>
                <Text style={styles.mainTitle}>
                  {props.data.expMonth}/{props.data.expYear}
                </Text>
              </View>

              <TouchableOpacity onPress={props.action}>
                <Text style={[styles.mainTitle, {color: colors.red55}]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{height: getScreenHeight(3)}} />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalScreen: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContanier: {
    backgroundColor: colors.white,
    width: getScreenWidth(100),
    padding: getScreenHeight(2),
    borderTopLeftRadius: getScreenHeight(4),
    borderTopRightRadius: getScreenHeight(4),
    marginTop: getScreenHeight(2),
  },
  title: {
    color: colors.black,
    fontSize: getScreenHeight(2.2),
    fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
    marginBottom: getScreenHeight(3),
  },
  image: {
    height: getScreenHeight(4),
    width: getScreenHeight(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNumber: {
    color: colors.black21,
    fontFamily: Fonts.FONT_FAMILY_BOLD,
    fontSize: getScreenHeight(2.5),
    marginLeft: getScreenHeight(2),
  },
  subtitle: {
    color: colors.black21,
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    fontSize: getScreenHeight(1.8),
  },
  mainTitle: {
    color: colors.black21,
    fontFamily: Fonts.FONT_FAMILY_BOLD,
    fontSize: getScreenHeight(1.8),
  },
});

export default DeleteCard;
