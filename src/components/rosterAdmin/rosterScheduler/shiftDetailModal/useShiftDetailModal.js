import { useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "addEntry":
            result.shiftDetail.shiftList.push({"shiftType":""});
            break;
        case "init":
            result.shiftDetail = action.value;
            break;
        case "removeEntry":
            delete result.shiftDetail.shiftList[action.index];
            break;
        case "updateClaimType":
            result.shiftDetail.shiftList[action.index].claimType = action.claimType;
            break;
        case "updatDesc":
            result.shiftDetail.shiftList[action.index].description = action.desc;
            break;
        case "updateEndTime":
            result.shiftDetail.shiftList[action.index].endTime = new Date(action.endTime.getTime());
            result.shiftDetail.shiftList[action.index].duration = (action.endTime - result.shiftDetail.shiftList[action.index].startTime) / 1000 / 3600;
            break;
        case "updateShiftType":
            /*
            console.log("before");
            console.log(result.shiftDetail.shiftList[action.index]);
            */
            result.shiftDetail.shiftList[action.index].shiftType = action.shiftType;
            if (action.shiftType === "t") {
                result.shiftDetail.shiftList[action.index].claimType = undefined;
                result.shiftDetail.shiftList[action.index].description = "";
                result.shiftDetail.shiftList[action.index].duration = 0;
                result.shiftDetail.shiftList[action.index].endTime = new Date(result.shiftDetail.date.getTime());
                result.shiftDetail.shiftList[action.index].startTime = new Date(result.shiftDetail.date.getTime());
                result.shiftDetail.shiftList[action.index].status = "";
            } else {
                delete result.shiftDetail.shiftList[action.index].claimType;
                delete result.shiftDetail.shiftList[action.index].description;
                delete result.shiftDetail.shiftList[action.index].duration;
                delete result.shiftDetail.shiftList[action.index].endTime;
                delete result.shiftDetail.shiftList[action.index].startTime;
                delete result.shiftDetail.shiftList[action.index].status;
            }
            /*
            console.log("after");
            console.log(result.shiftDetail.shiftList[action.index]);
            */
            break;
        case "updateStartTime":
            result.shiftDetail.shiftList[action.index].startTime = new Date(action.startTime.getTime());
            result.shiftDetail.shiftList[action.index].duration = (result.shiftDetail.shiftList[action.index].endTime - action.startTime) / 1000 / 3600;
            break;
        default:
            break;
    }
    return result;
}
export default function useShiftDetailModal(shiftDetail) {
    let [itemList, updateItemList] = useReducer(reducer, { shiftDetail });
    let addNewEntry=()=>{
        updateItemList({
            "type":"addEntry" 
        });
    }
    let removeEntry = index => { 
        updateItemList({
            index,
            "type":"removeEntry" 
        });
    }
    let update = newShiftDetail => {
        updateItemList({
            "type": "init",
            value: newShiftDetail
        })
    }
    let updateClaimType = (index, claimType) => {
        updateItemList({ "type": "updateClaimType", index, claimType });
    }
    let updatDesc = (index, desc) => {
        updateItemList({ "type": "updatDesc", index, desc });
    }
    let updateEndTime = (index, endTime) => {
        updateItemList({ "type": "updateEndTime", index, endTime });
    }
    let updateShiftType = (index, shiftType) => {
        updateItemList({ "type": "updateShiftType", index, shiftType });
    }
    let updateStartTime = (index, startTime) => {
        updateItemList({ "type": "updateStartTime", index, startTime });
    }

    return {
        tempShiftDetail: itemList.shiftDetail,
        action: {
            addNewEntry,
            removeEntry,
            update,
            updateClaimType,
            updatDesc,
            updateEndTime,
            updateShiftType,
            updateStartTime
        }
    }
}