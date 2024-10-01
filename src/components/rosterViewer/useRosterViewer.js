import { useEffect, useReducer } from "react";
import RosterViewerData from "../../dataUtil/RosterViewerData";
let reducer = (state, action) => {
    let result = { ...state };

    switch (action.type) {
        case "init":
            result.rosterViewerData = action.rosterViewerData;
            result.isLoading = false;
            break;
        default:
            break;
    }
    return result;
}
export default function useRosterViewer() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        isShowShiftDetail: false,
        rosterViewerData: null,
        selectedShift: null
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let rosterViewerData = new RosterViewerData();
            try {
                //await rosterViewerData.load(rosterYear, rosterMonth);
                await rosterViewerData.load(2024, 8);
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
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        isShowShiftDetail: itemList.isShowShiftDetail,
        rosterViewerData:itemList.rosterViewerData,
        selectedShift: null,
        action:{}
    }
} 