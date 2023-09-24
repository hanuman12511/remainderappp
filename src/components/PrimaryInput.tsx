import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Images from '../assets/images';
import { colors, Fonts } from '../themes';
import { moderateScale } from '../utils/ScalingUtils';
import PrimaryImage from './PrimaryImage';
import RequireField from './RequireField';
import { getScreenWidth } from '../utils/Common';

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
        <View style={[props.layoutstyle]}>
      <View>
      <View style={styles.textfield}>
        <Text style={styles.inputNameStyle}>{props.inputName} </Text>
        <RequireField/>
        </View>
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
             {/*  <PrimaryImage
                primaryImgSource={props.inputIcon}
                primaryImageStyle={styles.iconStyle}
              /> */}
              <TextInput
                value={props.value}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
                style={styles.inputStyle}
                placeholderTextColor={colors.gray}
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
    </View>
  )
}

export default PrimaryInput

const styles = StyleSheet.create({
  iconAndInputCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
   /*  backgroundColor: colors.white, */
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? moderateScale(10) : moderateScale(0)
  },
  layoutViewStyle:{
    flex: 1,
    backgroundColor:colors.black,
    borderRadius:getScreenWidth(5),
    paddingHorizontal:getScreenWidth(5)
},
  iconStyle: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain'
  },
  textfield:{
    flexDirection:'row',
alignItems:'center'
},
  inputStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    color: colors.black,
    paddingLeft: moderateScale(1),
  },

  inputNameStyle: {
    fontFamily: Fonts.FONT_FAMILY_REGULAR,
    fontSize: 16,
    lineHeight: moderateScale(16),
    color: colors.black,
    paddingVertical: moderateScale(5)
  },
  container: {
    paddingTop: moderateScale(10)
  }
})

