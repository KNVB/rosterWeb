import axios from "axios";
export default class FetchAPI {
    constructor() {
        this.exportRosterDataToExcel = async(genExcelData) =>{
            return (await fetch({ genExcelData:genExcelData}, "post", "/rosterWeb/privateAPI/exportRosterDataToExcel"));
        }
        this.getActiveShiftList = async () => {
            return (await fetch(null, "get", "/rosterWeb/publicAPI/getActiveShiftList"));
        }
        this.getITOBlackListShiftPattern = async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/privateAPI/getITOBlackListShiftPattern"));
        }
        this.getPreferredShiftList = async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/privateAPI/getPreferredShiftList"));
        }
        this.getPreviousMonthShiftList = async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/privateAPI/getPreviousMonthShiftList"));
        }
        this.getRoster = async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/publicAPI/getRoster"));
        }
        this.getSystemParam = async () => {
            return (await fetch(null, "get", "/rosterWeb/publicAPI/getSystemParam"));
        }
        //================================================================================================================
        let fetch = async (data, method, url, responseType, headers) => {
            //================================================================================================================
            // create and configure an axios instance
            // src:https://stackoverflow.com/questions/76116501/axios-response-interceptor-strange-behavior?noredirect=1#comment134237075_76116501
            const api = axios.create({
                baseURL: process.env.REACT_APP_SOCKET_URL,
            });
            // add the response interceptor
            api.interceptors.response.use(
                null, // default success handler
                (error) => {
                    console.warn(error.toJSON());
                    return Promise.reject({
                        status: error.response?.status,
                        message:
                            error.response?.data ?? error.response?.statusText ?? error.message,
                    });
                },
                {
                    synchronous: true, // optimise interceptor handling
                }
            );
            const requestObj = {
                url,
                method,
                responseType,
                headers,
                [method.toLowerCase() === "get" ? "params" : "data"]: data,
            };
            let response = await api(requestObj);
            if (response.request.responseType === 'blob') {
                let fileName = response.headers['content-disposition'];
                fileName = fileName.substring(fileName.indexOf("filename=") + 9);
                const newBlob = new Blob([response.data], { type: response.headers.get('content-type') });
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