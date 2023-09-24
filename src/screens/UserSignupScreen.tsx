
import { Fonts, colors } from "../themes";
import { moderateScale } from "../utils/ScalingUtils";
import React from 'react'
import {ImageBackground,KeyboardAwareScrollView, StyleSheet,Text} from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler";
const UserSignupScreen = ({navigation}) => {

    return(
           
         <ImageBackground
       
        resizeMode={'cover'}
        style={styles.backgroundImgStyle}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          keyboardShouldPersistTaps={'handled'}
          extraHeight={10}>
            <TouchableOpacity style={styles.btn}>
              <Text>SignUp</Text>
            </TouchableOpacity>
            </KeyboardAwareScrollView>
            </ImageBackground>
        
        
    )

}
export default UserSignupScreen;

const styles = StyleSheet.create({
    backgroundImgStyle: {
      flex: 1,
      paddingVertical: moderateScale(20),
      paddingHorizontal: moderateScale(20),
    },
    contentContainerStyle: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    logoContainer: {
      flex: 0.4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoStyle: {
      width: moderateScale(189),
      height: moderateScale(168),
      resizeMode: 'contain',
    },
    signInContainer: {
      flex: 0.6,
    },
    signInStyle: {
      color: colors.white,
      fontSize: moderateScale(21),
      lineHeight: moderateScale(30),
      fontFamily: Fonts.OpenSans_Regular,
    },
    textInputStyle: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(10),
      borderColor: colors.gray,
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(15),
      fontSize: moderateScale(18),
    },
    loginBtn: {
      backgroundColor: colors.pinkA2,
      paddingVertical: moderateScale(15),
      alignItems: 'center',
      borderRadius: moderateScale(8),
      marginVertical: moderateScale(20),
    },
    loginbtnTxtStyle: {
      fontSize: moderateScale(14),
    },
    forgotPassStyle: {
      fontSize: moderateScale(11),
      lineHeight: moderateScale(16),
      fontFamily: Fonts.OpenSans_SemiBold,
      color: colors.skycc,
      paddingVertical: moderateScale(5),
      textAlign: 'right',
      textDecorationLine: 'underline',
    },
    hrline:{
      backgroundColor:colors.blue,
      height:moderateScale(1)
    },
    btn:{
      flex:1,
      backgroundColor:"red"
    }
  });
  