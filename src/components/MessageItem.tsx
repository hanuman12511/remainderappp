import React, { memo } from "react";
import { View, Image, Text, StyleSheet } from "react-native"
import { colors } from "../themes";
import { moderateScale } from "../utils/ScalingUtils";

const MessageItem = (props: any) => {
    return (
        <View style={styles.screen}>
            <View>
                {props?.buyerName?.length > 0 ? props.message === "Connected to the chat room." ?
                    null
                    :
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Image
                                source={{ uri: props.img }}
                                style={styles.buyerImgStyle}
                            />
                        </View>
                        <View>
                            <Text style={styles.userNameStyle}>{props.buyerName}</Text>
                            <Text style={styles.receivedMsgStyle}>{props.message}</Text>
                        </View>
                    </View>
                    : null
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        width: '75%',
    },
    buyerImgStyle: {
        width: moderateScale(15),
        height: moderateScale(15),
        resizeMode: 'contain',
        borderRadius: moderateScale(7.5)
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

export default memo(MessageItem)