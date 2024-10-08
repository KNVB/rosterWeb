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
            result.shiftDetailList = structuredClone(action.shiftDetailList);
            break;
        case "setErrorList":
            result.errorList = structuredClone(action.errorList);
            break
        case "updateClaimType":
            result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].claimType = action.claimType;
            if (action.claimType === "") {
                result.errorList[action.index + "_" + action.detailIndex + "_claimType"] = "Please select a claim type."
            } else {
                delete result.errorList[action.index + "_" + action.detailIndex + "_claimType"];
            }
            break
        case "updatDesc":
            result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].description = action.desc;
            if (action.desc === "") {
                result.errorList[action.index + "_" + action.detailIndex + "_desc"] = "Please enter the description";
            } else {
                delete result.errorList[action.index + "_" + action.detailIndex + "_desc"];
            }
            break
        case "updateEndTime":
            result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].endTime = new Date(action.value.getTime());
            if (action.value > result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].startTime) {
                result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].duration = Utility.getDurationInHour(
                    result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].startTime,
                    result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].endTime
                );
                delete result.errorList[action.index + "_" + action.detailIndex + "_endTime"];
            } else {
                result.errorList[action.index + "_" + action.detailIndex + "_endTime"] = "The end time must be later than the start time.";
            }
            break;
        case "updateShiftType":
            result.shiftDetailList[action.index].shiftType = action.shiftType;
            if (result.shiftDetailList[action.index].shiftDetailList === undefined) {
                result.shiftDetailList[action.index].shiftDetailList = [{
                    "claimType": "",
                    "description": "",
                    "duration": 0,
                    "endTime": new Date(result.date.getTime()),
                    "startTime": new Date(result.date.getTime()),
                    "status": ""
                }]
            }
            if (action.shiftType === "") {
                result.errorList[action.index + "_shiftType"] = "Please select a shift type."
            } else {
                delete result.errorList[action.index + "_shiftType"];
            }
            break;
        case "updateStartTime":
            result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].startTime = new Date(action.value.getTime());
            if (action.value < result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].endTime) {
                result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].duration = Utility.getDurationInHour(
                    result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].startTime,
                    result.shiftDetailList[action.index].shiftDetailList[action.detailIndex].endTime
                );
                delete result.errorList[action.index + "_" + action.detailIndex + "_startTime"];
            } else {
                result.errorList[action.index + "_" + action.detailIndex + "_startTime"] = "The start time must be ealier than the end time.";
            }
            break;
        default:
            break;
    }
    return result;
}
export default function useShiftDetailModal(incomingShiftObj) {
    let [itemList, updateItemList] = useReducer(reducer, {
        date: null,
        errorList: {},
        itoId:"",
        itoName: "",
        itoPostName: "",
        shiftDetailList: []
    });
    useEffect(() => {
        console.log(incomingShiftObj);
        /*
        if (incomingShiftObj) {
            let tempList = [];
            if (incomingShiftObj.shiftType) {
                let shiftTypeList = incomingShiftObj.shiftType.split("+");
                shiftTypeList.forEach(shiftType => {
                    let tempObj = { "shiftType": shiftType };
                    if (shiftType === "t") {
                        tempObj.shiftDetailList = [];
                        if (incomingShiftObj.shiftDetail){
                            incomingShiftObj.shiftDetail.forEach(obj => {
                                tempObj.shiftDetailList.push({
                                    id:obj.id,
                                    claimType: obj.claimType,
                                    description: obj.description,
                                    duration: obj.duration,
                                    endTime: new Date(obj.endTime.getTime()),
                                    startTime: new Date(obj.startTime.getTime()),
                                    status: obj.status
                                });
                            });
                        }
                    }
                    tempList.push(tempObj)
                });
            } else {
                tempList = [{ shiftType: "" }];
            }
            updateItemList({
                date: incomingShiftObj.date,
                errorList: {},
                itoId:incomingShiftObj.itoId,
                itoName: incomingShiftObj.itoName,
                itoPostName: incomingShiftObj.itoPostName,
                "type": "init",
                shiftDetailList: structuredClone(tempList)
            });
        }
        */
    }, [incomingShiftObj]);
    let isShiftDetailValid = () => {
        let result = true;
        let tempErrorList = {};
        for (let i = 0; i < itemList.shiftDetailList.length; i++) {
            let item = itemList.shiftDetailList[i];
            switch (item.shiftType) {
                case "":
                    tempErrorList[i + "_shiftType"] = "Please select a shift type.";
                    result = false;
                    break;
                case "t":
                    for (let j = 0; j < item.shiftDetailList.length; j++) {
                        if (item.shiftDetailList[j].claimType === "") {
                            tempErrorList[i + "_" + j + "_claimType"] = "Please select a claim type.";
                            result = false;
                        }
                        if (item.shiftDetailList[j].description === "") {
                            tempErrorList[i + "_" + j + "_desc"] = "Please enter the description";
                            result = false;
                        }
                        if (item.shiftDetailList[j].endTime <= item.shiftDetailList[j].startTime) {
                            tempErrorList[i + "_" + j + "_startTime"] = "The start time must be ealier than the end time.";
                            tempErrorList[i + "_" + j + "_endTime"] = "The end time must be later than the start time.";
                            result = false;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        updateItemList({
            errorList: tempErrorList,
            "type": "setErrorList"
        });
        return result;
    }
    let updateClaimType = (index, detailIndex, claimType) => {
        updateItemList({
            claimType,
            detailIndex,
            index,
            "type": "updateClaimType"
        });
    };
    let updateEndTime = (index, detailIndex, value) => {
        updateItemList({ index, detailIndex, value, "type": "updateEndTime" });
    }
    let updatDesc = (index, detailIndex, desc) => {
        updateItemList({
            detailIndex,
            desc,
            index,
            "type": "updatDesc"
        });
    }
    let updateShiftType = (index, shiftType) => {
        updateItemList({ "type": "updateShiftType", index, shiftType });
    };
    let updateStartTime = (index, detailIndex, value) => {
        updateItemList({
            index,
            detailIndex,
            value,
            "type": "updateStartTime"
        });
    }
    return {
        date: itemList.date,
        errorList: itemList.errorList,
        itoId:itemList.itoId,
        itoName: itemList.itoName,
        itoPostName: itemList.itoPostName,
        shiftDetailList: itemList.shiftDetailList,
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