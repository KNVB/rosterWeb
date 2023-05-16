import { Utility } from "../../util/Utility";
import FetchAPI from "../../util/FetchAPI";
import RosterDataUtil from "./RosterDataUtill";
export default class RosterSchedulerUtil{
    constructor() {
        let fetchAPI = new FetchAPI();
        let rosterDataUtil=new RosterDataUtil();
        let rosterSchedulerData=null;
        this.getItoIdList = () => {
            return rosterDataUtil.getItoIdList();
        }
        this.getRoster = () => {
            return rosterDataUtil.getRoster();
        }
        this.getRosterSchedulerData = () => {
            return rosterSchedulerData;
        }
        this.init = async (weekdayNames) => {
            await rosterDataUtil.init(weekdayNames);
        }
        this.loadData = async (year, month, monthLength, noOfWorkingDay) => {
            let temp=await fetchAPI.getRosterSchedulerData(year,month);
            await rosterDataUtil.loadData(year, month, noOfWorkingDay);
            rosterSchedulerData = { blackListShiftList: {}, blackListShiftPattern: {}, preferredShiftList: {}, previousMonthShiftList: {},yearlyRosterStatistic:temp.yearlyRosterStatistic };
            this.getItoIdList().forEach(itoId => {
                rosterSchedulerData.blackListShiftPattern[itoId] = temp.itoBlackListShiftPattern[itoId];
                rosterSchedulerData.blackListShiftList[itoId] = {};
            });
            temp.previousMonthShiftList.forEach(previousMonthShift => {
                if (rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id] === undefined) {
                    rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id] = [];
                }
                rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id].push(previousMonthShift.shift);
            })
            temp.preferredShiftList.forEach(preferredShift => {
                if (rosterSchedulerData.preferredShiftList[preferredShift.ito_id] === undefined) {
                    rosterSchedulerData.preferredShiftList[preferredShift.ito_id] = {};
                }
                rosterSchedulerData.preferredShiftList[preferredShift.ito_id][preferredShift.d] = preferredShift.preferred_shift;
            });
            temp=null;
            temp=Utility.getAllITOStat(rosterDataUtil.getRoster().activeShiftList, 1, monthLength, rosterDataUtil.getRoster().rosterRow) 
            rosterSchedulerData.duplicateShiftList = temp.duplicateShiftList;
            rosterSchedulerData.vacantShiftList = temp.vacantShiftList;
        }
    }
}