import axios from 'axios';
import WebConstants from './WebConstants'
import { ResponseModel } from '../data/models';

import { NetworkErrorStatusProps, ResponseModelProps } from '../data/models/interfaces/'
import Strings from "../localization/Strings";
import * as SessionManager from '../utils/SessionManager'
import { resetScreen } from '../utils/NavigationObject';

const axiosInstance = axios.create({
    baseURL: WebConstants.BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})

const onTokenError = async () => {
    await SessionManager.removeLoginData()
    resetScreen('LoginScreen')
}

class WebApi {

    constructor() {

    }

    getRequest = (requestPath: string = "", headers: any = {}) => {
        console.log("get request >>>> " + WebConstants.BASE_URL + requestPath + " headers >>>> " + JSON.stringify(headers))
        const promise = new Promise<ResponseModelProps>((resolve, reject) => {
            axiosInstance.get(requestPath, {
                headers: headers,
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                },
            }).then((response) => {
                if (response.data !== undefined) {
                    console.log("api response for " + requestPath + " >>>>> " + JSON.stringify(response.data))
                    let responseModelObj
                    if (response.status == 400) {
                        //bad request
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = response.data
                    } else if (response.status == 401) {
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = 'Session expired!'
                        onTokenError()
                    } else {
                        responseModelObj = new ResponseModel(response.data);
                    }
                    responseModelObj.http_status_code = response.status
                    resolve(responseModelObj)
                }
            }).catch((error) => {
                console.log("error in get request>>>> url >>>> " + WebConstants.BASE_URL + requestPath + "========" + JSON.stringify(error))
                const errStatusObj = <NetworkErrorStatusProps>{
                    statusCode: 0,
                    statusMsg: ""
                }
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 200 - 500
                    */
                    errStatusObj.statusCode = error.response.status
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                } else if (error.request) {
                    /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */
                    errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
                    errStatusObj.statusMsg = Strings.checkYourNetConnection
                    reject(errStatusObj)
                } else {
                    // Something happened in setting up the request and triggered an Error
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                }
            })
        })
        return promise
    }

    postRequest = (requestPath = "", body = {}, headers = {}) => {
        
        console.log("post request >>>> " + WebConstants.BASE_URL + requestPath + " headers >>>> " + JSON.stringify(headers) + "body >>>>" + JSON.stringify(body))
        let promise = new Promise<ResponseModelProps>(async(resolve, reject) => {
         
            console.log(requestPath);
            axiosInstance.post(requestPath, body, {
                
                
                headers: headers,
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                },
            }).then((response) => {
                console.log('====================================');
                console.log("api response=>>>",response);
                console.log('====================================');
                if (response.data !== undefined) {
                    console.log("api response for " + requestPath + " >>>>> " + JSON.stringify(response.data))
                    let responseModelObj
                    if (response.status == 400) {
                        //bad request
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = response.data
                    } else if (response.status == 401) {
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = 'Session expired!'
                        onTokenError()
                    }
                    else {
                        responseModelObj = new ResponseModel(response.data);
                    }
                    responseModelObj.http_status_code = response.status
                    resolve(responseModelObj)
                }
            }).catch((error) => {
                console.log("error in post request>>>> url >>>> " + WebConstants.BASE_URL + requestPath + "========" + JSON.stringify(error))
                const errStatusObj = <NetworkErrorStatusProps>{
                    statusCode: 0,
                    statusMsg: ""
                }
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 200 - 500
                    */
                    errStatusObj.statusCode = error.response.status
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                } else if (error.request) {
                    /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */
                    errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
                    errStatusObj.statusMsg = Strings.checkYourNetConnection
                    reject(errStatusObj)
                } else {
                    // Something happened in setting up the request and triggered an Error
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                }
            })
        })
        return promise
    }

    patchRequest = (requestPath = "", body = {}, headers = {}) => {
        console.log("patch request >>>> " + WebConstants.BASE_URL + requestPath + " headers >>>> " + JSON.stringify(headers) + "body >>>>" + JSON.stringify(body))
        let promise = new Promise<ResponseModelProps>((resolve, reject) => {
            axiosInstance.patch(requestPath, body, {
                headers: headers,
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                },
            }).then((response) => {
                if (response.data !== undefined) {
                    console.log("api response for " + requestPath + " >>>>> " + JSON.stringify(response.data))
                    let responseModelObj
                    if (response.status == 400) {
                        //bad request
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = response.data
                    } else if (response.status == 401) {
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = 'Session expired!'
                        onTokenError()
                    } else {
                        responseModelObj = new ResponseModel(response.data);
                    }
                    responseModelObj.http_status_code = response.status
                    resolve(responseModelObj)
                }
            }).catch((error) => {
                console.log("error in post request>>>> url >>>> " + WebConstants.BASE_URL + requestPath + "========" + JSON.stringify(error))
                const errStatusObj = <NetworkErrorStatusProps>{
                    statusCode: 0,
                    statusMsg: ""
                }
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 200 - 500
                    */
                    errStatusObj.statusCode = error.response.status
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                } else if (error.request) {
                    /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */
                    errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
                    errStatusObj.statusMsg = Strings.checkYourNetConnection
                    reject(errStatusObj)
                } else {
                    // Something happened in setting up the request and triggered an Error
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                }
            })
        })
        return promise
    }

    putRequest = (requestPath = "", body = {}, headers = {}) => {
        console.log("put request >>>> " + WebConstants.BASE_URL + requestPath + " headers >>>> " + JSON.stringify(headers) + "body >>>>" + JSON.stringify(body))
        let promise = new Promise<ResponseModelProps>((resolve, reject) => {
            axiosInstance.put(requestPath, body, {
                headers: headers,
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                },
            }).then((response) => {
                if (response.data !== undefined) {
                    console.log("api response for " + requestPath + " >>>>> " + JSON.stringify(response.data))
                    let responseModelObj
                    if (response.status == 400) {
                        //bad request
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = response.data
                    } else if (response.status == 401) {
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = 'Session expired!'
                        onTokenError()
                    } else {
                        responseModelObj = new ResponseModel(response.data);
                    }
                    responseModelObj.http_status_code = response.status
                    resolve(responseModelObj)
                }
            }).catch((error) => {
                console.log("error in post request>>>> url >>>> " + WebConstants.BASE_URL + requestPath + "========" + JSON.stringify(error))
                const errStatusObj = <NetworkErrorStatusProps>{
                    statusCode: 0,
                    statusMsg: ""
                }
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 200 - 500
                    */
                    errStatusObj.statusCode = error.response.status
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                } else if (error.request) {
                    /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */
                    errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
                    errStatusObj.statusMsg = Strings.checkYourNetConnection
                    reject(errStatusObj)
                } else {
                    // Something happened in setting up the request and triggered an Error
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                }
            })
        })
        return promise
    }

    deleteRequest = (requestPath: string = "", data = {}, headers: any = {}) => {
        console.log("delete request >>>> " + WebConstants.BASE_URL + requestPath + " headers >>>> " + JSON.stringify(headers))
        let promise = new Promise<ResponseModelProps>((resolve, reject) => {
            axiosInstance.delete(requestPath, {
                data: data,
                headers: headers,
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                },
            }).then((response) => {
                if (response.data !== undefined) {
                    console.log("api response for " + requestPath + " >>>>> " + JSON.stringify(response.data))
                    let responseModelObj
                    if (response.status == 400) {
                        //bad request
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = response.data
                    } else if (response.status == 401) {
                        responseModelObj = new ResponseModel();
                        responseModelObj.failure_message = 'Session expired!'
                        onTokenError()
                    } else {
                        responseModelObj = new ResponseModel(response.data);
                    }
                    responseModelObj.http_status_code = response.status
                    resolve(responseModelObj)
                }
            }).catch((error) => {
                console.log("error in get request>>>> url >>>> " + WebConstants.BASE_URL + requestPath + "========" + JSON.stringify(error))
                const errStatusObj = <NetworkErrorStatusProps>{
                    statusCode: 0,
                    statusMsg: ""
                }
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 200 - 500
                    */
                    errStatusObj.statusCode = error.response.status
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                } else if (error.request) {
                    /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */
                    errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
                    errStatusObj.statusMsg = Strings.checkYourNetConnection
                    reject(errStatusObj)
                } else {
                    // Something happened in setting up the request and triggered an Error
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                }
            })
        })
        return promise
    }

}




export default new WebApi();