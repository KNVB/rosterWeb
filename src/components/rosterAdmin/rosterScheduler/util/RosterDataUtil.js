import createStack from 'undo-stacker';
import AdminShiftStatUtil from './AdminShiftStatUtil';
import FetchAPI from "../../../../util/fetchAPI";
import ITOShiftStatUtil from "../../../../util/ITOShiftStatUtil";
export default class RosterDataUtil {
    constructor() {
        let activeShiftList = null;
        let copiedData=null;
        let duplicateShiftList = null;
        let fetchAPI = new FetchAPI();
        let rosterDataHistory = createStack();
        let rosterList = null;
        let vacantShiftList = null;
        this.copy = copyRegion => {
            let index, itoId,shiftList;
            let temp,result = [], shiftRowType;
            copyRegion.rows.forEach(row => {
                index = row.indexOf("_");
                shiftRowType = row.substring(0, index);
                itoId = row.substring(index + 1);
                temp = [];
                if (shiftRowType === "rosterRow") {
                    shiftList={...rosterList[itoId].shiftList};
                }
                if (shiftRowType === "preferredShiftRow") {
                    shiftList={...rosterList[itoId].preferredShiftList};
                }
                
                for (let i=copyRegion.column.start;i<=copyRegion.column.end;i++ ){
                    if (shiftList[i] === undefined){
                        temp.push('')
                    }else{
                        temp.push(shiftList[i] )
                    }
                }
                result.push(temp);
            });
            copiedData=result;
        }
        this.getCopyDataDimension=()=>{
            if (copiedData===null){
                return null;
            }else {
                return {height:copiedData.length,width:copiedData[0].length};
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
        this.init = async (year, month, noOfWorkingDay, monthLength) => {
            activeShiftList = await fetchAPI.getActiveShiftList();
            await this.loadData(year, month, noOfWorkingDay, monthLength);
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
        this.getItoIdList = () => {
            return Object.keys(rosterList);
        }
        this.getRosterList = itoId => {
            return rosterList[itoId];
        }
        this.reDo = () => {

        }
        this.unDo = () => {

        }
        this.updatePreferredShift = (itoId, dateOfMonth, newShift) => {

        }
        this.updateShift = (itoId, dateOfMonth, newShift, noOfWorkingDay, monthLength) => {
            let oldShift = rosterList[itoId].shiftList[dateOfMonth];
            let newRosterShift = newShift.trim();
            switch (true) {
                case ((oldShift === undefined) && (newRosterShift !== '')):
                case ((oldShift !== undefined) && (newRosterShift !== oldShift)):
                    rosterList[itoId].shiftList[dateOfMonth] = newShift;
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
            rosterDataHistory.push({
                duplicateShiftList: duplicateShiftList,
                rosterList: rosterList,
                vacantShiftList: vacantShiftList
            });
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