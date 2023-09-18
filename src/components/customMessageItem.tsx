import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../themes";
import { moderateScale } from "../utils/ScalingUtils";
import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';

interface MessageItemProps {
    buyerName: any;
    message: any;
    img: any;
    buyerJoinedName?: any;
    buyerJoindProfileImg?: any;
}

 const MessageItem = ({ buyerName, message, img, buyerJoinedName, buyerJoindProfileImg }: MessageItemProps,) => {
    return (
        <View
            style={s.itemContainer}
        >
            <View>
                {buyerName.length > 0 ? message === "Connected to the chat room." ?
                    null
                    :
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Image
                                source={{ uri: img }}
                                style={s.buyerImgStyle}
                            />
                        </View>
                        <View>
                            <Text style={s.userNameStyle}>{buyerName}</Text>
                            <Text style={s.receivedMsgStyle}>{message}</Text>
                        </View>
                    </View>
                    : null
                }
            </View>
        </View>
    )
}

export default memo(MessageItem);

const s = StyleSheet.create({ 

    itemContainer: {
        width: '75%',
    },
    buyerImgStyle: {
        width: moderateScale(15),
        height: moderateScale(15),
        resizeMode: 'contain',
        borderRadius: moderateScale(7.5)
    },
    waveHandImg: {
        width: moderateScale(20),
        height: moderateScale(20),
        resizeMode: 'contain'
    },
    userNameAndMsgConWithWaveHand: {
        flexDirection: 'row',

    },
    userNameStyle: {
        color: colors.white,
        fontWeight: '800',
        paddingHorizontal: moderateScale(5)

    },
    receivedMsgStyle: {
        color: colors.white,
        fontWeight: '800',
        width: moderateScale(200),
        paddingHorizontal: moderateScale(5),
        lineHeight: moderateScale(20)
    },

})