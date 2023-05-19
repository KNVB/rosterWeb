import axios from "axios";
export default class FetchAPI {
    constructor() {
        this.addITO =async ito=>{
            return (await fetch(ito, "post", "/rosterWeb/privateAPI/addITOToDB"));
        }
        this.exportRosterDataToExcel = async genExcelData => {
            return (await fetch(genExcelData, "post", "/rosterWeb/privateAPI/exportRosterDataToExcel", "blob"));
        }
        this.getActiveShiftList = async () => {
            return (await fetch(null, "get", "/rosterWeb/publicAPI/getActiveShiftList"));
        }
        /*        
        this.getITOBlackListShiftPattern = async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/privateAPI/getITOBlackListShiftPattern"));
        }
        this.getPreferredShiftList = async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/privateAPI/getPreferredShiftList"));
        }
        this.getPreviousMonthShiftList = async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/privateAPI/getPreviousMonthShiftList"));
        }
        */
        this.getITOList = async () => {
            return (await fetch(null, "get", "/rosterWeb/privateAPI/getITOList"));
        }
        this.getRoster = async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/publicAPI/getRoster"));
        }
        this.getRosterSchedulerData = async (year,month)=>{
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/privateAPI/getRosterSchedulerData"));
        }
        this.getSystemParam = async () => {
            return (await fetch(null, "get", "/rosterWeb/publicAPI/getSystemParam"));
        }
        this.getYearlyRosterStatistic= async (year, month) => {
            return (await fetch({ year: year, month: month }, "get", "/rosterWeb/privateAPI/getYearlyRosterStatistic"));
        }
        this.saveRosterToDB = async rosterData => {
            return (await fetch(rosterData, "post", "/rosterWeb/privateAPI/saveRosterToDB"));
        }
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
                console.log(error.toJSON());
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

        const fetch = async (data, method, url, responseType, headers) => {
            const requestObj = {
                url,
                method,
                responseType,
                headers,
                [method.toLowerCase() === "get" ? "params" : "data"]: data,
            };
            const response = await api(requestObj); // use the created instance
            if (response.request.responseType === "blob") {
                let fileName = response.headers["content-disposition"];
                console.log(fileName);
                let firstIndex = fileName.indexOf("filename=");
                fileName = fileName.substring(firstIndex + 9);

                const newBlob = new Blob([response.data]);
                const objUrl = window.URL.createObjectURL(newBlob);
                const link = document.createElement("a");
                link.href = objUrl;
                link.download = fileName;
                link.click();
            }
            return response.data;
        };
    }
}