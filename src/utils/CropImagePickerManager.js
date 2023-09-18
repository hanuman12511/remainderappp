import ImagePicker from 'react-native-image-crop-picker';

class CropImagePickerManager {

    static openCropper = async(imgPath="") => {
        const defaultOptions = {
            cropperStatusBarColor:"black",
            freeStyleCropEnabled:true,
            includeExif:true,
            width: 800, 
            height: 800,
        }
        try {
            const res = await ImagePicker.openCropper({
                path : imgPath,
                ...defaultOptions
            })
            console.log(res)
            return res
        } catch (error) {
            throw error
        }
    }
    
}

export default CropImagePickerManager