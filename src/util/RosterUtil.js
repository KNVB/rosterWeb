import FetchAPI from "./fetchAPI";
import ITOShiftStatUtil from './ITOShiftStatUtil';

export default class RosterUtil {
    constructor() {
        let fetchAPI = new FetchAPI();
        this.getPreferredShiftList = async (year, month) => {
            return await fetchAPI.getPreferredShiftList(year, month);
        }
        this.getPreviousMonthShiftList = async (year, month) => {
            return await fetchAPI.getPreviousMonthShiftList(year, month);
        }
        this.getRosterListForScheduler = async (activeShiftList, noOfWorkingDay, year, month) => {
            let preferredShiftList = await fetchAPI.getPreferredShiftList(year, month);
            let previousMonthShiftList = await fetchAPI.getPreviousMonthShiftList(year, month);
            let rosterList = await getRosterListForViewer(activeShiftList, noOfWorkingDay, year, month);
            let itoIdList=Object.keys(rosterList); 
            itoIdList.forEach(itoId=>{
                rosterList[itoId].previousMonthShiftList=[];
                rosterList[itoId].preferredShiftList={};
            });
            previousMonthShiftList.forEach(previousMonthShift=>{
                rosterList[previousMonthShift.ito_id].previousMonthShiftList.push(previousMonthShift.shift);
            });
            preferredShiftList.forEach(preferredShift => {
                rosterList[preferredShift.ito_id].preferredShiftList[preferredShift.d] = preferredShift.preferred_shift;
            })
            return rosterList;
        }
        this.getRosterListForViewer = async (activeShiftList, noOfWorkingDay, year, month) => {
            return await getRosterListForViewer(activeShiftList, noOfWorkingDay, year, month);
        }
        //==============================================================================================================================================================================
        let getRosterListForViewer = async (activeShiftList, noOfWorkingDay, year, month) => {
            let results = await fetchAPI.getRosterList(year, month);
            let { getITOStat } = ITOShiftStatUtil();
            let itoIdList = Object.keys(results);
            itoIdList.forEach((itoId, i) => {
                let rosterInfo = getITOStat(activeShiftList, noOfWorkingDay, results[itoId]);
                results[itoId] = rosterInfo;
            })
            return results;
        }
        /*
        this.getRosterViewerData = (year, month) => {
            return fetchAPI.getRosterViewerData(year, month);
        }
        this.getRosterSchedulerData = (year, month) => {
            return fetchAPI.getRosterSchedulerData(year, month);
        }
        */
    }
}