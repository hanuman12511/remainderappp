import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../themes';
import { moderateScale } from '../utils/ScalingUtils';

interface PrimaryTextProps {
    text: any;
    primaryTextStyle: any;
    onTextPress?: any
}

const PrimaryText: React.FC<PrimaryTextProps> = props => {

    return (
        <Text
            onPress={props.onTextPress}
            style={[styles.textStyle, props.primaryTextStyle]}>{props.text}</Text>
    )
}

export default PrimaryText

const styles = StyleSheet.create({
    textStyle: {
        fontSize: moderateScale(14),
        color: colors.black
    }
})