import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import ActiveShiftList from "../dataUtil/ActiveShiftList";
import ITO from "../dataUtil/ITO";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "addShiftPattern":
            temp = JSON.parse(JSON.stringify(result.itoInfo.blackListedShiftPattern));
            temp.push("");
            result.itoInfo.blackListedShiftPattern = temp;
            break;
        case "init":
            result.activeShiftList = action.activeShiftList;
            result.isLoading = false;
            break
        case "removeShiftPattern":
            temp = [];
            result.itoInfo.blackListedShiftPattern.forEach((pattern, index) => {
                if (index !== action.index) {
                    temp.push(pattern);
                }
            });
            result.itoInfo.blackListedShiftPattern = temp;
            break;
        case "updateAvailableShift":
            result.itoInfo.availableShift = action.value;
            break
        case "updateDate":
            result.itoInfo[action.fieldName] = action.value;
            break;
        case "updateDutyPattern":
            result.itoInfo.dutyPattern = action.value;
            result.itoInfo.availableShift = action.availableShift;
            break
        case "updateShiftPattern":
            temp = JSON.parse(JSON.stringify(result.itoInfo.blackListedShiftPattern));
            temp[action.index] = action.value;
            result.itoInfo.blackListedShiftPattern = temp;
            break
        case "updateTextField":
            result.itoInfo[action.fieldName] = action.value;
            break;
        default:
            break;
    }
    return result;
}
export function useITOForm() {
    let data = useLocation();
    let navigate = useNavigate();
    let addShiftPattern = () => {
        updateItemList({ type: "addShiftPattern" });
    }
    let backToITOlList = e => {
        navigate("../itoManagement/list")
    }
    let isAvailableShiftValid = () => {
        let result = false;
        let isIncludeAShift = itemList.itoInfo.availableShift.includes("a");
        let isIncludeBxShift = itemList.itoInfo.availableShift.includes("b") || itemList.itoInfo.availableShift.includes("b1");
        let isIncludeCShift = itemList.itoInfo.availableShift.includes("c");
        let isIncludeDxShift = itemList.itoInfo.availableShift.includes("d") || itemList.itoInfo.availableShift.includes("d1") || itemList.itoInfo.availableShift.includes("d2") || itemList.itoInfo.availableShift.includes("d3");

        if (itemList.itoInfo.dutyPattern === "day") {
            if (!isIncludeDxShift) {
                alert("Missing dx shift in available shift.");
                return result
            }
            return true
        } else {
            if (itemList.itoInfo.dutyPattern === "operator") {
                if (!isIncludeAShift) {
                    alert("Missing A Shift in available shift.");
                    return result
                }
                if (!isIncludeBxShift) {
                    alert("Missing bx Shift in available shift.");
                    return result
                }
                if (!isIncludeCShift) {
                    alert("Missing c Shift in available shift.");
                    return result
                }
                if (!isIncludeDxShift) {
                    alert("Missing dx Shift in available shift.");
                    return result
                }
                return true
            }
        }
    }
    let doUpdate = async (form, action) => {
        if (form.reportValidity()) {
            if (isAvailableShiftValid()) {
                switch (action) {
                    case "add":
                        await itemList.ito.addITO(itemList.itoInfo);
                        alert("New ITO added");
                        backToITOlList();
                        break;
                    case "edit":
                        await itemList.ito.update(itemList.itoInfo);
                        alert("The ITO info. has been saved.");
                        backToITOlList();
                        break;
                    default:
                        break;
                }
            }
        }
    }
    let removeShiftPattern = index => {
        updateItemList({
            index: index,
            type: "removeShiftPattern"
        });
    }
    let updateAvailableShift = e => {
        let temp;
        let field = e.target;
        if (field.checked) {
            temp = JSON.parse(JSON.stringify(itemList.itoInfo.availableShift));
            temp.push(field.value);
        } else {
            temp = itemList.itoInfo.availableShift.filter(shift => shift !== field.value);
        }

        updateItemList({ type: "updateAvailableShift", value: temp });
    }
    let updateDate = (fieldName, value) => {
        updateItemList({
            fieldName,
            "value": value.toLocaleDateString("en-CA"),
            type: "updateDate"
        });
    }
    let updateDutyPattern = e => {
        let availableShift = ["a", "b", "c", "d1", "d2", "O"];
        let value = e.target.value;
        if (value === "day") {
            availableShift = ["d1", "d2", "O"];
        }
        updateItemList({
            availableShift,
            type: "updateDutyPattern",
            value
        });
    }
    let updateShiftPattern = e => {
        let field = e.target;
        let index = Number(field.name.replace("blackListedShiftPattern_", ""));
        updateItemList({
            index: index,
            value: field.value,
            type: "updateShiftPattern"
        });
    }
    let updateTextField = e => {
        let field = e.target;
        updateItemList({
            fieldName: field.name,
            value: field.value,
            type: "updateTextField"
        })
    }
    const [itemList, updateItemList] = useReducer(reducer, {
        activeShiftList: null,
        isLoading: true,
        itoInfo: data.state.ito,
        ito: new ITO(),
        error: null,
    });
    useEffect(() => {
        let getData = async () => {
            try {
                let activeShiftList = await ActiveShiftList();
                updateItemList({
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
    return {
        activeShiftList: itemList.activeShiftList,
        addShiftPattern,
        backToITOlList,
        doUpdate,
        error: itemList.error,
        isLoading: itemList.isLoading,
        ito: itemList.itoInfo,
        removeShiftPattern,
        updateAvailableShift,
        updateDate,
        updateDutyPattern,
        updateShiftPattern,
        updateTextField
    }
}