import ApiManager from '../../webServices/ApiManager';
import WebConstants from '../../webServices/WebConstants';

class SellerRepo {

    static GetSellerScheduledShowListApi = (
        pageNumber: number,
        pageSize: number

    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                pageNumber,
                pageSize
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.ksellerScheduledShow, body).then((res: any) => {

                console.log("res.response_packet", res.response_packet)
                resolve(res.response_packet)

            })
        })
    };


    static sellerStartEndLiveShow = (
        liveShowId: number,
        isStarted: boolean
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                liveShowId,
                isStarted
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kstartEndLiveShow, body).then((res: any) => {
                resolve(res.success_message)
            })
        })
    };

    static sellerCreateAuction = (
        liveShowId: number,
        productName: string,
        auctionDuration: any,
        initialBidAmount: number,
        differenceInNextBid: any,
        channelARN: string,
    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                liveShowId,
                productName,
                auctionDuration,
                initialBidAmount,
                differenceInNextBid,
                channelARN
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kCreateAuction, body).then((res: any) => {
                resolve(res)
            })
        })
    };

    static sellerEndAuction = (
        auctionId: any,
        channelARN: string,

    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                auctionId,
                channelARN
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.kEndAuction, body).then((res: any) => {
                resolve(res.success_message)
            })
        })
    };
    
    static GetSellerScheduledShow = (
        pageNumber: number,
        pageSize: number,
        search:any

    ) => {
        return new Promise((resolve, reject) => {
            const body = {
                pageNumber,
                pageSize,
                search
            }
            const apiManager = new ApiManager()
            apiManager.makePostRequest(WebConstants.ksellerScheduledShow, body).then((res: any) => {
                resolve(res.response_packet)

            })
        })
    };

}

export default SellerRepo  