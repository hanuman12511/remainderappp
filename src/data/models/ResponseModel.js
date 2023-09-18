class ResponseModel {
    response_code = 0
    failure_message = ""
    success_message = ""
    response_packet = null
    http_status_code = 0
    constructor(props) {
        if (props) {
            this.response_code = props.responseCode
            this.failure_message = props.failureMsg
            this.success_message = props.successMsg
            this.response_packet = props.data
            this.http_status_code = props.http_status_code
        }
    }

}

export default ResponseModel