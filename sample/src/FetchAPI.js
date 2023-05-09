import axios from "axios";
export default class FetchAPI {
    constructor() {
        this.getRoster = async (year, month) => {
            console.log("Get Active Manual List");
            return (await fetch({ year: year, month: month }, "get", "/publicAPI/getRoster"));
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
                fileName = fileName.substring(fileName.indexOf("filename=") + 9);
                const newBlob = new Blob([response.data], {
                    type: response.headers.get("content-type"),
                });
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