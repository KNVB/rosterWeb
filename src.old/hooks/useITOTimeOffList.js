import { useEffect, useReducer } from "react";
import TimeOff from "../dataUtil/TimeOff";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.itoTimeOffList = action.itoTimeOffList;
            result.isLoading = false;
            break
        case "setError":
            result.error = action.error;
            break;
        default:
            break;
    }
    return result;
}
export default function useTimeOffList(timeOffListMonth) {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        timeOff: new TimeOff(),
        timeOffList: {}
    });
    useEffect(() => {
        let getData = async () => {
            try {
                let now = new Date();
                let timeOffYear = now.getFullYear();
                let timeeOffMonth = now.getMonth();
                let itoTimeOffList = await itemList.timeOff.getITOTimeOffList(timeOffYear, timeeOffMonth);
                updateItemList({
                    itoTimeOffList,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        };
        getData();
    }, []);
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        itoTimeOffList: itemList.itoTimeOffList
    }
}