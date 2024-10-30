import { useEffect, useReducer } from "react";
import AutoPlanner from "./AutoPlanner";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.autoPlanner.endDate = action.endDate;
            result.autoPlanner.iterationCount = 1;
            result.autoPlanner.startDate = 1;
            result.autoPlanner.setRosterSchedulerData(action.rosterSchedulerData);
            break;
        case "updateEndDate":
            result.autoPlanner.endDate = action.value;
            break;
        case "updateIterationCount":
            result.autoPlanner.iterationCount = action.value;
            break;
        case "updateStartDate":
            result.autoPlanner.startDate = action.value;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useAutoPlanForm(rosterSchedulerData, dataAction) {
    const [itemList, updateItemList] = useReducer(reducer, {
        autoPlanner: new AutoPlanner(),
        dataAction: dataAction,
        iterationCount: 1,        
    });
    useEffect(() => {
        updateItemList({
            endDate: structuredClone(rosterSchedulerData.calendarDateList.length),
            rosterSchedulerData,
            type: "init"
        });
    }, []);
    let autoPlan = () => {
        dataAction.showLoading();
        itemList.autoPlanner.start();
        dataAction.hideLoading();
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
        autoPlanResult:itemList.autoPlanner.planResult,
        startDate: itemList.autoPlanner.startDate,
        endDate: itemList.autoPlanner.endDate,
        iterationCount: itemList.autoPlanner.iterationCount,
        action: {
            autoPlan,
            updateEndDate,
            updateIterationCount,
            updateStartDate
        }
    }
}