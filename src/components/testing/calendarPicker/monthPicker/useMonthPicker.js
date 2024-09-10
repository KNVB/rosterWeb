import { useEffect, useReducer } from "react";
let genMonthTable = (tempResult,result) => {
    let monthRow = [], monthTable = { rowList: [] };
    let monthNameList = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    for (let i = 0; i < 12; i++) {
        let temp = { text: monthNameList[i], value: i };
        if ((result.getFullYear() === tempResult.getFullYear()) && (i === tempResult.getMonth())) {
            temp.className = "selectedItem";
        } else {
            temp.className = null;
        }
        monthRow.push(structuredClone(temp));
        if (((i + 1) % 3) === 0) {
            monthTable.rowList.push(structuredClone(monthRow));
            monthRow = [];
        }
    }
    //console.log(monthTable);
    return monthTable;
}
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "closePicker":
            result.isShowPicker = false;
            break;
        case "init":
            result.bodyRow = genMonthTable(action.result,action.result);
            result.result = action.result;
            result.tempResult = action.result;
            break;
        case "togglePicker":
            result.isShowPicker = !result.isShowPicker;
            break;
        case "updateValue":
            result.result = action.result;
            result.tempResult = action.result;
            result.bodyRow = genMonthTable(action.result,action.result);
            result.isShowPicker = false;
            break;
        case "updateYear":
            result.tempResult = action.result;
            console.log(result.tempResult,result.result);
            result.bodyRow = genMonthTable(result.tempResult,result.result);
            break;
        default:
            break;
    }
    console.log(result);
    return result;
}
export default function useMonthPicker(defaultValue, maxDate, minDate) {
    let initObj = {
        bodyRow: null,
        isShowPicker: false,
        hasNextYear: true,
        hasPrevYear: true,
        maxDate: maxDate,
        minDate: minDate,
        result: null,
        tempResult: null,
    }
    const [itemList, updateItemList] = useReducer(reducer, initObj);
    useEffect(() => {
        updateItemList({ "result": defaultValue ?? new Date(), "type": "init" });
    }, [defaultValue])
    let closePicker = () => {
        updateItemList({ "type": "closePicker" })
    }
    let prevYear = () => {
        let temp = new Date(itemList.result.getTime());
        temp.setFullYear(temp.getFullYear() - 1);
        updateItemList({ "type": "updateYear", result: temp });
    }
    let nextYear = () => { 
        let temp = new Date(itemList.result.getTime());
        temp.setFullYear(temp.getFullYear() + 1);
        updateItemList({ "type": "updateYear", result: temp });
    }
    let togglePicker = () => {
        updateItemList({ "type": "togglePicker" })
    }
    let updateValue = newValue => {
        updateItemList({ "result": newValue, "type": "updateValue" });
    }
    return {
        bodyRow: itemList.bodyRow,
        isShowPicker: itemList.isShowPicker,
        hasNextYear: itemList.hasNextYear,
        hasPrevYear: itemList.hasPrevYear,
        result: itemList.result,
        tempResult: itemList.tempResult,
        action: {
            closePicker,
            prevYear,
            nextYear,
            togglePicker,
            updateValue,
        }
    }
}