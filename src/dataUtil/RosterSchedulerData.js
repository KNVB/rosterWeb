import FetchAPI from "../util/FetchAPI";
export default async function RosterSchedulerData(year, month) {
    let fetchAPI = new FetchAPI();
    return await fetchAPI.getRosterSchedulerData(year, month);
}