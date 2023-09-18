
import React, { useRef, useState } from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import Fonts from '../assets/fonts'
import Images from '../assets/images'
import { PrimaryButton, PrimaryImage, PrimaryInput, PrimaryText } from '../components'
import { forgotPasswordThunk } from '../data/store/thunks/authThunk'
import Strings from '../localization/Strings'
import { colors } from '../themes'
import FlashMessageRef from '../utils/FlashMessageRef'
import { moderateScale } from '../utils/ScalingUtils'
import { isStrEmpty, isValidEmail } from '../utils/UtilityFunc'


const ForgotPassword = ({ navigation }: any) => {



    const [email, setEmail] = useState('');


    const emailRef = useRef<any>(null)

    const dispatch = useDispatch<any>()

    const onChangeEmail = (txt: any) => {
        setEmail(txt)

    }

    const validateInputs = () => {

        if (isStrEmpty(email.trim())) {
            FlashMessageRef.show({ message: Strings.emailValidation })
            return false
        } else if (!isValidEmail(email.trim())) {
            FlashMessageRef.show({ message: Strings.emailValidation })
            return false
        } else {
            return true
        }
    }

    const onPressSubmitBtn = () => {
        validateInputs()

        let data = {
            emailID: email
        }

        if (validateInputs()) {
            dispatch(forgotPasswordThunk(data))
        }
    };

    return (
        <ImageBackground
            source={Images.backgroundImg}
            resizeMode={'cover'}
            style={styles.backgroundImgStyle}
        >
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainerStyle}
                keyboardShouldPersistTaps={'handled'}
                extraHeight={10}
            >
                <View style={styles.logoContainer}>
                    <PrimaryImage
                        primaryImgSource={Images.logo}
                        primaryImageStyle={styles.logoStyle}
                    />
                </View>
                <View style={styles.forgotContainer}>
                    <PrimaryText
                        text={Strings.forgotPassword}
                        primaryTextStyle={styles.signInStyle}
                    />
                    <View style={styles.forgotSubTxtCon}>
                        <PrimaryText
                            text={Strings.forgotSubTitle}
                            primaryTextStyle={styles.forgotSubTitleStyle}
                        />
                    </View>
                    <PrimaryInput
                        refObj={emailRef}
                        inputName={Strings.emailAddress}
                        inputIcon={Images.email}
                        placeholder={Strings.emailAddressPlaceholder}
                        value={email}
                        onChangeText={onChangeEmail}
                        // maxLength={6}
                        onSubmitEditing={onPressSubmitBtn}
                        returnKeyType="done"
                    />
                    <PrimaryButton
                        primaryBtnStyle={styles.forgotBtn}
                        onPrimaryButtonPress={onPressSubmitBtn}
                        primaryBtnTitle={Strings.submit}
                        primaryBtnTitleStyle={styles.forgotBtnTxtStyle}
                    />
                </View>
            </KeyboardAwareScrollView>
        </ImageBackground>
    )
}

export default ForgotPassword

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
        resizeMode: 'contain'
    },
    forgotContainer: {
        flex: 0.6,
    },
    signInStyle: {
        color: colors.white,
        fontSize: moderateScale(21),
        lineHeight: moderateScale(30),
        fontFamily: Fonts.OpenSans_Regular

    },
    textInputStyle: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        borderColor: colors.gray,
        borderRadius: moderateScale(10),
        borderWidth: moderateScale(1),
        marginVertical: moderateScale(15),
        fontSize: moderateScale(18)
    },
    forgotBtn: {
        backgroundColor: colors.pinkA2,
        paddingVertical: moderateScale(15),
        alignItems: 'center',
        borderRadius: moderateScale(8),
        marginVertical: moderateScale(20)
    },
    forgotBtnTxtStyle: {
        fontSize: moderateScale(14),
    },
    forgotPassStyle: {
        fontSize: moderateScale(11),
        lineHeight: moderateScale(16),
        fontFamily: Fonts.OpenSans_SemiBold,
        color: colors.skycc,
        paddingVertical: moderateScale(5),
        textAlign: 'right',
        textDecorationLine: 'underline'
    },
    forgotSubTxtCon: {
        paddingVertical: moderateScale(5)
    },






    forgotSubTitleStyle: {
        fontFamily: Fonts.OpenSans_Regular,
        fontSize: moderateScale(13),
        color: colors.white

    }
})



