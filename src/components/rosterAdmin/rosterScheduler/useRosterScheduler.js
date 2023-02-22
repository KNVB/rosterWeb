import { useEffect, useReducer } from 'react';
import AdminShiftStatUtil from './util/AdminShiftStatUtil.js';
import CalendarUtility from '../../../util/calendar/CalendarUtility.js';
import ITOShiftStatUtil from '../../../util/ITOShiftStatUtil';
import RosterUtil from '../../../util/RosterUtil.js';
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            //console.log(action.data.systemParam);
            result.isLoading = false;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateHighLightCellIndex":
            result.highLightCellIndex = action.value;
            break;
        case 'updateRosterMonth':
            break
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
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterUtil = new RosterUtil();
            
        try {
            let data = await rosterUtil.getRosterSchedulerData(newRosterMonth.getFullYear(), newRosterMonth.getMonth() + 1);            
            updateItemList({ "data": data, newRosterMonth: newRosterMonth, type: 'updateRosterMonth' });
        } catch (error) {
            updateItemList({ "error": error, "type": "setError" });
        }
    };
    useEffect(() => {
        let rosterUtil = new RosterUtil();
        let {getAllITOStat}=AdminShiftStatUtil();
        let {getITOStat}=ITOShiftStatUtil();
        let getData = async () => {
            try {
                let data = await rosterUtil.getRosterSchedulerData(itemList.rosterMonth.getFullYear(), itemList.rosterMonth.getMonth() + 1);
                
                updateItemList({ data: data, type: "init" });
            } catch (error) {
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, [])
    return [
        itemList,
        updateHighLightCellIndex,
        updateRosterMonth
    ]
}