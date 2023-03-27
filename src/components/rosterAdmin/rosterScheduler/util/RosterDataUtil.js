import AdminShiftStatUtil from './AdminShiftStatUtil';
import FetchAPI from "../../../../util/fetchAPI";
import ITOShiftStatUtil from "../../../../util/ITOShiftStatUtil";
import UndoableData from './UndoableData';
export default class RosterDataUtil {
    constructor() {
        let activeShiftList = null;
        let copiedData = null;
        let duplicateShiftList = null;
        let fetchAPI = new FetchAPI();
        let rosterDataHistory = null;
        let rosterList = null;
        let vacantShiftList = null;
        this.copy = copyRegion => {
            let index, itoId, shiftList;
            let temp, result = [], shiftRowType;
            copyRegion.rows.forEach(row => {
                index = row.indexOf("_");
                shiftRowType = row.substring(0, index);
                itoId = row.substring(index + 1);
                temp = [];
                if (shiftRowType === "rosterRow") {
                    shiftList = { ...rosterList[itoId].shiftList };
                }
                if (shiftRowType === "preferredShiftRow") {
                    shiftList = { ...rosterList[itoId].preferredShiftList };
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
        this.getCopyDataRowCount = () => {
            if (copiedData === null) {
                return -1;
            } else {
                return copiedData.length;
            }
        }
        this.getShiftCssClassName = shiftType => {
            try {
                let result = activeShiftList[shiftType].cssClassName;
                return result
            } catch (error) {
                return ''
            }
        }
        this.getItoIdList = () => {
            return Object.keys(rosterList);
        }
        this.getRosterList = itoId => {
            return rosterList[itoId];
        }
        this.getVacantShiftList = () => {
            return vacantShiftList;
        }
        this.init = async (year, month, noOfWorkingDay, monthLength) => {
            activeShiftList = await fetchAPI.getActiveShiftList();
            await this.loadData(year, month, noOfWorkingDay, monthLength);
        }
        this.isDuplicateShift = (itoId, dateOfMonth) => {
            return duplicateShiftList[itoId].includes(dateOfMonth);
        }
        this.loadData = async (year, month, noOfWorkingDay, monthLength) => {
            let preferredShiftList = await fetchAPI.getPreferredShiftList(year, month);
            let previousMonthShiftList = await fetchAPI.getPreviousMonthShiftList(year, month);
            rosterList = await fetchAPI.getRosterList(year, month);
            let itoIdList = Object.keys(rosterList);
            itoIdList.forEach((itoId, i) => {
                if (rosterList[itoId].previousMonthShiftList === undefined) {
                    rosterList[itoId].previousMonthShiftList = [];
                }
                if (rosterList[itoId].preferredShiftList === undefined) {
                    rosterList[itoId].preferredShiftList = {};
                }
            });
            previousMonthShiftList.forEach(previousMonthShift => {
                rosterList[previousMonthShift.ito_id].previousMonthShiftList.push(previousMonthShift.shift);
            });
            preferredShiftList.forEach(preferredShift => {
                rosterList[preferredShift.ito_id].preferredShiftList[preferredShift.d] = preferredShift.preferred_shift;
            });
            updateRosterStatistic(rosterList, noOfWorkingDay, monthLength);
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
                            rosterList[itoId].preferredShiftList[x] = copiedDataRow[x - dateOfMonth];
                            backupRosterData();
                        }
                    } else {
                        break;
                    }
                }
            })
        }
        this.reDo = () => {
            if (rosterDataHistory.canRedo()){
                let backupItem = rosterDataHistory.redo();
                duplicateShiftList = backupItem.duplicateShiftList;
                rosterList = backupItem.rosterList;
                vacantShiftList = backupItem.vacantShiftList;
            }
        }
        this.unDo = () => {
            if (rosterDataHistory.canUndo()) {
                let backupItem = rosterDataHistory.undo();                
                duplicateShiftList = backupItem.duplicateShiftList;
                rosterList = backupItem.rosterList;
                vacantShiftList = backupItem.vacantShiftList;
            }
        }
        this.updatePreferredShift = (itoId, dateOfMonth, newShift) => {            
            let oldPreferredShift=rosterList[itoId].preferredShiftList[dateOfMonth];
            let newPreferredShift=newShift.trim();
            switch (true) {
                case ((oldPreferredShift === undefined) && (newPreferredShift !== '')):
                case ((oldPreferredShift !== undefined) && (newPreferredShift !== oldPreferredShift)):
                    rosterList[itoId].preferredShiftList[dateOfMonth] = newPreferredShift;                    
                    backupRosterData();
                    break;
                default:
                    break;
            }
        }
        this.updateShift = (itoId, dateOfMonth, newShift, noOfWorkingDay, monthLength) => {
            let oldShift = rosterList[itoId].shiftList[dateOfMonth];
            let newRosterShift = newShift.trim();
            switch (true) {
                case ((oldShift === undefined) && (newRosterShift !== '')):
                case ((oldShift !== undefined) && (newRosterShift !== oldShift)):
                    rosterList[itoId].shiftList[dateOfMonth] = newRosterShift;
                    updateRosterStatistic(rosterList, noOfWorkingDay, monthLength);
                    backupRosterData();
                    break;
                default:
                    break;
            }
        }
        //==================================================================================================
        let backupRosterData = () => {
            console.log("backup Roster Data");
            let temp={
                "duplicateShiftList": duplicateShiftList,
                "rosterList": rosterList,
                "vacantShiftList": vacantShiftList
            };
            if (rosterDataHistory === null) {
                rosterDataHistory = new UndoableData(temp);
            } else {
                rosterDataHistory.set(temp);
            }
        }
        let updateRosterStatistic = (rosterList, noOfWorkingDay, monthLength) => {
            let { getITOStat } = ITOShiftStatUtil();
            let itoIdList = this.getItoIdList();
            itoIdList.forEach(itoId => {
                let rosterInfo = getITOStat(activeShiftList, noOfWorkingDay, rosterList[itoId]);
                rosterList[itoId] = rosterInfo;
            });
            let { getAllITOStat } = AdminShiftStatUtil();
            let temp = getAllITOStat(activeShiftList, 1, monthLength, rosterList);
            duplicateShiftList = temp.duplicateShiftList
            vacantShiftList = temp.vacantShiftList;
        }
    }
}