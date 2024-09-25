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
    getShift = (itoId, date) => {
        return this.roster[itoId].shiftList[date] ?? "";
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
            rosterRowIdList: this.rosterRowIdList,
            shiftDetailList: this.shiftDetailList
        });
    }
    paste = (dateOfMonth, rosterRowIdList, selectedLocation) => {
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
                                switch (shiftRowType) {
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
            this.shiftDetailList = backupItem.shiftDetailList;
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
            this.shiftDetailList = backupItem.shiftDetailList;
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
        switch (true) {
            case (newShift === ""):
                this.roster[itoId].shiftList[dateOfMonth] = "";
                if (this.shiftDetailList[itoId].records[dateOfMonth]) {
                    this.shiftDetailList[itoId].total -= this.shiftDetailList[itoId].records[dateOfMonth].duration;
                    delete this.shiftDetailList[itoId].records[dateOfMonth];
                }
                break;
            default:
                let shiftList = newShift.split("+");
                shiftList.forEach(shift => {
                    if (shift === "t") {
                        let temp = new Date(this.rosterMonth.getTime());
                        temp.setDate(dateOfMonth);
                        if (this.shiftDetailList[itoId].records[dateOfMonth] === undefined) {
                            this.shiftDetailList[itoId].records[dateOfMonth] = {
                                claimType: "",
                                description: "",
                                duration: 0,
                                endTime: new Date(temp.getTime()),
                                shiftDetailId: -1,
                                startTime: new Date(temp.getTime()),
                                status: ""
                            }
                        }
                    }
                });
                if ((!shiftList.includes("t")) && (this.shiftDetailList[itoId].records[dateOfMonth])){
                    this.shiftDetailList[itoId].total -= this.shiftDetailList[itoId].records[dateOfMonth].duration;
                    delete this.shiftDetailList[itoId].records[dateOfMonth];
                }
                break;
        }

        this.roster[itoId].shiftList[dateOfMonth] = newShift;
        this.roster = Utility.genITOStat(this.activeShiftList, this.roster, this.noOfWorkingDay, this.shiftDetailList);
        this.#recordRosterSchedulerData();
    }
    updateShiftDetail(shiftDetail){
        let dateOfMonth=shiftDetail.date.getDate();
        let resultantShift=[];
        shiftDetail.shiftList.forEach(shift=>{
            resultantShift.push(shift.shiftType);
            if (shift.shiftType ==="t"){
                this.shiftDetailList[shiftDetail.itoId].records[dateOfMonth]={
                    claimType:shift.claimType,
                    description:shift.description,
                    duration:shift.duration,
                    endTime:new Date(shift.endTime.getTime()),
                    startTime:new Date(shift.startTime.getTime()),
                    shiftDetailId:shift.shiftDetailId,
                    status:shift.status
                }
            }
            //console.log(this.shiftDetailList[shiftDetail.itoId]);
        });
        this.roster[shiftDetail.itoId].shiftList[dateOfMonth] = resultantShift.join("+");
        let total=0;
        Object.values(this.shiftDetailList[shiftDetail.itoId].records).forEach(shift=>{
            total+=shift.duration;
        });
        this.shiftDetailList[shiftDetail.itoId].total=total;
        this.roster = Utility.genITOStat(this.activeShiftList, this.roster, this.noOfWorkingDay, this.shiftDetailList);
        this.#recordRosterSchedulerData();
        //console.log(shiftDetail);
    }
    //=========================================================================================================================================
    #recordRosterSchedulerData() {
        this.#rosterSchedulerDataHistory.set({
            calendarDateList: this.calendarDateList,
            itoIdList: this.itoIdList,
            preferredShiftList: this.preferredShiftList,
            previousMonthShiftList: this.previousMonthShiftList,
            roster: this.roster,
            shiftDetailList: this.shiftDetailList
        });
    }
}