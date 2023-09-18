import ApiManager from '../../webServices/ApiManager';
import WebConstants from '../../webServices/WebConstants';

class ChatRepo {

    static getChatTokenApi = (
        roomArn: string,
        attributes: object,
        capabilities: string[]


    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                roomArn,
                attributes,
                capabilities
            }
            const apiManager = new ApiManager()
            apiManager.apiConfig.showSpinner = false
            apiManager.makePostRequest(WebConstants.kchatRoomToken, body).then((res: any) => {

                console.log("chat room response", res.response_packet)
                resolve(res.response_packet)

            })
        })
    };




}

export default ChatRepo  