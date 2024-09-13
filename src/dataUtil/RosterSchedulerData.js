import FetchAPI from "../util/FetchAPI";
import Utility from "../util/Utility";
import UndoableData from "../util/UndoableData";
import RosterViewerData from "./RosterViewerData";
export default class RosterSchedulerData extends RosterViewerData {
    #copiedData = null;
    #rosterSchedulerDataHistory;
    copy = copyRegion => {
        let index, itoId, shiftList;
        let temp, result = [], shiftRowType;
        copyRegion.rows.forEach(row => {
            index = row.indexOf("_");
            shiftRowType = row.substring(0, index);
            itoId = row.substring(index + 1);
            temp = [];
            if (shiftRowType === "rosterRow") {
                shiftList = { ...this.roster[itoId].shiftList };
            }
            if (shiftRowType === "preferredShiftRow") {
                shiftList = { ...this.preferredShiftList[itoId] };
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
        this.#copiedData = result;
    }
    clearCopiedData = () => {
        this.#copiedData = null;
    }
    deleteSelectedData(selectedLocation, noOfWorkingDay, monthLength) {
        let index, itoId, shiftRowType;
        selectedLocation.rows.forEach(rowId => {
            index = rowId.indexOf("_");
            shiftRowType = rowId.substring(0, index);
            itoId = rowId.substring(index + 1);
            for (let x = selectedLocation.column.start; x <= selectedLocation.column.end; x++) {
                console.log(rowId, x)
                if (x <= monthLength) {
                    switch (shiftRowType) {
                        case "rosterRow":
                            this.updateShift(itoId, x, '', noOfWorkingDay, monthLength);
                            break;
                        case "preferredShiftRow":
                            this.updatePreferredShift(itoId, x, '');
                            break;
                        default:
                            break;
                    }
                } else {
                    break;
                }
            }
        });
    }
    getCopyDataRowCount = () => {
        if (this.#copiedData === null) {
            return -1;
        } else {
            return this.#copiedData.length;
        }
    }
    async load(year, month) {
        await super.load(year, month);
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(year, month + 1);
        this.#rosterSchedulerDataHistory = null;
        this.essentialShift = temp.essentialShift;
        this.itoIdList = Object.keys(this.roster);
       
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);
        this.systemParam = structuredClone(temp.systemParam);
        this.systemParam.monthPickerMinDate = new Date(this.systemParam.monthPickerMinDate);
        

        this.#rosterSchedulerDataHistory = new UndoableData({
            calendarDateList: this.calendarDateList,
            itoIdList: this.itoIdList,
            preferredShiftList: this.preferredShiftList,
            previousMonthShiftList: this.previousMonthShiftList,
            roster: this.roster,
            rosterRowIdList:this.rosterRowIdList,
            timeOffList: this.timeOffList
        });
    }
    paste = (dateOfMonth, rosterRowIdList,selectedLocation) => {
        let copiedDataRow, copyX = this.#copiedData[0].length, copyY = this.#copiedData.length;
        let endRowNo, endX, endY, firstRowNo, index, itoId, rowId;
        let startX, startY, shiftRowType;

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
                    copiedDataRow = this.#copiedData[y - firstRowNo - (v * copyY)];
                    //console.log(`rowId=${rowId},shiftRowType=${shiftRowType},itoId=${itoId},copiedDataRow=${copiedDataRow}`);
                    for (let h = 0; h < horizontalCopyTime; h++) {
                        startX = dateOfMonth + (h * copyX);
                        endX = startX + copiedDataRow.length;
                        for (let x = startX; x < endX; x++) {
                            if (x <= this.calendarDateList.length) {
                                //console.log(shiftRowType);
                                switch (shiftRowType){
                                    case "rosterRow":
                                        this.updateShift(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)], this.noOfWorkingDay, this.calendarDateList.length);
                                        break
                                    case "preferredShiftRow":
                                        this.updatePreferredShift(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)]);
                                        break;
                                    default:
                                        break;        
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
    reDo = () => {
        console.log("redo");
        if (this.#rosterSchedulerDataHistory.canRedo()) {
            let backupItem = this.#rosterSchedulerDataHistory.redo();
            this.calendarDateList = backupItem.calendarDateList;
            this.itoIdList = backupItem.itoIdList
            this.rosterRowIdList = backupItem.rosterRowIdList;
            this.preferredShiftList = backupItem.preferredShiftList
            this.previousMonthShiftList = backupItem.previousMonthShiftList
            this.roster = backupItem.roster;
        }
    }
    async reload(newRosterMonth) {
        await super.reload(newRosterMonth);
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(rosterYear, rosterMonth + 1);
        this.itoIdList = Object.keys(this.roster);
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);        
        this.#recordRosterSchedulerData();
    }
    unDo = () => {
        console.log("undo");
        if (this.#rosterSchedulerDataHistory.canUndo()) {
            let backupItem = this.#rosterSchedulerDataHistory.undo();
            this.calendarDateList = backupItem.calendarDateList;
            this.itoIdList = backupItem.itoIdList
            this.rosterRowIdList = backupItem.rosterRowIdList;
            this.preferredShiftList = backupItem.preferredShiftList
            this.previousMonthShiftList = backupItem.previousMonthShiftList
            this.roster = backupItem.roster;
        }
    }
    updatePreferredShift(itoId, dateOfMonth, newShift) {
        let oldPreferredShift = '';
        try {
            oldPreferredShift = this.preferredShiftList[itoId][dateOfMonth];
        } catch (error) {
            if (this.preferredShiftList[itoId] === undefined) {
                this.preferredShiftList[itoId] = {};
            }
        } finally {
            let newPreferredShift = newShift.trim();
            if (newPreferredShift !== oldPreferredShift) {
                this.preferredShiftList[itoId][dateOfMonth] = newPreferredShift;
                this.#recordRosterSchedulerData();
            }
        }
    }
    updateShift(itoId, dateOfMonth, newShift) {
        let result=null;
        let oldShift = this.roster[itoId].shiftList[dateOfMonth];
        let newRosterShift = newShift.trim();
        switch (true) {
            case ((oldShift === undefined) && (newRosterShift !== '')):
            case ((oldShift !== undefined) && (newRosterShift !== oldShift)):
                if (newRosterShift ==="t"){
                    let shiftDetailDate=new Date(this.rosterMonth.getTime());
                    shiftDetailDate.setDate(dateOfMonth);
                    result={                        
                        itoId, 
                        itoName: this.roster[itoId].itoName,
                        itoPostName: this.roster[itoId].itoPostName,
                        description: "",
                        shiftDetailDate,
                        shiftType:"t",
                        timeOffAmount: 0,
                        timeOffEnd: new Date(),
                        timeOffStart: new Date(),
                    };
                }else {
                    this.roster[itoId].shiftList[dateOfMonth] = newRosterShift;
                    this.roster= Utility.genITOStat(this.activeShiftList, this.roster, this.noOfWorkingDay,this.timeOffList);
                    this.#recordRosterSchedulerData();
                }
                break;
            default:
                break;
        }
        return result;
    }

    //=========================================================================================================================================
    #recordRosterSchedulerData() {
        this.#rosterSchedulerDataHistory.set({
            calendarDateList: this.calendarDateList,
            itoIdList: this.itoIdList,
            preferredShiftList: this.preferredShiftList,
            previousMonthShiftList: this.previousMonthShiftList,
            roster: this.roster,
            timeOffList: this.timeOffList
        });
    }
}