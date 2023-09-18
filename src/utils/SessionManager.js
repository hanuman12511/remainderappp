import SecureStorage from './SecureStorage'
import * as LocalAsyncStorage from './LocalAsyncStorage'

/**
 * user session maintain
 */

export const setLoginData = async (data) => {
    await SecureStorage.save("LOGIN_DATA", JSON.stringify(data))
    return
}

export const getLoginData = async () => {
    const loginData = await SecureStorage.get("LOGIN_DATA")
    if (loginData != null) {
        const parsedData = JSON.parse(loginData)
        return parsedData
    } else {
        console.log('login data is null')
        return null
    }
}

export const removeLoginData = async () => {
    await SecureStorage.remove("LOGIN_DATA")
}

// /**
//  * FCM token save 
//  */

export const getFCMToken = async () => {
    const fcmToken = await LocalAsyncStorage.getData('@FCM_TOKEN')
    if (fcmToken !== null || fcmToken !== undefined) {
        return fcmToken
    } else {
        console.log('fcmToken is null')
        return fcmToken
    }
}

export const setFCMToken = async (data) => {
    await LocalAsyncStorage.storeData('@FCM_TOKEN', data)
    return
}

export const removeFCMToken = async () => {
    await LocalAsyncStorage.removeData('@FCM_TOKEN')
}

