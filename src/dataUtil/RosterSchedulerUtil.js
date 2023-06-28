import RosterViewerUtil from "./RosterViewerUtil";
import FetchAPI from "../util/FetchAPI";
import { Utility } from "../util/Utility";
import UndoableData from "./UndoableData";
export default class RosterSchedulerUtil {
    constructor() {
        let copiedData = null;
        let fetchAPI = new FetchAPI();
        let rosterDataHistory = null;
        let rosterRowIdList = [];
        let rosterSchedulerData = null;
        let rosterViewerUtil = new RosterViewerUtil();
        this.clearAllShiftData = (noOfWorkingDay, monthLength) => {
            rosterViewerUtil.clearAllShiftData(noOfWorkingDay);
            updateRosterStatistic(1, monthLength);
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
        this.exportRosterDataToExcel = async (calendarDateList) => {
            let genExcelData = JSON.parse(JSON.stringify(this.getRoster()));
            genExcelData.calendarDateList = JSON.parse(JSON.stringify(calendarDateList));
            genExcelData.vacantShiftList = JSON.parse(JSON.stringify(rosterSchedulerData.vacantShiftList));
            //console.log(genExcelData);
            await fetchAPI.exportRosterDataToExcel({ "genExcelData": genExcelData });
        }
        this.fillEmptyShiftWithO = (monthLength, noOfWorkingDay) => {
            rosterViewerUtil.fillEmptyShiftWithO(monthLength, noOfWorkingDay);
        }
        this.getActiveShiftList = () => {
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
            rosterRowIdList = [];
            this.getItoIdList().forEach(itoId => {
                rosterSchedulerData.blackListShiftPattern[itoId] = temp.itoBlackListShiftPattern[itoId];
                rosterRowIdList.push("rosterRow_" + itoId);
                rosterRowIdList.push("preferredShiftRow_" + itoId);
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
        this.paste = (dateOfMonth, noOfWorkingDay, monthLength, selectedLocation) => {
            let copiedDataRow, copyX = copiedData[0].length, copyY = copiedData.length;
            let endRowNo, endX, endY, firstRowNo, index, itoId, itoIdList, rosterTable, rowId;
            let startX, startY, shiftRowType;

            console.log("selectedLocation=" + JSON.stringify(selectedLocation));
            console.log("copiedData=" + JSON.stringify(copiedData));
            //console.log("rosterRowIdList=" + JSON.stringify(rosterRowIdList));

            firstRowNo = rosterRowIdList.indexOf(selectedLocation.rows[0]);
            endRowNo = rosterRowIdList.length - 1;

            let selectX = selectedLocation.column.end - selectedLocation.column.start + 1;
            let selectY = selectedLocation.rows.length;

            let horizontalCopyTime = Math.floor(selectX / copyX);
            let verticalCopyTime = Math.floor(selectY / copyY);

            if (horizontalCopyTime === 0) {
                horizontalCopyTime = 1;
            }
            if (verticalCopyTime === 0) {
                verticalCopyTime = 1;
            }
            for (let v = 0; v < verticalCopyTime; v++) {
                startY = firstRowNo + (v * copyY);
                endY = startY + copyY;
                //console.log("startY="+startY+",endY="+endY);
                for (let y = startY; y < endY; y++) {
                    if (y <= endRowNo) {
                        rowId = rosterRowIdList[y];
                        index = rowId.indexOf("_");
                        shiftRowType = rowId.substring(0, index);
                        itoId = rowId.substring(index + 1);
                        copiedDataRow = copiedData[y - firstRowNo - (v * copyY)];
                        //console.log(`rowId=${rowId},shiftRowType=${shiftRowType},itoId=${itoId},copiedDataRow=${copiedDataRow}`);
                        for (let h = 0; h < horizontalCopyTime; h++) {
                            startX = dateOfMonth + (h * copyX);
                            endX = startX + copiedDataRow.length;
                            for (let x = startX; x < endX; x++) {
                                if (x <= monthLength) {
                                    //console.log(shiftRowType);
                                    if (shiftRowType === "rosterRow") {
                                        this.updateShift(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)], noOfWorkingDay, monthLength);
                                    }
                                    if (shiftRowType === "preferredShiftRow") {
                                        this.updatePreferredShift(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)]);
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        /*
        this.paste = (dateOfMonth, noOfWorkingDay, monthLength, selectedLocation) => {
            let copiedDataRow, copyX = copiedData[0].length, copyY = copiedData.length;
            let endRowNo, endX, endY, firstRowNo, index, itoId, itoIdList, rosterTable, rowId;
            let startX, startY, shiftRowType;
            /*
            console.log("selectedLocation=" + JSON.stringify(selectedLocation));
            console.log("copiedData=" + JSON.stringify(copiedData));
            
            itoIdList = this.getItoIdList();
            firstRowNo = document.getElementById(selectedLocation.rows[0]).rowIndex;
            endRowNo = document.getElementById("preferredShiftRow_" + itoIdList[itoIdList.length - 1]).rowIndex;
            rosterTable = document.getElementsByClassName("rosterTable")[0];
            
            console.log("firstRowNo=" + firstRowNo);
            console.log("endRowNo=" + endRowNo);
            console.log("itoIdList=" + itoIdList);
            console.log("last ito ID=" + itoIdList[itoIdList.length - 1]);
            
            let selectX = selectedLocation.column.end - selectedLocation.column.start + 1;
            let selectY = selectedLocation.rows.length;

            let horizontalCopyTime = Math.floor(selectX / copyX);
            let verticalCopyTime = Math.floor(selectY / copyY);

            if (horizontalCopyTime === 0) {
                horizontalCopyTime = 1;
            }
            if (verticalCopyTime === 0) {
                verticalCopyTime = 1;
            }

            for (let v = 0; v < verticalCopyTime; v++) {
                startY = firstRowNo + (v * copyY);
                endY = startY + copyY;
                for (let y = startY; y < endY; y++) {
                    if (y <= endRowNo) {
                        rowId = rosterTable.rows[y].id;
                        index = rowId.indexOf("_");
                        shiftRowType = rowId.substring(0, index);
                        itoId = rowId.substring(index + 1);
                        copiedDataRow = copiedData[y - firstRowNo - (v * copyY)];
                        for (let h = 0; h < horizontalCopyTime; h++) {
                            startX = dateOfMonth + (h * copyX);
                            endX = startX + copiedDataRow.length;
                            for (let x = startX; x < endX; x++) {
                                if (x <= monthLength) {
                                    //console.log(shiftRowType);
                                    if (shiftRowType === "rosterRow") {
                                        this.updateShift(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)], noOfWorkingDay, monthLength);
                                    }
                                    if (shiftRowType === "preferredShiftRow") {
                                        this.updatePreferredShift(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)]);
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
        }*/
        this.reDo = () => {
            console.log("redo");
            if (rosterDataHistory.canRedo()) {
                let backupItem = rosterDataHistory.redo();
                rosterViewerUtil.setRosterRow(backupItem.rosterRow);
                rosterSchedulerData = backupItem.rosterSchedulerData;
            }
        }
        this.saveRosterToDB = async () => {
            let roster = this.getRoster();
            await fetchAPI.saveRosterToDB(
                {
                    rosterData:
                    {
                        rosterRow: roster.rosterRow,
                        preferredShiftList: rosterSchedulerData.preferredShiftList,
                        month: roster.month,
                        year: roster.year
                    }
                });
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