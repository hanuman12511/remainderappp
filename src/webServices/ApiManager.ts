import { ApiReqConfigProps, NetworkErrorStatusProps } from '../data/models/interfaces'
import Strings from '../localization/Strings'
import FlashMessageRef from '../utils/FlashMessageRef'
import * as SessionManager from '../utils/SessionManager'
import * as SpinnerRef from '../utils/SpinnerRef'
import NetworkUtils from './NetworkUtils'
import WebApi from './WebApi'
import WebConstants from './WebConstants'

class ApiManager {

    //need to set when make api call
    apiConfig: ApiReqConfigProps = {
        isApiResAutoHandle: true,
        isApiErrorAutoHandle: true,
        showSpinner: true,
        isNetErrAutoHandle: true
    }

    constructor() {

    }

    private getAPIHeader = async () => {
        const loginData = await SessionManager.getLoginData()
        if (loginData != null) {
            const offset = new Date().getTimezoneOffset() * 60
            return {
                "Authorization": `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBbGwiLCJqdGkiOiI2NjIzOGM1NC1hNTRmLTQzYzMtOGU0Mi1kZGU0OTc2MDYzZmIiLCJ1c2VySWQiOiIxNCIsIkRldmljZSI6InN0cmluZyIsIkRldmljZVR5cGUiOiIwIiwibmJmIjoxNjk1NTY1ODA1LCJleHAiOjE3MDM0NDk4MDUsImlzcyI6ImFwaSIsImF1ZCI6IkFsbCJ9.JbTXLEJxM-Ch0VfYbrbIgTt93aUSpXdplcI62kOmSF8'}`,
                "UtcOffsetInSecond": offset,
                "accessToken": "a94635c1-1c60-4f9f-a38c-66654771dc96"
            }
        }
        return
    }

    //Private method
    private getNetworkErrorObj = () => {
        const errStatusObj = { statusCode: 0, statusMsg: "" }
        errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
        errStatusObj.statusMsg = Strings.checkYourNetConnection
        return errStatusObj
    }

    makeGetRequest = async (kApiPath: string = "", headers: object = {}) => {
        const promise = new Promise(async (resolve, reject) => {

            const isNetAvailable = await NetworkUtils.isNetworkAvailable()
            if (isNetAvailable == false) {
                const errStatusObj = this.getNetworkErrorObj()
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatusObj)
                } else {
                    reject(errStatusObj)
                }
                return
            }

            const apiHeader = await this.getAPIHeader()

            const defaultHeaders = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...apiHeader,
                ...headers
            }

            if (this.apiConfig.showSpinner) {
                SpinnerRef.show()
            }

