import FetchAPI from "../util/FetchAPI";
export default async function Roster(year, month) {
    let fetchAPI = new FetchAPI();
    return await fetchAPI.getRoster(year, month);
}