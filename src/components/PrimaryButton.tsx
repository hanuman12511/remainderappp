import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, Fonts } from '../themes';

interface PrimaryButtonProps {
  primaryBtnStyle: any;

  onPrimaryButtonPress: any;
  primaryBtnTitleStyle?: any;
  primaryBtnTitle: string
}

const PrimaryButton: React.FC<PrimaryButtonProps> = props => {

  return (
    <TouchableOpacity
      {...props}
      style={[styles.primaryBtnBasicStyle, props.primaryBtnStyle]}
      onPress={props.onPrimaryButtonPress}>
      <Text style={[styles.primaryBtnTitle, { color: colors.white }, props.primaryBtnTitleStyle]}>
        {props.primaryBtnTitle}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  primaryBtnBasicStyle: {
    backgroundColor: colors.pinkA2
  },
  primaryBtnTitle: {
    textAlign: 'center',
    fontFamily: Fonts.FONT_FAMILY_SEMIBOLD,
    color: colors.white
  },
});