            WebApi.getRequest(kApiPath, defaultHeaders).then((response) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (response.response_code == 200) {
                    console.log("response.response_code",response.response_code);
                    
                    resolve(response)
                } else {
                    console.log("response.failure_message",response.failure_message);

                    if (this.apiConfig.isApiResAutoHandle) {
                        FlashMessageRef.show({
                            message: response.failure_message ?? "default"
                        })
                    } else {
                        resolve(response)
                    }
                }
            }).catch((errStatus) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatus)
                } else {
                    reject(errStatus)
                }
            })
        })
        return promise
    }

    makeDeleteRequest = async (kApiPath: string = "", data = {}, headers: object = {}) => {
        const promise = new Promise(async (resolve, reject) => {

            const isNetAvailable = await NetworkUtils.isNetworkAvailable()

            if (isNetAvailable == false) {
                const errStatusObj = this.getNetworkErrorObj()
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatusObj)
                } else {
                    reject(errStatusObj)
                }
                return
            }

            const apiHeader = await this.getAPIHeader()

            const defaultHeaders = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...apiHeader,
                ...headers
            }

            if (this.apiConfig.showSpinner) {
                SpinnerRef.show()
            }

            WebApi.deleteRequest(kApiPath, data, defaultHeaders).then((response) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (response.response_code == 200) {
                    resolve(response)
                } else {
                    if (this.apiConfig.isApiResAutoHandle) {
                        FlashMessageRef.show({
                            message: response.failure_message ?? "default"
                        })
                    } else {
                        resolve(response)
                    }
                }
            }).catch((errStatus) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatus)
                } else {
                    reject(errStatus)
                }
            })
        })
        return promise
    }

    makePostRequest = (kApiPath: string = "", body = {}, headers = {}) => {
        const promise = new Promise(async (resolve, reject) => {
console.log(kApiPath);

            const isNetAvailable = await NetworkUtils.isNetworkAvailable()
            if (isNetAvailable == false) {
                const errStatusObj = this.getNetworkErrorObj()
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatusObj)
                } else {
                    reject(errStatusObj)
                }
                return
            }

            const apiHeader = await this.getAPIHeader()

            const defaultHeaders = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...apiHeader,
                ...headers
            }

            if (this.apiConfig.showSpinner) {
                
                SpinnerRef.show()
            }

            WebApi.postRequest(kApiPath, body, defaultHeaders).then((response) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (response.response_code == 200) {
                    resolve(response)
                } else {
                    if (this.apiConfig.isApiResAutoHandle) {
                        FlashMessageRef.show({
                            message: response.failure_message ?? ""
                        })
                    } else {
                        resolve(response)
                    }
                }
            }).catch((errStatus) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatus)
                } else {
                    reject(errStatus)
                }
            })
        })
        return promise
    }

    makePatchRequest = (kApiPath: string = "", body = {}, headers = {}) => {
        const promise = new Promise(async (resolve, reject) => {

            const isNetAvailable = await NetworkUtils.isNetworkAvailable()
            if (isNetAvailable == false) {
                const errStatusObj = this.getNetworkErrorObj()
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatusObj)
                } else {
                    reject(errStatusObj)
                }
                return
            }

            const apiHeader = await this.getAPIHeader()

            const defaultHeaders = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...apiHeader,
                ...headers
            }

            if (this.apiConfig.showSpinner) {
                SpinnerRef.show()
            }

            WebApi.patchRequest(kApiPath, body, defaultHeaders).then((response) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (response.response_code == 200) {
                    resolve(response)
                } else {
                    if (this.apiConfig.isApiResAutoHandle) {
                        FlashMessageRef.show({
                            message: response.failure_message ?? "default"
                        })
                    } else {
                        resolve(response)
                    }
                }
            }).catch((errStatus) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatus)
                } else {
                    reject(errStatus)
                }
            })
        })
        return promise
    }

    makePutRequest = (kApiPath: string = "", body = {}, headers = {}) => {
        const promise = new Promise(async (resolve, reject) => {

            const isNetAvailable = await NetworkUtils.isNetworkAvailable()
            if (isNetAvailable == false) {
                const errStatusObj = this.getNetworkErrorObj()
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatusObj)
                } else {
                    reject(errStatusObj)
                }
                return
            }

            const apiHeader = await this.getAPIHeader()

            const defaultHeaders = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...apiHeader,
                ...headers
            }

            if (this.apiConfig.showSpinner) {
                SpinnerRef.show()
            }

            WebApi.putRequest(kApiPath, body, defaultHeaders).then((response) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (response.response_code == 200) {
                    resolve(response)
                } else {
                    if (this.apiConfig.isApiResAutoHandle) {
                        FlashMessageRef.show({
                            message: response.failure_message ?? "default"
                        })
                    } else {
                        resolve(response)
                    }
                }
            }).catch((errStatus) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatus)
                } else {
                    reject(errStatus)
                }
            })
        })
        return promise
    }

    //Make mulipart request

    makeMultiPartPostRequest = (kApiPath: string = "", body = {}, headers = {}) => {
        const promise = new Promise(async (resolve, reject) => {

            const isNetAvailable = await NetworkUtils.isNetworkAvailable()
            if (isNetAvailable == false) {
                const errStatusObj = this.getNetworkErrorObj()
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatusObj)
                } else {
                    reject(errStatusObj)
                }
                return
            }

            const apiHeader = await this.getAPIHeader()

            const defaultHeaders = {
                'Content-Type': 'multipart/form-data',
                "Accept": "application/json",
                ...apiHeader,
                ...headers
            }

            if (this.apiConfig.showSpinner) {
                SpinnerRef.show()
            }

            WebApi.postRequest(kApiPath, body, defaultHeaders).then((response) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (response.response_code == 200) {
                    resolve(response)
                } else {
                    if (this.apiConfig.isApiResAutoHandle) {
                        FlashMessageRef.show({
                            message: response.failure_message ?? ""
                        })
                    } else {
                        resolve(response)
                    }
                }
            }).catch((errStatus) => {
                if (this.apiConfig.showSpinner) {
                    SpinnerRef.hide()
                }
                if (this.apiConfig.isNetErrAutoHandle) {
                    this.handleApiNetError(errStatus)
                } else {
                    reject(errStatus)
                }
            })
        })
        return promise
    }


    //Error Handling (Private Method)
    handleApiNetError = (errStatus: NetworkErrorStatusProps) => {
        FlashMessageRef.show({
            message: errStatus.statusMsg,
        })
    }
}




export default ApiManager;