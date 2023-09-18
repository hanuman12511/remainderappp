import {Linking, PermissionsAndroid, Alert} from 'react-native';

import Strings from '../localization/Strings';
import {showAlert} from './UtilityFunc';

class AndroidPermissionManager {
  static requestCameraPermission = () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: Strings.cameraPermissionMessage,
            message: Strings.allowCameraGalleryPermission,
            buttonNegative: Strings.cameraPermissionTitle,
            buttonPositive: Strings.ok,
          },
        );
        console.log(' this is granted for permission time camera ' + granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve(true);
        } else {
          this.handleError(granted);
          resolve(false);
        }
      } catch (err) {
        console.log(
          'error in camera permission>>>>>>>>>>',
          JSON.stringify(err),
        );
      }
    });
    return promise;
  };

  static requestGalleryPermission = async () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: Strings.galleryPermission,
            message: Strings.allowPhotoGalleryPermission,
            buttonNegative: Strings.cancel,
            buttonPositive: Strings.ok,
          },
        );

        console.log(' this is granted for permission time gallery ' + granted);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve(true);
        } else {
          this.handleError(granted);
          resolve(false);
        }
      } catch (err) {
        console.warn(err);
      }
    });
    return promise;
  };

  static handleError = granted => {
    switch (granted) {
      case PermissionsAndroid.RESULTS.DENIED:
        break;
      case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
        Alert.alert(Strings.appName, Strings.allowCameraGalleryPermission, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => Linking.openSettings()},
        ]);
        break;
      default:
        break;
    }
  };
}

export default AndroidPermissionManager;
