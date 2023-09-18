export interface NetworkErrorStatusProps {
    statusCode: number,
    statusMsg: string,
}

export interface ApiReqConfigProps {
    showSpinner: boolean,
    isApiResAutoHandle: boolean,
    isApiErrorAutoHandle: boolean,
    isNetErrAutoHandle: boolean
}

export interface ResponseModelProps {
    response_code: number,
    failure_message?: string,
    success_message?: string,
    response_packet?: any,
    http_status_code: number,
}