import axios from "axios";
export default class FetchAPI {
    #api;
    constructor() {
        //================================================================================================================
        // create and configure an axios instance
        // src:https://stackoverflow.com/questions/76116501/axios-response-interceptor-strange-behavior?noredirect=1#comment134237075_76116501
        this.#api = axios.create({
            baseURL: process.env.REACT_APP_SOCKET_URL,
        });
        // add the response interceptor
        this.#api.interceptors.response.use(
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
    }
    addITO = async ito => {
        return (await this.#secureFetch({ "ito": ito }, "post", "/privateAPI/addITO"));
    }
    getActiveShiftList = async () => {
        return (await this.#fetch(null, "get", "/publicAPI/getActiveShiftList"));
    }
    getITOList = async () => {
        return (await this.#secureFetch(null, "get", "/privateAPI/getITOList"));
    }
    getRosterViewerData = async (year, month) => {
        return (await this.#fetch({ year: year, month: month }, "get", "/publicAPI/getRosterViewerData"));
    }
    getRosterSchedulerData = async (year, month) => {
        return (await  this.#secureFetch({ year: year, month: month }, "get", "/privateAPI/getRosterSchedulerData"));
    }
    getSystemParam = async () => {
        return (await this.#fetch(null, "get", "/publicAPI/getSystemParam"));
    }
    login = async loginObj => {
        return await this.#fetch({ loginObj: loginObj }, "post", "/publicAPI/login");
    }
    logout = async () => {
        return await this.#secureFetch(null, "get", "/privateAPI/logout");
    }
    updateITO = async ito => {
        return (await this.#secureFetch({ "ito": ito }, "post", "/privateAPI/updateITO"));
    }
    //================================================================================================================================
    #fetch = async (data, method, url, responseType, headers) => {
        const requestObj = {
            url,
            method,
            responseType,
            headers,
            [method.toLowerCase() === "get" ? "params" : "data"]: data,
        };
        console.log(requestObj);
        const response = await this.#api(requestObj);
        return response.data;
    }
    #secureFetch = async (data, method, url, responseType) => {
        return await this.#fetch(data, method, url, responseType, { "access-token": sessionStorage.getItem("accessToken") });
    }
}