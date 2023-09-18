import { Alert } from "react-native";
import Strings from "../localization/Strings";
import Constants from "./Constants";
import ImagePicker from 'react-native-image-crop-picker';

const isStrEmpty = (str: string) => {
    return (str == "")
}

const isValidEmail = (val: string) => {
    return (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val));
}



const isValidName = (val: string) => {
    // let validNameReg = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let validNameReg = /^[0-9a-zA-Z \b]+$/;
    return (validNameReg.test(val));
}

const isValidPassword = (password: string) => {
    // let passRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    let passRegex = /^(?=.*?)(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,15}$/;
    return (passRegex.test(password));
}

const isValidUserName = (username: string) => {
    let validUserRegex = /^[A-Za-z0-9 ]+$/;
    return (validUserRegex.test(username))
}



const showAlertPicker = (config: AlertPickerConfig) => {
    const arrOptions = config.options.map((e: string, i: number) => {
      return {
        text: e,
        onPress: () => config.onSelect(i),
      };
    });
    Alert.alert(config.headerTitle, config.headerMessage, arrOptions, {
      cancelable: true,
    });
  };
const showAlert = function (title = "", message = "", handler = () => { }, btnTitle1 = Strings.ok) {
    Alert.alert(
        title,
        message,
        [
            {
                text: btnTitle1, onPress: () => handler(),
            },
        ],
        // { cancelable: false }
    )
}

const uuidv4 = () => {
    // eslint-disable-next-line
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            // eslint-disable-next-line
            var r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
};

const showAlertWithTwoButtons = function (message = "", handler = () => { }, btnTitle1 = Strings.yes, title = Constants.APP_NAME) {
    Alert.alert(
        title,
        message,
        [
            {
                text: btnTitle1, onPress: () => handler(),
            },
            {
                text: "No"
            }

        ],
        // { cancelable: false }
    )
}

const getTime = (data: any) => {
    let dateAndTime = data.toString().split(" ");
    let time = dateAndTime[1]
    return time
}

const parseSecondsToString = (seconds: number) => {
    if (seconds === Infinity || Number.isNaN(seconds) || seconds < 0) {
        return 'live';
    }

    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().slice(11, 19);
};



export {
    isStrEmpty, isValidEmail, isValidPassword, isValidUserName, isValidName, showAlert,
    uuidv4, showAlertWithTwoButtons, getTime, parseSecondsToString, showAlertPicker
};

