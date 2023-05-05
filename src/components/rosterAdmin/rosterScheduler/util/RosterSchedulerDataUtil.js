import AdminShiftStatUtil from './AdminShiftStatUtil';
import FetchAPI from "../../../../util/fetchAPI";
import ITOShiftStatUtil from "../../../../util/ITOShiftStatUtil";
import UndoableData from './UndoableData';
export default class RosterSchedulerDataUtil {
    constructor() {
        let copiedData = null;
        let fetchAPI = new FetchAPI();
        let roster = null;
        let rosterSchedulerData = null;
        let rosterDataHistory = null;
        this.clearAllShiftData = (noOfWorkingDay, monthLength) => {
            Object.keys(roster.rosterRow).forEach(itoId => {
                roster.rosterRow[itoId].shiftList = [];
            });
            updateRosterStatistic(noOfWorkingDay, monthLength); 
        }
        this.clearCopiedData = () => {
            copiedData = null;
        }
        this.copy = copyRegion => {
            let index, itoId, shiftList;
            let temp, result = [], shiftRowType;
            copyRegion.rows.forEach(row => {
                index = row.indexOf("_");
                shiftRowType = row.substring(0, index);
                itoId = row.substring(index + 1);
                temp = [];
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
        this.fillEmptyShiftWithO = (monthLength) => {
            this.getItoIdList().forEach(itoId => {
                for (let i = 1; i <= monthLength; i++) {
                    if ((roster.rosterRow[itoId].shiftList[i] === undefined) || (roster.rosterRow[itoId].shiftList[i] === '')) {
                        roster.rosterRow[itoId].shiftList[i] = 'O';
                    }
                }
            });
        }
        this.getActiveShiftList = () => {
            return roster.activeShiftList;
        }
        this.getCopyDataRowCount = () => {
            if (copiedData === null) {
                return -1;
            } else {
                return copiedData.length;
            }
        }
        this.getItoIdList = () => {
            return Object.keys(roster.rosterRow);
        }
        this.getRoster = () => {
            return roster;
        }
        this.getRosterSchedulerData = () => {
            return rosterSchedulerData;
        }
        this.getShiftCssClassName = (shiftType) => {
            try {
                let result = roster.activeShiftList[shiftType].cssClassName;
                return result
            } catch (error) {
                return null
            }
        }
        this.init = async (year, month, noOfWorkingDay, monthLength, weekdayNames) => {
            roster = { activeShiftList: await fetchAPI.getActiveShiftList() };
            roster.weekdayNames = weekdayNames;
            await this.loadData(year, month, noOfWorkingDay, monthLength);
        }
        this.isDuplicateShift = (itoId, dateOfMonth) => {
            return rosterSchedulerData.duplicateShiftList[itoId].includes(dateOfMonth);
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
        this.loadData = async (year, month, noOfWorkingDay, monthLength) => {
            let itoBlackListShiftPattern = await fetchAPI.getITOBlackListShiftPattern(year, month);
            let preferredShiftList = await fetchAPI.getPreferredShiftList(year, month);
            let previousMonthShiftList = await fetchAPI.getPreviousMonthShiftList(year, month);

            roster.rosterRow = await fetchAPI.getRoster(year, month);
            rosterSchedulerData = { blackListShiftList: {}, blackListShiftPattern: {}, preferredShiftList: {}, previousMonthShiftList: {} };
            //console.log(previousMonthShiftList);
            this.getItoIdList().forEach(itoId => {
                rosterSchedulerData.blackListShiftPattern[itoId] = itoBlackListShiftPattern[itoId];
                rosterSchedulerData.blackListShiftList[itoId] = {};
            });
            previousMonthShiftList.forEach(previousMonthShift => {
                if (rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id] === undefined) {
                    rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id] = [];
                }
                rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id].push(previousMonthShift.shift);
            })
            preferredShiftList.forEach(preferredShift => {
                if (rosterSchedulerData.preferredShiftList[preferredShift.ito_id] === undefined) {
                    rosterSchedulerData.preferredShiftList[preferredShift.ito_id] = {};
                }
                rosterSchedulerData.preferredShiftList[preferredShift.ito_id][preferredShift.d] = preferredShift.preferred_shift;
            });
            updateRosterStatistic(noOfWorkingDay, monthLength);
            backupRosterData();
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
            if (rosterDataHistory.canRedo()) {
                let backupItem = rosterDataHistory.redo();
                roster.rosterRow = backupItem.rosterRow;
                rosterSchedulerData = backupItem.rosterSchedulerData;
            }
        }
        this.unDo = () => {
            if (rosterDataHistory.canUndo()) {
                let backupItem = rosterDataHistory.undo();
                roster.rosterRow = backupItem.rosterRow;
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
            let oldShift = roster.rosterRow[itoId].shiftList[dateOfMonth];
            let newRosterShift = newShift.trim();
            switch (true) {
                case ((oldShift === undefined) && (newRosterShift !== '')):
                case ((oldShift !== undefined) && (newRosterShift !== oldShift)):
                    roster.rosterRow[itoId].shiftList[dateOfMonth] = newRosterShift;
                    updateRosterStatistic(noOfWorkingDay, monthLength);
                    backupRosterData();
                    break;
                default:
                    break;
            }
        }
        //====================================================================================================================================================
        let backupRosterData = () => {
            console.log("backup Roster Data");
            let temp = {
                rosterRow: roster.rosterRow,
                rosterSchedulerData: rosterSchedulerData
            }
            //console.log(temp);
            if (rosterDataHistory === null) {
                rosterDataHistory = new UndoableData(temp);
            } else {
                rosterDataHistory.set(temp);
            }
        }
        let updateRosterStatistic = (noOfWorkingDay, monthLength) => {
            let { getITOStat } = ITOShiftStatUtil();
            let itoIdList = this.getItoIdList();
            for (let i = 0; i < itoIdList.length; i++) {
                let rosterInfo = getITOStat(roster.activeShiftList, noOfWorkingDay, roster.rosterRow[[itoIdList[i]]]);
                roster.rosterRow[[itoIdList[i]]] = rosterInfo;
            }
            let { getAllITOStat } = AdminShiftStatUtil();
            console.log(rosterSchedulerData.blackListShiftPattern);
            let temp = getAllITOStat(roster.activeShiftList, 1, monthLength, roster.rosterRow, rosterSchedulerData.blackListShiftPattern);
            //console.log(temp, roster.rosterRow);
            rosterSchedulerData.duplicateShiftList = temp.duplicateShiftList;
            rosterSchedulerData.vacantShiftList = temp.vacantShiftList;
        }
    }
}