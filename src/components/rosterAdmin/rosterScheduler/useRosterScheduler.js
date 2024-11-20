import { useEffect, useReducer } from "react";
import RosterSchedulerData from "../../../dataUtil/RosterSchedulerData";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterSchedulerData = action.rosterSchedulerData;
            result.isLoading = false;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useRosterScheduler(){
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,      
        rosterSchedulerData: null
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let rosterSchedulerData = new RosterSchedulerData();
            try {
                await rosterSchedulerData.load(2024, 8);
                //await rosterSchedulerData.load(rosterYear, rosterMonth);
                console.log(rosterSchedulerData);
                updateItemList({
                    rosterSchedulerData,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    let deleteSelectedData = (selectedLocation) => {
        selectedLocation.column.end -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        selectedLocation.column.start -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        itemList.rosterSchedulerData.deleteSelectedData(
            selectedLocation,
            itemList.rosterSchedulerData.noOfWorkingDay,
            itemList.rosterSchedulerData.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    let getShiftCssClassName = shiftType => {
        return itemList.rosterSchedulerData.getShiftCssClassName(shiftType);
    }
    let isDuplicateShift = (dateOfMonth, itoId)=>{
        return itemList.rosterSchedulerData.isDuplicateShift(dateOfMonth, itoId);
    }
    let reDo = () => {
        itemList.rosterSchedulerData.reDo();
        updateItemList({ type: "refresh" });
    }
    let updateRosterMonth = async newRosterMonth => {
        try {
            updateItemList({ "type": "showLoading" });
            await itemList.rosterSchedulerData.reload(newRosterMonth);
            updateItemList({
                type: "refresh"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let updatePreferredShiftFromTable = (itoId, date, newPreferredShift) => {
        itemList.rosterSchedulerData.updatePreferredShiftFromTable(itoId, date, newPreferredShift);
        updateItemList({ "type": "refresh" });
    }
    let updateShiftFromTable = (itoId, date, newShift) => {
        itemList.rosterSchedulerData.updateShiftFromTable(itoId, date, newShift);
        updateItemList({ "type": "refresh" });
    }
    let unDo = () => {
        itemList.rosterSchedulerData.unDo();
        updateItemList({ type: "refresh" });
    } 
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        rosterSchedulerData: itemList.rosterSchedulerData,
        dataAction: {
            deleteSelectedData,
            getShiftCssClassName,
            isDuplicateShift,
            reDo,
            updatePreferredShiftFromTable,
            updateRosterMonth,
            updateShiftFromTable,
            unDo
        }
    }
}