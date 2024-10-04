import { useEffect, useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.date=new Date(action.date.getTime());
            result.itoName=action.itoName
            result.itoPostName=action.itoPostName
            result.shiftDetailList=structuredClone(action.shiftDetailList);
            break;
        default:
            break;
    }
    return result;
}
export default function useShiftDetailModal(incomingShiftObj) {
    let [itemList, updateItemList] = useReducer(reducer, {
        date: null,
        itoName: "",
        itoPostName: "",
        shiftDetailList: []
    });
    useEffect(() => {
       // console.log(incomingShiftObj);
        if (incomingShiftObj) {           
            let tempList = [];
            if (incomingShiftObj.shiftType){
                let shiftTypeList = incomingShiftObj.shiftType.split("+");
                shiftTypeList.forEach(shiftType => {
                    let tempObj = {"shiftType":shiftType };
                    if (shiftType === "t") {
                        tempObj.shiftDetailList=[];
                        incomingShiftObj.shiftDetail.forEach(obj=>{                            
                            tempObj.shiftDetailList.push({
                                claimType:obj.claimType,
                                description: obj.description,
                                duration:obj.duration,
                                endTime:new Date(obj.endTime.getTime()),
                                startTime:new Date(obj.startTime.getTime()),
                                status:obj.status 
                            });
                        })                     
                    }
                    tempList.push(tempObj)
                });
            } else {
                tempList = [{shiftType:""}];
            }
            updateItemList({
                date: incomingShiftObj.date,
                itoName: incomingShiftObj.itoName,
                itoPostName: incomingShiftObj.itoPostName,
                "type": "init",
                shiftDetailList:structuredClone(tempList)
            });
        }
    }, [incomingShiftObj]);
    let updateClaimType = (index, detailIndex, claimType) => { };
    let updateEndTime = (index, detailIndex, value) => {
    }
    let updatDesc = (index, detailIndex, desc) => {
    }
    let updateShiftType = (index, claimType) => { };
    let updateStartTime = (index, detailIndex, value) => {
    }
    return {
        date:itemList.date,
        itoName:itemList.itoName,
        itoPostName:itemList.itoPostName,
        shiftDetailList:itemList.shiftDetailList,
        action: {
            updateClaimType,
            updateEndTime,
            updatDesc,
            updateShiftType,
            updateStartTime 
        }
    }
}