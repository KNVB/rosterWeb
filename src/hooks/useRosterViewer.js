import { useEffect, useReducer } from "react";
import RosterTableUtil from "../dataUtil/RosterTableUtil";
import RosterViewerData from "../dataUtil/RosterViewerData";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterViewerData = action.rosterViewerData;
            result.isLoading = false;
            break;
        case "refresh":
            result.isLoading = false;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateLoading":
            result.isLoading = action.value;
            break;
        default:
            break;
    }
    return result;
}
export function useRosterViewer() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        rosterViewerData: null,
        rosterTableUtil: new RosterTableUtil(),
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let rosterViewerData = new RosterViewerData();
            try {
                await rosterViewerData.load(rosterYear, rosterMonth);
                updateItemList({
                    rosterViewerData,
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
        if (itemList.rosterViewerData.activeShiftList[shiftType])
            return itemList.rosterViewerData.activeShiftList[shiftType].cssClassName;
        else
            return "";
    }
    let isHighLightCell = cellIndex => {
        return itemList.rosterTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterTableUtil.isHighLightRow(rowIndex);
    }
    let updateRosterMonth = async (newRosterMonth) => {
        try {
            //updateItemList({"type":"updateLoading",value:true});
            await itemList.rosterViewerData.reload(newRosterMonth);
            updateItemList({
                type: "refresh"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterTableUtil.updateUI(cellIndex, rowIndex);
        updateItemList({ cellIndex, rowIndex, type: "refresh" });
    }
    //console.log(itemList.rosterViewerData);
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        "rosterViewerData": itemList.rosterViewerData,
        "uiAction": {
            getShiftCssClassName,
            isHighLightCell,
            isHighLightRow,
            updateRosterMonth,
            updateUI
        }
    }
}