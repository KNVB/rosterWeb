import { useEffect, useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.endDate = action.endDate;
            result.essentialShift = action.essentialShift;
            result.preferredShiftList = action.preferredShiftList;
            result.previousMonthShiftList = action.previousMonthShiftList;
            result.roster = action.roster;
            break;
        case "updateEndDate":
            result.endDate = action.value;
            break;
        case "updateIterationCount":
            result.iterationCount=action.value;
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
        preferredShiftList: null,
        previousMonthShiftList: null,
        roster: null,
        startDate: 1,
        iterationCount: 1,
    });
    useEffect(() => {
        updateItemList({
            endDate: structuredClone(rosterSchedulerData.calendarDateList.length),
            essentialShift: structuredClone(rosterSchedulerData.essentialShift),
            preferredShiftList: structuredClone(rosterSchedulerData.preferredShiftList),
            previousMonthShiftList: structuredClone(rosterSchedulerData.previousMonthShiftList),
            roster: structuredClone(rosterSchedulerData.roster),
            type: "init"
        });
    }, []);
    let updateEndDate = e => {
        updateItemList({
            "type": "updateEndDate",
            "value": e.target.value
        });
    }
    let updateIterationCount =e=>{
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
            updateEndDate,
            updateIterationCount,
            updateStartDate
        }
    }
}