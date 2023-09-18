import React from 'react';
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, Fonts} from '../themes';
import {moderateScale} from '../utils/ScalingUtils';

interface SecondaryInputProps {
  inputName: string;
  placeholder: string;
  maxLength?: number;
  refObj?: any;
  returnKeyType?: any;
  onSubmitEditing?: any;
  value: any;
  onChangeText: any;
  keyboardType?: any;
  inputLableColor?: any;
  secondaryInputColor?: any;
  placeholderTextColor: any;
  inputContainerBackgroundColor: any;
  secondaryInputBorderColor?: any;
  fontsFamily?: any;
}

const SecondaryInput: React.FC<SecondaryInputProps> = props => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.inputNameStyle, {color: props.inputLableColor}]}>
          {props.inputName}{' '}
        </Text>
        <View
          style={[
            styles.iconAndInputCon,
            {
              backgroundColor: props.inputContainerBackgroundColor,
              borderColor: props.secondaryInputBorderColor,
            },
          ]}>
          <TextInput
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            style={[styles.inputStyle, {color: props.secondaryInputColor, fontFamily:props.fontsFamily}, ]}
            placeholderTextColor={props.placeholderTextColor}
            autoCapitalize={'none'}
            autoCorrect={false}
            ref={props.refObj}
            returnKeyType={props.returnKeyType}
            onSubmitEditing={props.onSubmitEditing}
            maxLength={props.maxLength}
            keyboardType={props.keyboardType}
          />
        </View>
      </View>
    </View>
  );
};

export default SecondaryInput;

const styles = StyleSheet.create({
  iconAndInputCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: colors.gray44,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    alignItems: 'center',
    paddingVertical:
      Platform.OS == 'ios' ? moderateScale(10) : moderateScale(0),
  },
  iconStyle: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
  },
  inputStyle: {
    flex: 1,
    fontSize: moderateScale(12),
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    color: colors.white,
  },

  inputNameStyle: {
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    color: colors.white,
    paddingVertical: moderateScale(5),
  },
  container: {
    paddingTop: moderateScale(10),
  },
});
