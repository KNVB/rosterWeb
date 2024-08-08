import FetchAPI from "../util/FetchAPI";
export default async function SystemParam() {
    let fetchAPI = new FetchAPI();
    return await fetchAPI.getSystemParam();
}