import RosterViewerUtil from "./RosterViewerUtil";
import FetchAPI from "../util/FetchAPI";
import { Utility } from "../util/Utility";
import UndoableData from "./UndoableData";
export default class RosterSchedulerUtil {
    constructor() {
        let copiedData = null;
        let fetchAPI = new FetchAPI();
        let rosterDataHistory = null;
        let rosterSchedulerData = null;
        let rosterViewerUtil = new RosterViewerUtil();
        this.clearAllShiftData = (noOfWorkingDay, monthLength) => {
            rosterViewerUtil.clearAllShiftData(noOfWorkingDay);
            updateRosterStatistic(1, monthLength);
        }
        this.copy = copyRegion => {
            let index, itoId, shiftList;
            let temp, result = [], shiftRowType;
            copyRegion.rows.forEach(row => {
                index = row.indexOf("_");
                shiftRowType = row.substring(0, index);
                itoId = row.substring(index + 1);
                temp = [];
                let roster = this.getRoster();
                if (shiftRowType === "rosterRow") {
                    shiftList = { ...roster.rosterRow[itoId].shiftList };
                }
                if (shiftRowType === "preferredShiftRow") {
                    shiftList = { ...rosterSchedulerData.preferredShiftList[itoId] };
                }

                for (let i = copyRegion.column.start; i <= copyRegion.column.end; i++) {
                    if (shiftList[i] === undefined) {
                        temp.push('')
                    } else {
                        temp.push(shiftList[i])
                    }
                }
                result.push(temp);
            });
            copiedData = result;
        }
        this.deleteSelectedData = (selectedLocation, noOfWorkingDay, monthLength) => {
            let index, itoId, shiftRowType;
            selectedLocation.rows.forEach(rowId => {
                index = rowId.indexOf("_");
                shiftRowType = rowId.substring(0, index);
                itoId = rowId.substring(index + 1);
                for (let x = selectedLocation.column.start; x <= selectedLocation.column.end; x++) {
                    console.log(rowId, x)
                    if (x <= monthLength) {
                        if (shiftRowType === "rosterRow") {
                            this.updateShift(itoId, x, '', noOfWorkingDay, monthLength);
                        }
                        if (shiftRowType === "preferredShiftRow") {
                            this.updatePreferredShift(itoId, x, '');
                        }
                    } else {
                        break;
                    }
                }
            });
        }
        this.fillEmptyShiftWithO = (monthLength, noOfWorkingDay) => {
            rosterViewerUtil.fillEmptyShiftWithO(monthLength, noOfWorkingDay);
        }
        this.getActiveShiftList =()=>{
            return rosterViewerUtil.getRoster().activeShiftList;
        }
        this.getCopyDataRowCount = () => {
            if (copiedData === null) {
                return -1;
            } else {
                return copiedData.length;
            }
        }
        this.getItoIdList = () => {
            return rosterViewerUtil.getItoIdList();
        }
        this.getRoster = () => {
            return rosterViewerUtil.getRoster();
        }
        this.getRosterSchedulerData = () => {
            return rosterSchedulerData;
        }
        this.getShiftCssClassName = shift => {
            return rosterViewerUtil.getShiftCssClassName(shift);
        }
        this.init = async (weekdayNames) => {
            await rosterViewerUtil.init(weekdayNames);
        }
        this.isDuplicateShift = (itoId, dateOfMonth) => {
            return rosterSchedulerData.duplicateShiftList[itoId].includes(dateOfMonth);
        }
        this.loadData = async (year, month, noOfWorkingDay, monthLength) => {
            await rosterViewerUtil.loadData(year, month, noOfWorkingDay);
            let temp = await fetchAPI.getRosterSchedulerData(year, month);
            rosterSchedulerData = { blackListShiftPattern: {}, preferredShiftList: {}, previousMonthShiftList: {} };
            rosterSchedulerData.yearlyRosterStatistic = temp.yearlyRosterStatistic;
            rosterDataHistory = null;
            this.getItoIdList().forEach(itoId => {
                rosterSchedulerData.blackListShiftPattern[itoId] = temp.itoBlackListShiftPattern[itoId];
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

            updateRosterStatistic(1, monthLength);
            backupRosterData();
        }
        this.loadAutoPlanResult = (autoPlanResult, noOfWorkingDay, monthLength) => {
            //console.log(autoPlanResult);
            let itoIdList = this.getItoIdList(), shiftList;
            for (let i = 0; i < itoIdList.length; i++) {
                shiftList = autoPlanResult.rosterRow[itoIdList[i]].shiftList;
                for (let [dateOfMonth, shiftType] of Object.entries(shiftList)) {
                    //console.log(itoIdList[i],dateOfMonth,shiftType);
                    this.updateShift(itoIdList[i], dateOfMonth, shiftType, noOfWorkingDay, monthLength);
                }
            }
        }
        this.paste = (dateOfMonth, rowIds, noOfWorkingDay, monthLength) => {
            let index, itoId;
            let copiedDataRow, shiftRowType;
            rowIds.forEach((rowId, rowIndex) => {
                index = rowId.indexOf("_");
                shiftRowType = rowId.substring(0, index);
                itoId = rowId.substring(index + 1);
                copiedDataRow = copiedData[rowIndex];
                for (let x = dateOfMonth; x < dateOfMonth + copiedDataRow.length; x++) {
                    if (x <= monthLength) {
                        if (shiftRowType === "rosterRow") {
                            this.updateShift(itoId, x, copiedDataRow[x - dateOfMonth], noOfWorkingDay, monthLength);
                        }
                        if (shiftRowType === "preferredShiftRow") {
                            this.updatePreferredShift(itoId, x, copiedDataRow[x - dateOfMonth]);
                        }
                    } else {
                        break;
                    }
                }
            });
        }
        this.reDo = () => {
            console.log("redo");
            if (rosterDataHistory.canRedo()) {
                let backupItem = rosterDataHistory.redo();
                rosterViewerUtil.setRosterRow(backupItem.rosterRow);
                rosterSchedulerData = backupItem.rosterSchedulerData;
            }
        }
        this.updatePreferredShift = (itoId, dateOfMonth, newShift) => {
            let oldPreferredShift;
            try {
                oldPreferredShift = rosterSchedulerData.preferredShiftList[itoId][dateOfMonth];
            } catch (error) {
                oldPreferredShift = '';
            }

            let newPreferredShift = newShift.trim();
            switch (true) {
                case ((oldPreferredShift === undefined) && (newPreferredShift !== '')):
                case ((oldPreferredShift !== undefined) && (newPreferredShift !== oldPreferredShift)):
                    if (rosterSchedulerData.preferredShiftList[itoId] === undefined) {
                        rosterSchedulerData.preferredShiftList[itoId] = {};
                    }
                    rosterSchedulerData.preferredShiftList[itoId][dateOfMonth] = newPreferredShift;
                    backupRosterData();
                    break;
                default:
                    break;
            }
        }
        this.updateShift = (itoId, dateOfMonth, newShift, noOfWorkingDay, monthLength) => {
            rosterViewerUtil.updateShift(itoId, dateOfMonth, newShift, noOfWorkingDay, monthLength);
            updateRosterStatistic(1, monthLength);
            backupRosterData();
        }
        this.unDo = () => {
            console.log("undo");
            if (rosterDataHistory.canUndo()) {
                let backupItem = rosterDataHistory.undo();
                rosterViewerUtil.setRosterRow(backupItem.rosterRow);
                rosterSchedulerData = backupItem.rosterSchedulerData;
            }
        }
        //=========================================================================================================================================
        let backupRosterData = () => {
            let roster = rosterViewerUtil.getRoster();
            console.log("backup Roster Data");
            let temp = {
                rosterRow: roster.rosterRow,
                rosterSchedulerData: rosterSchedulerData,
            }
            //console.log(temp);
            if (rosterDataHistory === null) {
                rosterDataHistory = new UndoableData(temp);
            } else {
                rosterDataHistory.set(temp);
            }
        }
        let updateRosterStatistic = (startDate, endDate) => {
            let roster = rosterViewerUtil.getRoster();
            let temp = Utility.getAllITOStat(roster.activeShiftList, startDate, endDate, roster.rosterRow);
            rosterSchedulerData.duplicateShiftList = temp.duplicateShiftList;
            rosterSchedulerData.vacantShiftList = temp.vacantShiftList;
        }
    }
}