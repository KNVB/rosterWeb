import { useEffect, useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    //console.log(action);
    switch (action.type) {
        case "init":
            result.claimType = action.value.claimType;
            result.date = action.value.date;
            result.description = action.value.description;
            result.duration = action.value.duration;
            result.endTime = action.value.endTime;
            result.itoId = action.value.itoId;
            result.itoName = action.value.itoName;
            result.itoPostName = action.value.itoPostName;
            result.shiftDetailId = action.value.shiftDetailId;
            result.shiftType = action.value.shiftType;
            result.status = action.value.status;
            result.startTime = action.value.startTime;
            break;
        case "updateClaimType":
            result.ClaimType = action.value;
            break;
        case "updateDesc":
            result.description = action.value;
            break;
        case "updateEndTime":
            result.endTime = action.value;
            result.duration = (action.value - result.startTime) / 1000 / 60 / 60;
            break;
        case "updateShiftType":
            result.shiftType = action.value;
            break;
        case "updateStartTime":
            result.startTime = action.value;
            result.duration = (result.endTime - action.value) / 1000 / 60 / 60;
            break;
        default:
            break;
    }
    return result;
}
export default function useShiftDetailModal(inShiftDetail) {
    const [itemList, updateShiftDetail] = useReducer(reducer, {
        claimType: "",
        date: null,
        description: "",
        duration: 0,
        endTime: null,
        itoId: "",
        itoName: "",
        itoPostName: "",
        shiftDetailId: "",
        shiftType: "",
        status: "",
        startTime: null,
    });

    useEffect(() => {
        if (inShiftDetail) {
            //console.log(inShiftDetail);
            updateShiftDetail({ "type": "init", "value": inShiftDetail });
        }
    }, [inShiftDetail]);
    let updateClaimType = newClaimType => {
        updateShiftDetail({ "type": "updateClaimType", "value": newClaimType });
    }
    let updatDesc = newDesc => {
        updateShiftDetail({ "type": "updateDesc", "value": newDesc });
    }
    let updateEndTime = newEndTime => {
        updateShiftDetail({ "type": "updateEndTime", "value": newEndTime });
    }
    let updateShiftType = newShiftType => {
        updateShiftDetail({ "type": "updateShiftType", "value": newShiftType });
    }
    let updateStartTime = newStartTime => {
        updateShiftDetail({ "type": "updateStartTime", "value": newStartTime });
    }
    return {
        claimType: itemList.claimType,
        date: itemList.date,
        description: itemList.description,
        duration: itemList.duration,
        endTime: itemList.endTime,
        itoId: itemList.itoId,
        itoName: itemList.itoName,
        itoPostName: itemList.itoPostName,
        shiftDetailId: itemList.shiftDetailId,
        shiftType: itemList.shiftType,
        status: itemList.status,
        startTime: itemList.startTime,
        shiftDetailMethod: {
            updateClaimType,
            updateEndTime,
            updatDesc,
            updateShiftType,
            updateStartTime
        }
    }
}