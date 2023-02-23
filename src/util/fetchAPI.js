import axios from "axios";
export default class FetchAPI {
    constructor() {
        this.getActiveShiftList=async ()=>{
            return (await fetch(null, "get", "/rosterWeb/publicAPI/getActiveShiftList"));
        }
        this.getPreferredShiftList=async (year,month)=>{
            return (await fetch({year:year,month:month}, "get", "/rosterWeb/privateAPI/getPreferredShiftList"));
        }
        this.getPreviousMonthShiftList=async (year, month)=>{
            return (await fetch({year:year,month:month}, "get", "/rosterWeb/privateAPI/getPreviousMonthShiftList"));
        }
        this.getRosterList=async (year,month)=>{
            return (await fetch({year:year,month:month}, "get", "/rosterWeb/publicAPI/getRosterList"));
        }
        this.getSystemParam=async ()=>{
            return (await fetch(null, "get", "/rosterWeb/publicAPI/getSystemParam"));
        }
        //================================================================================================================
        let fetch = async (data, method, url, responseType, header) => {                            
            axios.interceptors.response.use(
                response => response,
                error => {
                    let errorObj;
                    //console.log(error);
                    switch (true) {
                        case (error.response !== undefined):
                            switch (error.response.status) {
                                case 404:
                                    errorObj = {
                                        status: 404,
                                        message: error.message
                                    };
                                    break;
                                default:
                                    errorObj = {
                                        status: error.response.status,
                                        message: error.response.statusText
                                    };
                                    break;
                            }
                            break;
                        case (error.request !== undefined):
                            errorObj = error.request;
                            break
                        default:
                            errorObj = { message: error.message };
                            break;
                    }
                    throw errorObj;
                }
            );
            let requestObj = { "method": method, "url": url }
            if (method.toLowerCase() === "get") {
                requestObj.params = data;
            } else {
                requestObj.data = data;
            }
            if (responseType) {
                requestObj["responseType"] = responseType;
            }
            if (header) {
                requestObj["headers"] = header;
            }
            let response = await axios(requestObj);
            if (response.request.responseType === 'blob'){
                let fileName=response.headers['content-disposition'];
                fileName=fileName.substring(fileName.indexOf("filename=")+9);                
                const newBlob = new Blob([response.data], { type:response.headers.get('content-type')});
                const objUrl = window.URL.createObjectURL(newBlob);
                let link = document.createElement('a');
                link.href = objUrl;
                link.download = fileName;
                link.click();
            }
            return response.data;
        }
    }
}