import { useEffect, useReducer } from 'react';
import AdminShiftStatUtil from "./AdminShiftStatUtil";
import CalendarUtility from '../../../util/calendar/CalendarUtility';
import ITOShiftStatUtil from '../../../../util/ITOShiftStatUtil';
import RosterUtil from '../../../../util/RosterUtil';
import SelectedRegion from "./SelectedRegion";
import ShiftUtil from '../../../../util/ShiftUtil';
import SystemUtil from '../../../../util/SystemUtil';
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.allITOStat = action.allITOStat;
            result.activeShiftList = action.activeShiftList;
            result.calendarUtility = action.calendarUtility;
            result.isLoading = false;
            result.monthlyCalendar = action.monthlyCalendar;
            result.rosterList = action.rosterList;
            result.rosterMonth = action.rosterMonth;
            result.selectedRegion = action.selectedRegion;
            result.systemParam = action.systemParam;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateFocus":
            result.focusCellIndex = action.cellIndex;
            result.focusRowItoId = action.rowIndex;
            break;
        case "updatePreferredShiftList":
            result.rosterList[action.itoId].preferredShiftList[action.date] = action.newShift;
            break;
        case 'updateRosterMonth':
            result.allITOStat = action.allITOStat;
            result.monthlyCalendar = action.monthlyCalendar;
            result.rosterList = action.rosterList;
            result.rosterMonth = action.newRosterMonth;
            break;
        case "updateShift":
            result.allITOStat = action.allITOStat;
            result.rosterList = action.rosterList;
            break;
        case "updateUI":
            result.highLightCellIndex = action.cellIndex;
            result.highLightRowIndex = action.rowIndex;
            break;
        default:
            break;
    }
    return result;
}
export function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        allITOStat: null,
        activeShiftList: null,
        calendarUtility: null,
        error: null,
        focusCellIndex: -1,
        focusRowItoId: "",
        highLightCellIndex: -1,
        highLightRowIndex: "",
        isLoading: true,
        monthlyCalendar: null,
        rosterList: null,
        rosterMonth: null,
        selectedRegion: null,
        systemParam: null
    });
    let endSelect = () => {
        itemList.selectedRegion.endSelect();
    }
    let isFocusCell = (date, itoId) => {
        let cellIndex = date + itemList.systemParam.noOfPrevDate;
        let rowIndex = "rosterRow_" + itoId;

        return ((cellIndex === itemList.focusCellIndex) &&
            (rowIndex === itemList.focusRowItoId))

    }
    let getHighLightCellIndex = () => {
        return itemList.highLightCellIndex;
    }
    let getHighLightRowIndex = () => {
        return itemList.highLightRowIndex;
    }
    let startSelect = (cellIndex, itoId) => {
        updateItemList({ cellIndex: cellIndex, rowIndex: "rosterRow_"+itoId, type: "startSelect" });
    }
    let updateFocus = (cellIndex, itoId) => {
        updateItemList({ cellIndex: cellIndex, rowIndex: "rosterRow_"+itoId, type: "updateFocus" });
    }
    let updatePreferredShift = (itoId, date, newShift) => {
        updateItemList({
            date,
            itoId,
            newShift,
            type: "updatePreferredShiftList"
        });
    }
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterUtil = new RosterUtil();
        let { getAllITOStat } = AdminShiftStatUtil();
        try {
            let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(newRosterMonth.getFullYear(), newRosterMonth.getMonth());
            let rosterList = await rosterUtil.getRosterListForScheduler(
                itemList.activeShiftList,
                monthlyCalendar.noOfWorkingDay,
                newRosterMonth.getFullYear(),
                newRosterMonth.getMonth() + 1,
            );
            let allITOStat = getAllITOStat(itemList.activeShiftList, 1, monthlyCalendar.calendarDateList.length, rosterList);
            updateItemList({
                allITOStat,
                monthlyCalendar,
                newRosterMonth,
                rosterList,
                type: 'updateRosterMonth'
            });
        } catch (error) {
            updateItemList({ "error": error, "type": "setError" });
        }
    };
    let updateShift = (itoId, date, shift) => {
        //console.log(itoId, date, shift);
        let { getAllITOStat } = AdminShiftStatUtil();
        let { getITOStat } = ITOShiftStatUtil();
        let temp = { ...itemList.rosterList };
        temp[itoId].shiftList[date] = shift;
        let itoIdList = Object.keys(temp);
        itoIdList.forEach(itoId => {
            let rosterInfo = getITOStat(itemList.activeShiftList, itemList.monthlyCalendar.noOfWorkingDay, temp[itoId]);
            temp[itoId] = rosterInfo;
        })
        let allITOStat = getAllITOStat(itemList.activeShiftList, 1, itemList.monthlyCalendar.calendarDateList.length, temp);
        updateItemList({
            allITOStat,
            "rosterList": temp,
            type: "updateShift"
        });
    }

    let updateUI = (cellIndex, itoId) => {
        updateItemList({ cellIndex: cellIndex, rowIndex: "rosterRow_"+itoId, type: "updateUI" });
    }
    useEffect(() => {
        let rosterUtil = new RosterUtil();
        let shiftUtil = new ShiftUtil();
        let systemUtil = new SystemUtil();
        let getData = async () => {
            try {
                let { getAllITOStat } = AdminShiftStatUtil();
                let activeShiftList = await shiftUtil.getActiveShiftList();
                let calendarUtility = new CalendarUtility();
                let rosterMonth = new Date();
                let selectedRegion = new SelectedRegion();
                let monthlyCalendar = calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(), rosterMonth.getMonth());
                let systemParam = await systemUtil.getSystemParam();
                systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);

                let rosterList = await rosterUtil.getRosterListForScheduler(
                    activeShiftList,
                    monthlyCalendar.noOfWorkingDay,
                    rosterMonth.getFullYear(),
                    rosterMonth.getMonth() + 1,
                );

                let allITOStat = getAllITOStat(activeShiftList, 1, monthlyCalendar.calendarDateList.length, rosterList);
                updateItemList({
                    allITOStat,
                    activeShiftList,
                    calendarUtility,
                    monthlyCalendar,
                    rosterList,
                    rosterMonth,
                    selectedRegion,
                    systemParam,
                    type: "init"
                });
            } catch (error) {
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    return [
        itemList.error,
        itemList.isLoading,
        {
            allITOStat: itemList.allITOStat,
            activeShiftList: itemList.activeShiftList,
            calendarUtility: itemList.calendarUtility,
            monthlyCalendar: itemList.monthlyCalendar,
            rosterList: itemList.rosterList,
            rosterMonth: itemList.rosterMonth,
            systemParam: itemList.systemParam
        },
        {
            updatePreferredShift,
            updateRosterMonth,
            updateShift
        },
        {
            endSelect,
            getHighLightCellIndex,
            getHighLightRowIndex,
            isFocusCell,
            startSelect,
            updateFocus,
            updateUI
        }]
}