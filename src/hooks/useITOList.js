import { useEffect, useReducer } from "react";
import ITOManagementUtil from "../dataUtil/ITOManagementUtil";
import {Utility} from "../util/Utility";
let reducer = (state, action) => {
    let result = { ...state },temp;
    switch (action.type) {
        case "init":
            result.itoManagementUtil = action.itoManagementUtil;
            result.itoList = action.itoList;
            result.isLoading = false;
            break
        case "setError":
            result.error = action.error;
            break;
        case "updateSortingMethod":
            result.sortByFieldName = action.sortByFieldName;
            result.sortingMethod = action.sortingMethod;
            temp = Utility.doSorting(result.itoList, result.sortByFieldName, result.sortingMethod);
            result.itoList = temp;
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
        itoList: [],
        sortByFieldName:"active",
        sortingMethod: "desc",
    });
    useEffect(() => {
        let getData = async () => {
            try {
                let itoManagementUtil = new ITOManagementUtil();
                let itoList = await itoManagementUtil.getITOList();
                itoList=Utility.doSorting(itoList,itemList.sortByFieldName,itemList.sortingMethod);
                updateItemList({
                    itoManagementUtil,
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
    let getSortingStatus = (fieldName) => {
        if (itemList.sortByFieldName === fieldName) {
            if (itemList.sortingMethod === "asc") {
                return <><span className='on'>&#9650;</span><span className='off'>&#9660;</span></>
            }
            if (itemList.sortingMethod === "desc") {
                return <><span className='off'>&#9650;</span><span className='on'>&#9660;</span></>
            }
        }
        return <span className='off'>&#9650;&#9660;</span>
    }
    let updateSortingMethod = (fieldName) => {
        if (itemList.sortByFieldName !== fieldName) {
            updateItemList({ "sortByFieldName": fieldName, sortingMethod: "asc", "type": "updateSortingMethod" });
        } else {
            switch (itemList.sortingMethod) {
                case "asc":
                    updateItemList({ "sortByFieldName": fieldName, sortingMethod: "desc", "type": "updateSortingMethod" });
                    break;
                case "desc":
                    updateItemList({ "sortByFieldName": fieldName, sortingMethod: "asc", "type": "updateSortingMethod" });
                    break;
                default:
                    break;
            }
        }
    }
    return {
        error: itemList.error,        
        isLoading: itemList.isLoading,
        itoList: itemList.itoList,
        getSortingStatus,
        updateSortingMethod,
    }
}