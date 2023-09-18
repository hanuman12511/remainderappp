import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import BuyerRepo from '../../data/repo/BuyerRepo';
import {PrimaryButton, SecondaryInput, PrimaryImage} from '..//../components';
import Fonts from '../../assets/fonts';
import Images from '../../assets/images';
import FlashMessageRef from '../../utils/FlashMessageRef';
import React, {useRef, useState, useEffect} from 'react';
import {colors} from '../../themes';
import Strings from '../../localization/Strings';
import {isStrEmpty, isValidEmail} from '../../utils/UtilityFunc';
import {moderateScale} from '../../utils/ScalingUtils';
import {SafeAreaView} from 'react-native-safe-area-context';
import {showAlertPicker} from '../../utils/UtilityFunc';
import ImagePickerManager from '../../utils/ImagePickerManager';
import CropImagePickerManager from '../../utils/CropImagePickerManager';

const EditProfileScreen = ({navigation, route}: any) => {
  const profileDetails = useSelector(
    (state: any) => state.buyerShowState.profileDetails,
  );
  const dispatch = useDispatch<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [returnAddress, setReturnAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [bio, setBio] = useState('');
  const [profileImgUri, setProfileImgUri] = useState('');

  const nameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const userNameRef = useRef<any>(null);
  const invitationCodeRef = useRef<any>(null);
  const mobileNumberRef = useRef<any>(null);
  const returnAddressRef = useRef<any>(null);
  const shippingAddressRef = useRef<any>(null);
  const bioRef = useRef<any>(null);
  const profileImgFileRef = useRef<any>('');

  // useEffect(() => {
  //   dispatch(getProfileDetails());
  // }, []);

  useEffect(() => {
    setName(profileDetails?.name);
    setEmail(profileDetails?.email);
    setUserName(profileDetails?.userName);
    setInvitationCode(
      profileDetails?.inAffCode ? profileDetails?.inAffCode : '',
    );
    setMobileNumber(profileDetails?.mobileNumber);
    setReturnAddress(
      profileDetails?.returnAddress ? profileDetails?.return : '',
    );
    setShippingAddress(
      profileDetails?.shippingAddress ? profileDetails?.shippingAddress : '',
    );
    setBio(profileDetails?.bio ? profileDetails?.bio : '');
    setProfileImgUri(profileDetails?.image);
  }, [profileDetails]);

  const onBackButtonPress = () => {
    navigation.goBack();
  };
  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBackButtonPress}>
          <Image source={Images.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{Strings.editProfile}</Text>
        <View></View>
      </View>
    );
  };
  const onChangeName = (txt: any) => {
    setName(txt);
  };

  const onChangeEmail = (txt: any) => {
    setEmail(txt);
  };
  const onChangeUserName = (txt: any) => {
    setUserName(txt);
  };
  const onChangeInvitationCode = (txt: any) => {
    setInvitationCode(txt);
  };
  const onChangeMobileNumber = (txt: any) => {
    setMobileNumber(txt);
  };

  const onChangeReturnAddress = (txt: any) => {
    setReturnAddress(txt);
  };
  const onChangeShippingAddress = (txt: any) => {
    setShippingAddress(txt);
  };
  const onChangeBio = (txt: any) => {
    setBio(txt);
  };

  const validateInputs = () => {
    if (isStrEmpty(name.trim())) {
      FlashMessageRef.show({message: Strings.fullNameValidation});
      return false;
    } else if (isStrEmpty(email.trim())) {
      FlashMessageRef.show({message: Strings.emailIdValidation});
      return false;
    } else if (!isValidEmail(email.trim())) {
      FlashMessageRef.show({message: Strings.emailValidation});
      return false;
    } else if (isStrEmpty(userName.trim())) {
      FlashMessageRef.show({message: Strings.userNameValidation});
      return false;
    } else if (isStrEmpty(userName.trim())) {
      FlashMessageRef.show({message: Strings.passwordValidation});
      return false;
    } else if (isStrEmpty(invitationCode.trim())) {
      FlashMessageRef.show({
        message: Strings.InvitationAffiliationCodeValidation,
      });
      return false;
    } else if (isStrEmpty(mobileNumber.trim())) {
      FlashMessageRef.show({message: Strings.mobileNumberValidation});
      return false;
    }
    {
      return true;
    }
  };

  const onPressSaveButton = async () => {
    if (validateInputs()) {
      try {
        if (profileImgFileRef?.current == '') {
          let data = {
            Image: null,
            name: name,
            email: email,
            userName: userName,
            InAffCode: invitationCode,
            mobileNumber: mobileNumber,
            returnAddress: returnAddress,
            shippingAddress: shippingAddress,
            bio: bio,
          };

          await BuyerRepo.uploadProfileImage(
            data.Image,
            data.name,
            data.email,
            data.userName,
            data.InAffCode,
            data.mobileNumber,
            data.returnAddress,
            data.shippingAddress,
            data.bio,
          );
        } else {
          const urlParts = profileImgFileRef?.current?.uri?.split('/');
          const fileName = urlParts[urlParts?.length - 1];
          let data = {
            Image: {
              uri: profileImgUri,
              type: 'image/jpeg',
              name: fileName,
            },
            name: name,
            email: email,
            userName: userName,
            InAffCode: invitationCode,
            mobileNumber: mobileNumber,
            returnAddress: returnAddress,
            shippingAddress: shippingAddress,
            bio: bio,
          };

          console.log('*******************' + JSON.stringify(data));
          await BuyerRepo.uploadProfileImage(
            data.Image,
            data.name,
            data.email,
            data.userName,
            data.InAffCode,
            data.mobileNumber,
            data.returnAddress,
            data.shippingAddress,
            data.bio,
          );
        }
      } catch (err) {
        console.log('err' + err);
      }
    }
  };

  const onSelectProfileImg = ({}) => {
    showAlertPicker({
      headerTitle: 'Profile picture',
      headerMessage: 'Select an image for your profile',
      options: ['Choose From Gallery', 'Take Picture'],
      onSelect: (index: any) => {
        if (index == 0) {
          ImagePickerManager.showGallery()
            .then(async (response: any) => {
              const fileObj = await openCropper(response);
              profileImgFileRef.current = fileObj;
              setProfileImgUri(fileObj.uri);
            })
            .catch(err => {});
        } else {
          ImagePickerManager.showCamera()
            .then(async (response: any) => {
              const fileObj = await openCropper(response);
              profileImgFileRef.current = fileObj;
              setProfileImgUri(fileObj.uri);
            })
            .catch(err => {});
        }
      },
    });
  };

  const openCropper = async (imgRes: {uri: string | undefined; type: any}) => {
    const cropRes = await CropImagePickerManager.openCropper(imgRes.uri);
    const fileObj = {
      uri: cropRes.path,
      type: imgRes.type,
      name: `image_${new Date().getTime()}`,
    };
    return fileObj;
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
        <ImageBackground
          source={Images.whiteBackground}
          resizeMode={'cover'}
          style={styles.backgroundImgStyle}>
          <Header />
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            keyboardShouldPersistTaps={'handled'}
            extraHeight={10}>
            <View style={styles.editProfileContainer}>
              <View style={styles.profilePicViewStyle}>
                {profileImgUri ? (
                  <Image
                    source={{
                      uri: profileImgUri,
                    }}
                    style={styles.profileImageStyle}
                  />
                ) : (
                  <PrimaryImage
                    primaryImgSource={Images.profileImage}
                    primaryImageStyle={styles.profileImageStyle}
                  />
                )}
                <TouchableOpacity
                  style={styles.editprofileButtonstyle}
                  onPress={onSelectProfileImg}>
                  <PrimaryImage
                    primaryImgSource={Images.editImages}
                    primaryImageStyle={styles.editProfileStyle}
                  />
                </TouchableOpacity>
              </View>

              <SecondaryInput
                value={name}
                onChangeText={onChangeName}
                inputName={Strings.name}
                placeholder={Strings.name}
                keyboardType={'default'}
                maxLength={50}
                fontsFamily={Fonts.OpenSans_SemiBold}
                returnKeyType="next"
                refObj={nameRef}
                onSubmitEditing={() => {
                  emailRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={email}
                onChangeText={onChangeEmail}
                inputName={Strings.email}
                placeholder={Strings.email}
                maxLength={50}
                returnKeyType="next"
                refObj={emailRef}
                keyboardType={'email-address'}
                onSubmitEditing={() => {
                  userNameRef.current.focus();
                }}
                fontsFamily={Fonts.OpenSans_SemiBold}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={userName}
                onChangeText={onChangeUserName}
                inputName={Strings.userNmae}
                placeholder={Strings.userNmae}
                maxLength={50}
                returnKeyType="next"
                refObj={userNameRef}
                fontsFamily={Fonts.OpenSans_SemiBold}
                onSubmitEditing={() => {
                  invitationCodeRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={invitationCode}
                onChangeText={onChangeInvitationCode}
                inputName={Strings.invitationandAffiliationCode}
                placeholder={Strings.invitationandAffiliationCode}
                maxLength={50}
                returnKeyType="next"
                keyboardType={'numeric'}
                fontsFamily={Fonts.OpenSans_SemiBold}
                refObj={invitationCodeRef}
                onSubmitEditing={() => {
                  mobileNumberRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={mobileNumber}
                onChangeText={onChangeMobileNumber}
                inputName={Strings.mobileNumber}
                placeholder={Strings.mobileNumber}
                maxLength={20}
                returnKeyType="next"
                fontsFamily={Fonts.OpenSans_SemiBold}
                refObj={mobileNumberRef}
                keyboardType={'number-pad'}
                onSubmitEditing={() => {
                  returnAddressRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={returnAddress}
                onChangeText={onChangeReturnAddress}
                inputName={Strings.returnAddress}
                placeholder={Strings.returnAddress}
                maxLength={50}
                returnKeyType="next"
                refObj={returnAddressRef}
                fontsFamily={Fonts.OpenSans_SemiBold}
                onSubmitEditing={() => {
                  shippingAddressRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={shippingAddress}
                onChangeText={onChangeShippingAddress}
                inputName={Strings.shippingAddress}
                placeholder={Strings.shippingAddress}
                maxLength={50}
                fontsFamily={Fonts.OpenSans_SemiBold}
                returnKeyType="next"
                refObj={shippingAddressRef}
                onSubmitEditing={() => {
                  bioRef.current.focus();
                }}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <SecondaryInput
                value={bio}
                onChangeText={onChangeBio}
                inputName={Strings.bio}
                placeholder={Strings.bio}
                maxLength={50}
                fontsFamily={Fonts.OpenSans_SemiBold}
                returnKeyType="done"
                refObj={bioRef}
                onSubmitEditing={onPressSaveButton}
                inputLableColor={colors.black}
                secondaryInputColor={colors.black}
                placeholderTextColor={colors.grayA5}
                inputContainerBackgroundColor={colors.white}
                secondaryInputBorderColor={colors.grayA5}
              />
              <PrimaryButton
                primaryBtnStyle={styles.saveBtn}
                onPrimaryButtonPress={onPressSaveButton}
                primaryBtnTitle={Strings.save}
                primaryBtnTitleStyle={styles.saveBtnTxtStyle}
              />
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  backgroundImgStyle: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.black,
    paddingVertical: moderateScale(30),
    paddingHorizontal: moderateScale(15),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  headerText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: Fonts.OpenSans_Regular,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  editProfileContainer: {
    flex: 0.9,
    paddingHorizontal: moderateScale(20),
  },

  saveBtn: {
    backgroundColor: colors.pinkA2,
    paddingVertical: moderateScale(15),
    alignItems: 'center',
    borderRadius: moderateScale(8),
    marginVertical: moderateScale(20),
  },
  saveBtnTxtStyle: {
    fontSize: moderateScale(14),
  },
  profilePicViewStyle: {
    width: moderateScale(180),
    height: moderateScale(150),
    alignSelf: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
  },
  profileImageStyle: {
    borderWidth: moderateScale(0.7),
    borderColor: colors.gray,
    minWidth: moderateScale(150),
    minHeight: moderateScale(150),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
    borderRadius: moderateScale(100),
    
  },
  editProfileStyle: {
    alignSelf: 'flex-end',
  },
  editprofileButtonstyle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(20),
  },
});
