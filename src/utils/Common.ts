import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const getScreenWidth = (value: any) => {
    if (value) {
      let finalValue = (screenWidth * value) / 100;
      return finalValue;
    } else {
      return screenWidth;
    }
  };
  
  export const getScreenHeight = (value: any) => {
    if (value) {
      let finalValue = (screenHeight * value) / 100;
      return finalValue;
    } else {
      return screenHeight;
    }
  };
  