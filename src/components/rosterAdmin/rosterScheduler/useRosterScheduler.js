import { useEffect, useReducer } from "react";
import RosterSchedulerData from "../../../dataUtil/RosterSchedulerData";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterSchedulerData = action.rosterSchedulerData;
            result.isLoading = false;          
            break;
        case "setSelectedShift":
            result.isShowShiftDetail = true;
            result.selectedShift = action.selectedShift;
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
    let getShiftCssClassName = shiftType => {
        return itemList.rosterSchedulerData.getShiftCssClassName(shiftType);
    }
    let hideShiftDetail = () => {
        updateItemList({
            "type": "hideShiftDetail"
        });
    }
    let showShiftDetail = (itoId, date) => {
        let selectedShift = itemList.rosterSchedulerData.getShift(itoId, date);
        updateItemList({
            "selectedShift": selectedShift,
            "type": "setSelectedShift"
        });
    }
    let updateRosterMonth = async newRosterMonth => {
        try {
            //updateItemList({"type":"updateLoading",value:true});
            await itemList.rosterSchedulerData.reload(newRosterMonth);
            updateItemList({
                type: "refresh"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let updateShiftFromTable=(itoId,date,newShift)=>{
        itemList.rosterSchedulerData.updateShiftFromTable(itoId,date,newShift);
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        isShowShiftDetail: itemList.isShowShiftDetail,
        rosterSchedulerData: itemList.rosterSchedulerData,
        selectedShift: itemList.selectedShift,
        dataAction: {
            getShiftCssClassName,
            hideShiftDetail,
            showShiftDetail,            
            updateRosterMonth,
            updateShiftFromTable
        }
    }
}