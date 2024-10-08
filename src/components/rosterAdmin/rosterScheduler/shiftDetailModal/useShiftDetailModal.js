import { useEffect, useReducer } from "react";
import Utility from "../../../../util/Utility";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.date = new Date(action.date.getTime());
            result.errorList = action.errorList;
            result.itoId = action.itoId;
            result.itoName = action.itoName
            result.itoPostName = action.itoPostName
            result.shiftInfoList = structuredClone(action.shiftInfoList);
            break;
        case "setErrorList":
            result.errorList = structuredClone(action.errorList);
            break
        case "updateClaimType":
            result.shiftInfoList[action.index].claimType = action.claimType;
            if (action.claimType === "") {
                result.errorList[action.index + "_claimType"] = "Please select a claim type."
            } else {
                delete result.errorList[action.index + "_claimType"];
            }
            break;
        case "updatDesc":
            result.shiftInfoList[action.index].description = action.desc;
            if (action.desc === "") {
                result.errorList[action.index + "_desc"] = "Please enter the description";
            } else {
                delete result.errorList[action.index + "_desc"];
            }
            break;
        case "updateEndTime":
            result.shiftInfoList[action.index].endTime = new Date(action.value.getTime());
            if (action.value > result.shiftInfoList[action.index].startTime) {
                result.shiftInfoList[action.index].duration = Utility.getDurationInHour(
                    result.shiftInfoList[action.index].startTime,
                    result.shiftInfoList[action.index].endTime
                );
                delete result.errorList[action.index + "_endTime"];
                delete result.errorList[action.index + "_startTime"];
            } else {
                result.errorList[action.index + "_endTime"] = "The end time must be later than the start time.";
            }
            break
        case "updateShiftType":
            result.shiftInfoList[action.index].shiftType = action.shiftType;
            if (action.shiftType === "") {
                result.errorList[action.index + "_shiftType"] = "Please select a shift type."
            } else {
                if (action.shiftType === "t") {
                    result.shiftInfoList[action.index].claimType = "";
                    result.shiftInfoList[action.index].description = "";
                    result.shiftInfoList[action.index].duration = 0;
                    result.shiftInfoList[action.index].endTime = new Date(result.date.getTime());
                    result.shiftInfoList[action.index].status = "";
                    result.shiftInfoList[action.index].startTime = new Date(result.date.getTime());
                } else {
                    delete result.shiftInfoList[action.index].claimType;
                    delete result.shiftInfoList[action.index].description;
                    delete result.shiftInfoList[action.index].duration;
                    delete result.shiftInfoList[action.index].endTime;
                    delete result.shiftInfoList[action.index].status;
                    delete result.shiftInfoList[action.index].startTime;
                }
                delete result.errorList[action.index + "_shiftType"];
            }
            break;
        case "updateStartTime":
            result.shiftInfoList[action.index].startTime = new Date(action.value.getTime());
            if (action.value < result.shiftInfoList[action.index].endTime) {
                result.shiftInfoList[action.index].duration = Utility.getDurationInHour(
                    result.shiftInfoList[action.index].startTime,
                    result.shiftInfoList[action.index].endTime
                );
                delete result.errorList[action.index + "_endTime"];
                delete result.errorList[action.index + "_startTime"];
            } else {
                result.errorList[action.index + "_startTime"] = "The end time must be later than the start time.";
            }
            break
        default:
            break;
    }
    return result;
}
export default function useShiftDetailModal(incomingShiftObj) {
    let [itemList, updateItemList] = useReducer(reducer, {
        date: null,
        errorList: {},
        itoId: "",
        itoName: "",
        itoPostName: "",
        shiftInfoList: []
    });
    useEffect(() => {
        if (incomingShiftObj) {
            updateItemList({
                date: incomingShiftObj.date,
                errorList: {},
                itoId: incomingShiftObj.itoId,
                itoName: incomingShiftObj.itoName,
                itoPostName: incomingShiftObj.itoPostName,
                shiftInfoList: incomingShiftObj.shiftInfoList,
                "type": "init",
            });
        }
    }, [incomingShiftObj]);
    let isShiftDetailValid = () => {
        let result = true;
        let tempErrorList = {};
        itemList.shiftInfoList.forEach((shiftInfo, index) => {
            switch (shiftInfo.shiftType) {
                case "":
                    tempErrorList[index + "_shiftType"] = "Please select a shift type.";
                    result = false;
                    break;
                case "t":
                    if (shiftInfo.claimType === "") {
                        tempErrorList[index + "_claimType"] = "Please select a claim type.";
                        result = false;
                    }
                    if (shiftInfo.description === "") {
                        tempErrorList[index + "_desc"] = "Please enter the description";
                        result = false;
                    }
                    if (shiftInfo.endTime <= shiftInfo.startTime) {
                        tempErrorList[index + "_startTime"] = "The start time must be ealier than the end time.";
                        tempErrorList[index + "_endTime"] = "The end time must be later than the start time.";
                        result = false;
                    }
                    break;
            }
        });
        if (!result) {
            updateItemList({
                errorList: tempErrorList,
                "type": "setErrorList"
            });
        }
        return result;
    }
    let updateClaimType = (index, claimType) => {
        updateItemList({
            claimType,
            index,
            "type": "updateClaimType"
        });
    };
    let updateEndTime = (index, value) => {
        updateItemList({ index, value, "type": "updateEndTime" });
    }
    let updatDesc = (index, desc) => {
        updateItemList({
            desc,
            index,
            "type": "updatDesc"
        });
    }
    let updateShiftType = (index, shiftType) => {
        updateItemList({ "type": "updateShiftType", index, shiftType });
    };
    let updateStartTime = (index, value) => {
        updateItemList({
            index,
            value,
            "type": "updateStartTime"
        });
    }
    return {
        date: itemList.date,
        errorList: itemList.errorList,
        itoId: itemList.itoId,
        itoName: itemList.itoName,
        itoPostName: itemList.itoPostName,
        shiftInfoList: itemList.shiftInfoList,
        action: {
            isShiftDetailValid,
            updateClaimType,
            updateEndTime,
            updatDesc,
            updateShiftType,
            updateStartTime
        }
    }
}