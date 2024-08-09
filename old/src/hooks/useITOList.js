import { useEffect, useReducer } from "react";
import ITOManagementUtil from "../dataUtil/ITOManagementUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.itoList = action.itoList;
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
export function useITOList() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        itoManagementUtil:new ITOManagementUtil(), 
        itoList: {}
    });
    useEffect(() => {
        let getData = async () => {
            try {
               
                let itoList = await itemList.itoManagementUtil.getITOList();
                updateItemList({                    
                    itoList,
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
        itoList: itemList.itoList,
    }
}