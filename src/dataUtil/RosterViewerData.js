import FetchAPI from "../util/FetchAPI";
export default async function RosterViewerData(year, month) {
    let fetchAPI = new FetchAPI();
    return await fetchAPI.getRosterViewerData(year, month);
}