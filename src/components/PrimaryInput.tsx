import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Images from '../assets/images';
import { colors, Fonts } from '../themes';
import { moderateScale } from '../utils/ScalingUtils';
import PrimaryImage from './PrimaryImage';

interface PrimaryInputProps {
  passwordInput?: boolean;
  inputName: string;
  inputIcon?: string;
  placeholder: string;
  maxLength?: number;
  refObj?: any;
  returnKeyType?: any;
  onSubmitEditing?: any;
  value: any;
  onChangeText: any
  keyboardType?: any
}

const PrimaryInput: React.FC<PrimaryInputProps> = props => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.inputNameStyle}>{props.inputName} </Text>
        {
          props.passwordInput ?
            // password input code 
            <View style={styles.iconAndInputCon}>
              <PrimaryImage
                primaryImgSource={Images.lock}
                primaryImageStyle={styles.iconStyle}
              />
              <TextInput
                placeholder={props.placeholder}
                onChangeText={props.onChangeText}
                value={props.value}
                style={styles.inputStyle}
                placeholderTextColor={colors.white}
                autoCapitalize={'none'}
                autoCorrect={false}
                maxLength={props.maxLength}
                secureTextEntry={isPasswordVisible ? false : true}
                ref={props.refObj}
                returnKeyType={props.returnKeyType}
                onSubmitEditing={props.onSubmitEditing}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <PrimaryImage
                  primaryImgSource={isPasswordVisible ? Images.passwordLock : Images.passwordView}
                  primaryImageStyle={styles.iconStyle}
                />
              </TouchableOpacity>
            </View>
            :
            // without password input code
            <View style={styles.iconAndInputCon}>
              <PrimaryImage
                primaryImgSource={props.inputIcon}
                primaryImageStyle={styles.iconStyle}
              />
              <TextInput
                value={props.value}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
                style={styles.inputStyle}
                placeholderTextColor={colors.white}
                autoCapitalize={'none'}
                autoCorrect={false}
                ref={props.refObj}
                returnKeyType={props.returnKeyType}
                onSubmitEditing={props.onSubmitEditing}
                maxLength={props.maxLength}
              />
            </View>
        }
      </View>
    </View>
  )
}

export default PrimaryInput

const styles = StyleSheet.create({
  iconAndInputCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.black21,
    borderColor: colors.gray44,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? moderateScale(10) : moderateScale(0)
  },
  iconStyle: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain'
  },
  inputStyle: {
    flex: 1,
    fontSize: moderateScale(12),
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    color: colors.white,
    paddingLeft: moderateScale(10)
  },

  inputNameStyle: {
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    color: colors.white,
    paddingVertical: moderateScale(5)
  },
  container: {
    paddingTop: moderateScale(10)
  }
})

