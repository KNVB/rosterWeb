import { useEffect, useReducer } from "react";
import Utility from "../../../../util/Utility";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.endDate = action.endDate;
            result.essentialShift = action.essentialShift;
            result.itoIdList = action.itoIdList;
            result.preferredShiftList = action.preferredShiftList;
            result.previousMonthShiftList = action.previousMonthShiftList;
            result.roster = action.roster;
            result.systemParam = action.systemParam;
            break;
        case "updateEndDate":
            result.endDate = action.value;
            break;
        case "updateIterationCount":
            result.iterationCount = action.value;
            break;
        case "updateStartDate":
            result.startDate = action.value;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useAutoPlanner(rosterSchedulerData, dataAction) {
    const [itemList, updateItemList] = useReducer(reducer, {
        endDate: 0,
        essentialShift: null,
        itoIdList:[],
        iterationCount: 1,
        preferredShiftList: null,
        previousMonthShiftList: null,
        roster: null,
        startDate: 1,
        systemParam:null,
    });
    useEffect(() => {
        updateItemList({
            endDate: structuredClone(rosterSchedulerData.calendarDateList.length),
            essentialShift: structuredClone(rosterSchedulerData.essentialShift),
            itoIdList: structuredClone(rosterSchedulerData.itoIdList),
            preferredShiftList: structuredClone(rosterSchedulerData.preferredShiftList),
            previousMonthShiftList: structuredClone(rosterSchedulerData.previousMonthShiftList),
            roster: structuredClone(rosterSchedulerData.roster),
            systemParam: structuredClone(rosterSchedulerData.systemParam),
            type: "init"
        });
    }, [rosterSchedulerData]);
    let autoPlan = () => { 
        Utility.autoPlan(itemList);
    }
    let updateEndDate = e => {
        updateItemList({
            "type": "updateEndDate",
            "value": e.target.value
        });
    }
    let updateIterationCount = e => {
        updateItemList({
            "type": "updateIterationCount",
            "value": e.target.value
        });
    }
    let updateStartDate = e => {
        updateItemList({
            "type": "updateStartDate",
            "value": e.target.value
        });
    }
    return {
        startDate: itemList.startDate,
        endDate: itemList.endDate,
        iterationCount: itemList.iterationCount,
        action: {
            autoPlan,
            updateEndDate,
            updateIterationCount,
            updateStartDate
        }
    }
}