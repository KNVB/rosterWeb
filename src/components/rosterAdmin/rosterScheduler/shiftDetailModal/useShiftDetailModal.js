import { useEffect, useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            let roster = action.rosterSchedulerData.roster[action.selectedITOId];
            let selectedDate = new Date(action.rosterSchedulerData.rosterMonth.getTime());
            let selectedShiftDetail = action.rosterSchedulerData.timeOffList[action.selectedITOId].records[action.selectedShiftDetailDate];
            let shiftType = roster.shiftList[action.selectedShiftDetailDate];
            selectedDate.setDate(action.selectedShiftDetailDate);
            result.itoName = roster.itoName;
            result.itoPostName = roster.itoPostName;
            result.rosterSchedulerData = action.rosterSchedulerData;
            result.selectedShiftDetailDate = action.selectedShiftDetailDate;
            result.selectedDate = selectedDate;
            result.selectedITOId = action.selectedITOId;
            result.shiftType = shiftType;
            result.selectedShiftDetail = selectedShiftDetail;
            if (result.rosterSchedulerData.activeShiftList[shiftType]) {
                result.timeSlot = result.rosterSchedulerData.activeShiftList[shiftType].timeSlot
            } else {
                result.timeSlot = "";
            }
            break
        case "reset":
            console.log("reset");
            let oldRoster = structuredClone[result.rosterSchedulerData.roster[result.selectedITOId]];
            let oldShiftDetail = structuredClone[result.rosterSchedulerData.timeOffList[action.selectedITOId].records[action.selectedShiftDetailDate]];
            result.shiftType = oldRoster.shiftList[result.selectedShiftDetailDate];
            result.selectedShiftDetailDate = oldShiftDetail;
            break;
        case "updateEndTime":
            result.selectedShiftDetail.timeOffAmount = action.amount;
            result.selectedShiftDetail.timeOffEnd = action.value;
            break;
        case "updateShiftDetail":
            result.selectedShiftDetail.description = action.value;
            break;
        case "updateStartTime":
            result.selectedShiftDetail.timeOffStart = action.value;
            break;
        default:
            break;
    }
    return result;
}
export default function useShiftDetailModal(rosterSchedulerData, selectedITOId, selectedShiftDetailDate) {
    //console.log(rosterSchedulerData, selectedITOId, selectedShiftDetailDate);
    const [itemList, updateItemList] = useReducer(reducer, {
        itoName: "",
        itoPostName: "",
        rosterSchedulerData: null,
        selectedDate: null,
        selectedITOId: null,
        selectedShiftDetail: null,
        selectedShiftDetailDate: null,
        shiftType: undefined,
        timeSlot: ""
    });
    useEffect(() => {
        updateItemList({
            rosterSchedulerData,
            selectedITOId,
            selectedShiftDetailDate,
            "type": "init"
        });
    }, []);
    let reset = () => {
        updateItemList({ "type": "reset" });
    }
    let updateEndTime = newValue => {
        let amount = (newValue - itemList.selectedShiftDetail.timeOffStart) / 1000 / 60 / 60;
        updateItemList({ amount, "type": "updateEndTime", value: newValue });
    }
    let updateShiftDetail = newValue => {
        updateItemList({ "type": "updateShiftDetail", value: newValue });
    }
    let updateStartTime = newValue => {
        let amount = (itemList.selectedShiftDetail.timeOffEnd - newValue) / 1000 / 60 / 60;
        updateItemList({ amount, "type": "updateStartTime", value: newValue });
    }
    return {
        selectedDate: itemList.selectedDate,
        selectedShiftDetail: itemList.selectedShiftDetail,
        shiftType: itemList.shiftType,
        itoName: itemList.itoName,
        itoPostName: itemList.itoPostName,
        timeSlot: itemList.timeSlot,
        "uiAction": {
            reset,
            updateEndTime,
            updateShiftDetail,
            updateStartTime,
        }
    }
}