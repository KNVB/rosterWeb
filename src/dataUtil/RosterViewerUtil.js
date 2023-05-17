import FetchAPI from "../util/FetchAPI";
import { Utility } from "../util/Utility";
export default class RosterViewerUtil {
    constructor() {
        let fetchAPI = new FetchAPI();
        let roster;
        this.clearAllShiftData=(noOfWorkingDay)=>{
            Object.keys(roster.rosterRow).forEach(itoId => {
                roster.rosterRow[itoId].shiftList = [];
            });
            roster.rosterRow = Utility.genITOStat(roster, noOfWorkingDay);
        }
        this.getItoIdList = () => {
            return Object.keys(roster.rosterRow);
        }
        this.getRoster = () => {
            return roster;
        }
        this.getShiftCssClassName = (shiftType) => {
            try {
                let result = roster.activeShiftList[shiftType].cssClassName;
                return result
            } catch (error) {
                return null
            }
        }
        this.init = async (weekdayNames) => {
            roster = { activeShiftList: await fetchAPI.getActiveShiftList() };
            roster.weekdayNames = weekdayNames;
        }
        this.loadData = async (year, month, noOfWorkingDay) => {
            roster.year = year;
            roster.month = month;
            roster.rosterRow = await fetchAPI.getRoster(year, month);
            roster.rosterRow = Utility.genITOStat(roster, noOfWorkingDay);
        }
        this.setRosterRow = (rosterRow) => {
            roster.rosterRow = JSON.parse(JSON.stringify(rosterRow));
        }
        this.updateShift = (itoId, dateOfMonth, newShift, noOfWorkingDay, monthLength) => {
            let oldShift = roster.rosterRow[itoId].shiftList[dateOfMonth];
            let newRosterShift = newShift.trim();
            switch (true) {
                case ((oldShift === undefined) && (newRosterShift !== '')):
                case ((oldShift !== undefined) && (newRosterShift !== oldShift)):
                    roster.rosterRow[itoId].shiftList[dateOfMonth] = newRosterShift;
                    break;
                default:
                    break;
            }
            roster.rosterRow = Utility.genITOStat(roster, noOfWorkingDay);
        }
    }
}