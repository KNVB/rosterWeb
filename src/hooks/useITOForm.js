import { useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import ITOManagementUtil from "../dataUtil/ITOManagementUtil";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "addShiftPattern":
            temp = JSON.parse(JSON.stringify(result.ito.blackListedShiftPattern));
            temp.push("");
            result.ito.blackListedShiftPattern = temp;
            break;
        case "init":
            result.itoManagementUtil = action.itoManagementUtil;
            result.activeShiftList = action.activeShiftList;
            result.isLoading = false;
            break
        case "removeShiftPattern":
            temp = [];
            result.ito.blackListedShiftPattern.forEach((pattern, index) => {
                if (index !== action.index) {
                    temp.push(pattern);
                }
            });
            result.ito.blackListedShiftPattern = temp;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateAvailableShift":
            result.ito.availableShift = action.value;
            break;
        case "updateOperatorType":
            result.ito.isOperator = action.value;
            switch (action.value) {
                case "0":
                    result.ito.availableShift = ["d1", "O"];
                    result.ito.blackListedShiftPattern = ["a","b", "b1", "c"];
                    break;
                case "1":
                    result.ito.availableShift = ["a", "b", "c", "d1", "O"];
                    break;
                default:
                    break;
            }
            break;
        case "updateTextField":
            result.ito[action.fieldName] = action.value;
            break;
        case "updateShiftPattern":
            temp = JSON.parse(JSON.stringify(result.ito.blackListedShiftPattern));
            temp[action.index] = action.value;
            result.ito.blackListedShiftPattern = temp;
            break
        default:
            break;
    }
    return result;
}
export function useITOForm() {
    let data = useLocation();
    const [itemList, updateItemList] = useReducer(reducer, {
        activeShiftList: null,
        ito: data.state.ito,
        error: null,
        isLoading: true
    });
    useEffect(() => {
        let getData = async () => {
            try {
                let itoManagementUtil = new ITOManagementUtil();
                let activeShiftList = await itoManagementUtil.getActiveShiftList();
                updateItemList({
                    itoManagementUtil,
                    activeShiftList,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    let addITO = async () => {
        try {
            await itemList.itoManagementUtil.addITO(itemList.ito);
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let addShiftPattern = () => {
        updateItemList({ type: "addShiftPattern" });
    }
    let removeShiftPattern = index => {
        updateItemList({
            index: index,
            type: "removeShiftPattern"
        });
    }
    let updateAvailableShift = (action, value) => {
        let temp;
        switch (action) {
            case "add":
                temp = JSON.parse(JSON.stringify(itemList.ito.availableShift));
                temp.push(value);
                updateItemList({
                    value: temp,
                    type: "updateAvailableShift"
                });
                break;
            case "remove":
                temp = itemList.ito.availableShift.filter(shift => shift !== value);
                updateItemList({
                    value: temp,
                    type: "updateAvailableShift"
                });
                break;
            default:
                break;
        }
    }

    let updateITO = async () => {
        try {
            await itemList.itoManagementUtil.updateITO(itemList.ito);
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let updateOperatorType = type => {
        updateItemList({
            "type": "updateOperatorType",
            "value": type
        });
    }
    let updateShiftPattern = (index, value) => {
        updateItemList({
            index: index,
            type: "updateShiftPattern",
            value: value
        });
    }
    let updateTextField = (fieldName, value) => {
        updateItemList({
            fieldName: fieldName,
            value: value,
            type: "updateTextField"
        });
    }
    return {
        activeShiftList: itemList.activeShiftList,
        error: itemList.error,
        isLoading: itemList.isLoading,
        ito: itemList.ito,
        updateAction: {
            addITO,
            addShiftPattern,
            removeShiftPattern,
            updateAvailableShift,
            updateITO,
            updateOperatorType,
            updateShiftPattern,
            updateTextField
        }
    }
}