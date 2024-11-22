import { useEffect, useReducer } from "react";
import AutoPlanner from "../../../../dataUtil/AutoPlanner";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.autoPlanner.setRosterSchedulerData(action.rosterSchedulerData);
            result.iterationCount = 1;
            result.isReady = true;
            break;
        case "updateEndDate":
            result.autoPlanner.endDate = parseInt(action.value);
            break;
        case "updateIterationCount":
            result.iterationCount = action.value;
            break;
        case "updateStartDate":
            result.autoPlanner.startDate = parseInt(action.value);
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useAutoPlanForm(rosterSchedulerData, dataAction) {
    const [itemList, updateItemList] = useReducer(reducer, {
        isReady: false,
        autoPlanner: new AutoPlanner(1, rosterSchedulerData.calendarDateList.length),
        iterationCount: 1,
    });
    useEffect(() => {
        updateItemList({
            rosterSchedulerData,
            "type": "init"
        });
    }, [rosterSchedulerData, dataAction]);
    let autoPlan = () => {
        dataAction.showLoading();
        dataAction.updateShiftFromAutoPlan(itemList.autoPlanner.start());
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
        autoPlanResult: itemList.autoPlanner.planResult,
        startDate: itemList.autoPlanner.startDate,
        endDate: itemList.autoPlanner.endDate,
        isReady: itemList.isReady,
        iterationCount: itemList.iterationCount,
        action: {
            autoPlan,
            updateEndDate,
            updateIterationCount,
            updateStartDate
        }
    }
}