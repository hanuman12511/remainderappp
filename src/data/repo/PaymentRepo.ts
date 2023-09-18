import ApiManager from '../../webServices/ApiManager';
import WebConstants from '../../webServices/WebConstants';

class PaymentRepo {
    static DeleteCard = () => {
        return new Promise((resolve, reject) => {
            const apiManager = new ApiManager()
            apiManager.apiConfig.isApiResAutoHandle = false
            apiManager.makeGetRequest(WebConstants.deleteCard).then((res: any) => {
                resolve(res)
            })
        })
    };

    static GetUserStripeDetail = () => {
        return new Promise((resolve, reject) => {
            const apiManager = new ApiManager()
            apiManager.apiConfig.isApiResAutoHandle = false
            apiManager.makeGetRequest(WebConstants.GetUserStripeDetail).then((res: any) => {
                resolve(res)
            })
        })
    };

    static CreateCustomer = () => {
        return new Promise((resolve, reject) => {
            const apiManager = new ApiManager()
            apiManager.apiConfig.isApiResAutoHandle = false
            apiManager.makeGetRequest(WebConstants.CreateCustomer).then((res: any) => {
                resolve(res)
            })
        })
    };


    static paymentSetupIntent = () => {
        return new Promise((resolve, reject) => {
            const apiManager = new ApiManager()
            apiManager.apiConfig.isApiResAutoHandle = false
            apiManager.makeGetRequest(WebConstants.paymentSetupIntent).then((res: any) => {
                resolve(res)
            })
        })
    };
}



export default PaymentRepo  