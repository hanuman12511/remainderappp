import { Platform, Linking } from 'react-native';
import { CameraOptions, ErrorCode, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Strings from '../localization/Strings';
import AndroidPermissionManager from './AndroidPermissionManager';
import FlashMessageRef from './FlashMessageRef';
import { showAlert } from './UtilityFunc';

class ImagePickerManager {

    options: CameraOptions = {
        mediaType: "photo",
        maxWidth: 600,
        maxHeight: 600,
        includeExtra: true
    };

    constructor() {

    }

    showCamera = (options: CameraOptions = <CameraOptions>{}) => {
        let promise = new Promise(async (resolve, reject) => {
            const customOptions = { ...this.options, ...options }
            console.log(JSON.stringify(customOptions))

            if (Platform.OS == "android") {
                const isGranted = await AndroidPermissionManager.requestCameraPermission()

                // console.log('====================================');
                // console.log("isGranted", isGranted);
                // console.log('====================================');

                if (isGranted) {
                    launchCamera(customOptions, (response) => {
                        if (response.didCancel) {
                            FlashMessageRef.show({
                                message: Strings.youCancelledAction
                            })
                        } else if (response.errorCode) {
                            console.log('ImagePicker Error: >>>', response.errorMessage);
                            this.handleError(response.errorCode)
                            reject(response.errorCode)
                        } else {
                            const assets = response.assets ?? []
                            resolve(assets[0])
                        }
                    })
                }
                else {
                    showAlert(Strings.allowCameraGalleryPermission, () => {console.log("the value is cancel")} )
                }
            } else {
                launchCamera(customOptions, (response) => {
                    if (response.didCancel) {
                        FlashMessageRef.show({
                            message: Strings.youCancelledAction
                        })
                    } else if (response.errorCode) {
                        console.log('ImagePicker Error: >>>', response.errorMessage);
                        this.handleError(response.errorCode)
                        reject(response.errorCode)
                    } else {
                        const assets = response.assets ?? []
                        resolve(assets[0])
                    }
                })
            }

        })
        return promise
    }

    showGallery = (options = {}) => {
        let promise = new Promise(async (resolve, reject) => {
            const customOptions = { ...this.options, ...options }
            console.log(" custom option ======= " + JSON.stringify(customOptions))

            if (Platform.OS == "android") {
                const isGranted = await AndroidPermissionManager.requestGalleryPermission()

                if (isGranted) {
                    launchImageLibrary(customOptions, (response) => {
                        if (response.didCancel) {
                            FlashMessageRef.show({
                                message: Strings.youCancelledAction
                            })
                        } else if (response.errorCode) {
                            console.log('ImagePicker Error: >>>', response.errorMessage);
                            this.handleError(response.errorCode)
                            reject(response.errorCode)
                        } else {
                            const assets = response.assets ?? []
                            resolve(assets[0])
                        }
                    })

                }


            } else {
                //if platform iOS direct method call launch image library
                launchImageLibrary(customOptions, (response) => {
                    if (response.didCancel) {
                        FlashMessageRef.show({
                            message: Strings.youCancelledAction
                        })
                    } else if (response.errorCode) {
                        console.log('ImagePicker Error: >>>', response.errorMessage);
                        this.handleError(response.errorCode)
                        reject(response.errorCode)
                    } else {
                        const assets = response.assets ?? []
                        resolve(assets[0])
                    }
                })
            }

        })
        return promise
    }

    handleError = (errorCode: ErrorCode) => {
        switch (errorCode) {
            case "camera_unavailable":
                showAlert("Camera is not on device.")
                break;
            case "permission":
                showAlert(Strings.allowCameraGalleryPermission, () => { console.log("refreshing the value is ")})
                break;
            case "others":
                showAlert(Strings.oopsSomethingWentWrong)
                break;
            default:
                break;
        }
    }

}

export default new ImagePickerManager()