import { useEffect, useReducer } from "react";
import RosterSchedulerData from "../../../dataUtil/RosterSchedulerData";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterSchedulerData = action.rosterSchedulerData;
            result.isLoading = false;
            break;
        case "hideShiftDetail":
            result.isShowShiftDetail = false;
            break;
        case "refresh":
            result.isLoading = false;
            break;
        case "setSelectedShift":
            result.isShowShiftDetail = true;
            result.selectedShift = action.selectedShift;
            break;
        case "showLoading":
            result.isLoading = true;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        isShowShiftDetail: false,
        rosterSchedulerData: null,
        selectedShift: null
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let rosterSchedulerData = new RosterSchedulerData();
            try {
                await rosterSchedulerData.load(2024, 8);
                //console.log(rosterSchedulerData);
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
    let copyRosterData = copyRegion => {
        copyRegion.column.end -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        copyRegion.column.start -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        itemList.rosterSchedulerData.copy(copyRegion);
        updateItemList({ type: "refresh" });
    }
    let deleteSelectedData = (selectedLocation) => {
        selectedLocation.column.end -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        selectedLocation.column.start -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        itemList.rosterSchedulerData.deleteSelectedData(
            selectedLocation,
            itemList.rosterSchedulerData.noOfWorkingDay,
            itemList.rosterSchedulerData.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    let getCopyDataRowCount = () => {
        return itemList.rosterSchedulerData.getCopyDataRowCount();
    }
    let getShiftCssClassName = shiftType => {
        return itemList.rosterSchedulerData.getShiftCssClassName(shiftType);
    }
    let handleEscKeyEvent = () => {
        itemList.rosterSchedulerData.clearCopiedData();
        updateItemList({ type: "refresh" });
    }
    let hideShiftDetail = () => {
        updateItemList({
            "type": "hideShiftDetail"
        });
    }
    let isDuplicateShift = (dateOfMonth, itoId)=>{
        return itemList.rosterSchedulerData.isDuplicateShift(dateOfMonth, itoId);
    } 
    let paste = (dateOfMonth, rosterRowIdList, selectedLocation) => {
        itemList.rosterSchedulerData.paste(dateOfMonth, rosterRowIdList, selectedLocation);
        updateItemList({ type: "refresh" });
    }
    let reDo = () => {
        itemList.rosterSchedulerData.reDo();
        updateItemList({ type: "refresh" });
    }
    let showShiftDetail = (e, itoId, date) => {
        e.preventDefault();
        let selectedShift = itemList.rosterSchedulerData.getShift(itoId, date);

        updateItemList({
            "selectedShift": selectedShift,
            "type": "setSelectedShift"
        });
    }
    let updatePreferredShiftFromTable = (itoId, date, newPreferredShift) => {
        itemList.rosterSchedulerData.updatePreferredShiftFromTable(itoId, date, newPreferredShift);
        updateItemList({ "type": "refresh" });
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
    let updateShiftFromModal = shiftObj => {
        itemList.rosterSchedulerData.updateShiftFromModal(shiftObj);
        updateItemList({ "type": "hideShiftDetail" });
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
        isShowShiftDetail: itemList.isShowShiftDetail,
        rosterSchedulerData: itemList.rosterSchedulerData,
        selectedShift: itemList.selectedShift,
        dataAction: {
            copyRosterData,
            deleteSelectedData,
            getCopyDataRowCount,
            getShiftCssClassName,
            handleEscKeyEvent,
            hideShiftDetail,
            isDuplicateShift,
            paste,
            reDo,
            showShiftDetail,
            updatePreferredShiftFromTable,
            updateRosterMonth,
            updateShiftFromModal,
            updateShiftFromTable,
            unDo
        }
    }
}