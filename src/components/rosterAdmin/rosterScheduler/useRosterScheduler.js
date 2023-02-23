import { useEffect, useReducer } from 'react';
import AdminShiftStatUtil from "./util/AdminShiftStatUtil";
import ITOShiftStatUtil from '../../../util/ITOShiftStatUtil';
import CalendarUtility from '../../../util/calendar/CalendarUtility';
import RosterUtil from '../../../util/RosterUtil';
import ShiftUtil from '../../../util/ShiftUtil';
import SystemUtil from '../../../util/SystemUtil';
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.allITOStat = action.allITOStat;
            result.activeShiftList = action.activeShiftList;
            result.isLoading = false;
            result.monthlyCalendar = action.monthlyCalendar;
            result.rosterList = action.rosterList;
            result.systemParam = action.systemParam;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateHighLightCellIndex":
            result.highLightCellIndex = action.value;
            break;
        case 'updateRosterMonth':
            result.allITOStat = action.allITOStat;
            result.monthlyCalendar = action.monthlyCalendar;
            result.rosterList = action.rosterList;
            result.rosterMonth = action.newRosterMonth;
            break
        case "updatePreferredShiftList":
            result.rosterList[action.itoId].preferredShiftList[action.date]=action.newShift;
            break;
        case "updateShift":
            result.allITOStat = action.allITOStat;
            result.rosterList = action.rosterList;
            break;
        default:
            break;
    }
    return result;
}
export function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        "calendarUtility": new CalendarUtility(),
        error: null,
        highLightCellIndex: -1,
        isLoading: true,
        rosterMonth: new Date()
    });
    let updateHighLightCellIndex = cellIndex => {
        updateItemList({ type: "updateHighLightCellIndex", value: cellIndex });
    }
    let updatePreferredShift = (itoId, date, newShift) => {
        updateItemList({
            date,
            itoId,
            newShift,
            type:"updatePreferredShiftList"
        });
    }
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
    useEffect(() => {
        let rosterUtil = new RosterUtil();
        let shiftUtil = new ShiftUtil();
        let systemUtil = new SystemUtil();
        let getData = async () => {
            try {
                let { getAllITOStat } = AdminShiftStatUtil();
                let activeShiftList = await shiftUtil.getActiveShiftList();
                let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(itemList.rosterMonth.getFullYear(), itemList.rosterMonth.getMonth());
                let systemParam = await systemUtil.getSystemParam();
                systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);

                let rosterList = await rosterUtil.getRosterListForScheduler(
                    activeShiftList,
                    monthlyCalendar.noOfWorkingDay,
                    itemList.rosterMonth.getFullYear(),
                    itemList.rosterMonth.getMonth() + 1,
                );

                let allITOStat = getAllITOStat(activeShiftList, 1, monthlyCalendar.calendarDateList.length, rosterList);
                updateItemList({
                    allITOStat,
                    activeShiftList,
                    monthlyCalendar,
                    rosterList,
                    systemParam,
                    type: "init"
                });
            } catch (error) {
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, [])
    return [
        itemList,
        updateHighLightCellIndex,
        updatePreferredShift,
        updateRosterMonth,
        updateShift
    ]
}