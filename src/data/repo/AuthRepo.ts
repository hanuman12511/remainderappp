import ApiManager from '../../webServices/ApiManager';
import WebConstants from '../../webServices/WebConstants';

class AuthRepo {

    static loginApi = (
        email: string,
        password: string,
        deviceType: number,
        deviceToken: string,

    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                email,
                password,
                deviceType,
                deviceToken,

            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kLogin, body).then((res: any) => {
                resolve(res.response_packet)
            })
        })
    };

    static forgotApi = (
        emailID: string,
     
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                emailID,
  
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kForgotPassword, body).then((res: any) => {
                resolve(res)
            })

        })
    };

    //verify OTO 

    static verifyOtp = (
        mobileNo: any,
        otp:any
     
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                mobileNo,
                otp
  
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kVerifyOtp, body).then((res: any) => {
                resolve(res)
            })

        })
    };


    // static registerApi = (
    //     name: string,
    //     email: string,
    //     password: string
    // ) => {
    //     return new Promise((resolve, reject) => {
    //         const body = {
    //             name,
    //             email,
    //             password
    //         }
    //         const apiManager = new ApiManager()
    //         apiManager.makePostRequest(WebConstants.kRegistration, body).then((res: any) => {
    //             resolve(res)
    //         })
    //     })
    // };





    static logoutApi = () => {
        return new Promise((resolve, reject) => {
            const body = {}
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kLogout, body).then((res: any) => {
                // FlashMessageRef.show({ message: res?.success_message, success: true })
                resolve(res)
            })
        })
    };



    
    



}

export default AuthRepo  