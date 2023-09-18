import ApiManager from '../../webServices/ApiManager';
import WebConstants from '../../webServices/WebConstants';
import * as NavigationObject from '../../utils/NavigationObject';
import FlashMessageRef from '../../utils/FlashMessageRef';


class BuyerRepo {


    static DashboardApi = (  ) => {
        return new Promise((resolve, reject) => {
            const apiManager = new ApiManager()
            apiManager.makeGetRequest(WebConstants.kDashboarDetails).then((res: any) => {
                resolve(res.response_packet)
            })
        })
    };



    static AddremainderApi = (
        
        remainderType:number,
        vehicleType: number,
        vehicleTypeName: string,
        vehicleName: string,
        vehicleModel: string,
        vehicleManufacturingYear: string,
        vehicleRegistrationNumber: string,
        licenseNumber: string,
        licenseType: number,
        renewalFrequency: number,
        registrationExpireDate: string,
        lastRenewalDate: string,
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                remainderType,
        vehicleType,
        vehicleTypeName,
        vehicleName,
        vehicleModel,
        vehicleManufacturingYear,
        vehicleRegistrationNumber,
        licenseNumber,
        licenseType,
        renewalFrequency,
        registrationExpireDate,
        lastRenewalDate,
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kAddremainder, body).then((res: any) => {              

                resolve(res)
            })
        })
    };

    static buyerSignupApi = (
        fullName: string,
        emailID: string,
        mobileNo: string,
        userName: string,
        password: string,
        invitationCode: string,
        countryId: number
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                fullName,
                emailID,
                mobileNo,
                userName,
                password,
                invitationCode,
                countryId
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kBuyerSignUp, body).then((res: any) => {              

                resolve(res)
            })
        })
    };

    static BuyerShowListApi = (
        pageNumber: number,
        pageSize: number,
        isLiveAll: boolean,
        isscheduledAll: boolean,
        categoryId: number

    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                pageNumber,
                pageSize,
                isLiveAll,
                isscheduledAll,
                categoryId
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kBuyerShowList, body).then((res: any) => {
                resolve(res.response_packet)
            })
        })
    };

    static getCountryListApi = () => {
        return new Promise((resolve, reject) => {

            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kCountryList).then((res: any) => {
                const model = {
                    countryData: res.response_packet.map((e: any, i: number) => ({
                        label: e.code,
                        value: e.code,
                        countryId: e.id
                    })),
                }
                resolve(model)
            })
        })
    };

    static BuyerCreateBidApi = (
        liveShowId: any,
        channelARN: any,
        bid: any
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                liveShowId,
                channelARN,
                bid
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kCreateBid, body).then((res: any) => {
                resolve(res.response_packet)
            })
        })
    };


    static getCategorySubCategryList = ( ) => {
        
        return new Promise((resolve, reject) => {           
            const apiManager = new ApiManager()
            apiManager.makeGetRequest(WebConstants.kCategorySubCategoryList).then((res: any) => {
                resolve(res.response_packet)
            })
        })
        
        
    };

    //for get subcategry by categry id 
    static getSubCategoryByCategory = (
        CategoryId:any
    ) => {
       
        return new Promise((resolve, reject) => {
            const body = {
                CategoryId,               
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kGetSubCategoryBySubCategoryid+"?CategoryId="+CategoryId).then((res: any) => {
                resolve(res.response_packet)
            })
        })
    };
    
    static followAPI = (
        followingUserId: any,
        categoryId: any,
        isFollow:any

    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                followingUserId,
                categoryId,
                isFollow,
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.followApi, body).then((res: any) => {
               
                resolve(res)

            })
        })
    };

    static editProfile = (
        Image:string,
        name: string,
        email:string,
        userName:string,
        InAffCode:string,
        mobileNumber:string,
        returnAddress:string,
        shippingAddress:string,
        bio:string
     
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                name,
                email,
                userName,
                InAffCode,
                mobileNumber,
                returnAddress,
                shippingAddress,
                bio  
            }
            const apiManager = new ApiManager()
            apiManager.makeMultiPartPostRequest(WebConstants.kEditProfile, body).then((res: any) => {
                resolve(res)
            })

        })
    };

    //for profile details 
    static getProfileDetails = ( ) => {        
        return new Promise((resolve, reject) => {           
            const apiManager = new ApiManager()
            apiManager.makeGetRequest(WebConstants.kProfileDetails).then((res: any) => {
                resolve(res.response_packet)
            })
        })
    };

    static uploadProfileImage = (    
        Image : any ,
        name: any,
        email: any,
        userName: any,
        InAffCode: any,
        mobileNumber: any,
        returnAddress: any,
        shippingAddress: any,
        bio: any
    ) => {
        return new Promise((resolve, reject) => {

            const formDataBody = new FormData()
            formDataBody.append("Image", Image );
            formDataBody.append("name", name);
            formDataBody.append("email", email);
            formDataBody.append("userName", userName);
            formDataBody.append("InAffCode", InAffCode);
            formDataBody.append("mobileNumber", mobileNumber);
            formDataBody.append("returnAddress", returnAddress);
            formDataBody.append("shippingAddress", shippingAddress);
            formDataBody.append("bio", bio); 
           
            const apiManager = new ApiManager()
            const apiUrl = WebConstants.kEditProfile
            apiManager.makeMultiPartPostRequest(apiUrl, formDataBody).then((res: any) => {


                if(res.response_code==200){
                     FlashMessageRef.show({message: res?.success_message, success: true});
                    NavigationObject.goBack()
                    

                }
                resolve(res.response_packet.fileName)

            })
        })
    };

 
    static GetLiveShowStatusApi = (
        liveShowId: any,
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                liveShowId,
            }
            const apiManager = new ApiManager()
            apiManager.apiConfig.isApiResAutoHandle = false
            apiManager.makePostRequest(WebConstants.kGetLiveShowStatus, body).then((res: any) => {
                console.log("getLiveShowStatus", res.response_packet)
                resolve(res)
            })
        })
    };

    static orderHistor = (
        pageNo: any,
        pageSize: any,
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                pageNo,
                pageSize
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.korderhistory, body).then((res: any) => {
               

                resolve(res)
            })
        })
    };
}



export default BuyerRepo  