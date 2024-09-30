import { useEffect, useReducer } from "react";
import Utility from "../Utility";
let genMonthTable = (tempResult, result,maxDate,minDate) => {
    let monthRow = [], monthTable = { rowList: [] };

    for (let i = 0; i < 12; i++) {
        let temp = {disabled:false, text: Utility.monthNameList[i], value: i };
        let tempMonth=new Date(tempResult.getFullYear(),i,1);
        let className=[];
        if ((result.getFullYear() === tempResult.getFullYear()) && (i === tempResult.getMonth())) {
            className.push("selectedItem");
        }
        if (!Utility.isWithinTheRange(tempMonth,maxDate,minDate)){
            temp.disabled=true;
            className.push("disabled");
        }
        if (className.length >0) {
            temp.className=className.join(" ");
        }
        monthRow.push(structuredClone(temp));
        if (((i + 1) % 3) === 0) {
            monthTable.rowList.push(structuredClone(monthRow));
            monthRow = [];
        }
    }
    return monthTable;
}
let reducer = (state, action) => {
    let result = { ...state };    
    switch (action.type) {
        case "closePicker":
            result.isShowPicker = false;
            break;
        case "init":
            result.maxDate = action.maxDate;
            result.minDate = action.minDate;
            result.result = action.result;
            result.tempResult = action.result;
            result.hasNextMonth = action.hasNextMonth;
            result.hasNextYear = action.hasNextYear;
            result.hasPrevMonth = action.hasPrevMonth;
            result.hasPrevYear = action.hasPrevYear;
            result.bodyRow = genMonthTable(action.result, action.result, result.maxDate, result.minDate);
            break;
        case "togglePicker":
            result.isShowPicker = !result.isShowPicker;
            break;
        case "updateValue":
            result.result = action.result;
            result.tempResult = action.result;           
            result.isShowPicker = false;
            result.hasNextMonth = action.hasNextMonth;
            result.hasNextYear = action.hasNextYear;
            result.hasPrevMonth = action.hasPrevMonth;
            result.hasPrevYear = action.hasPrevYear;
            result.bodyRow = genMonthTable(action.result, action.result, result.maxDate, result.minDate);
            break;
        case "updateYear":
            result.tempResult = action.result;
            result.hasNextMonth = action.hasNextMonth;
            result.hasNextYear = action.hasNextYear;
            result.hasPrevMonth = action.hasPrevMonth;
            result.hasPrevYear = action.hasPrevYear;
            result.bodyRow = genMonthTable(result.tempResult, result.result, result.maxDate, result.minDate);
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useMonthPicker(defaultValue, maxDate, minDate) {
    let initObj = {
        bodyRow: null,
        isShowPicker: false,
        hasNextMonth: true,
        hasNextYear: true,
        hasPrevMonth: true,
        hasPrevYear: true,
        maxDate: null,
        minDate: null,
        result: null,
        tempResult: null,
    }
    const [itemList, updateItemList] = useReducer(reducer, initObj);
    let genPreNext = (newValue, maxDate, minDate) => {

        let nextMonth = new Date(newValue.getFullYear(), newValue.getMonth() + 1, 1);
        let nextYear = new Date(newValue.getFullYear() + 1, 0, 1);
        let prevMonth = new Date(newValue.getFullYear(), newValue.getMonth(), 1);
        /*******************************************************************
        * if the last day of the previous year does not within the range, *
        * the previous year button should be disabled.                    *
        *******************************************************************/
        let prevYear = new Date(newValue.getFullYear() - 1, 11, 31);

        /*******************************************************************
        * if the last day of the previous month does not within the range, *
        * the previous month button should be disabled.                    *
        *******************************************************************/
        prevMonth.setDate(prevMonth.getDate() - 1);
        let hasNextMonth = (nextMonth >= minDate && nextMonth <= maxDate);
        let hasNextYear = (nextYear >= minDate && nextYear <= maxDate)
        let hasPrevMonth = (prevMonth >= minDate && prevMonth <= maxDate);
        let hasPrevYear = (prevYear >= minDate && prevYear <= maxDate);
        return {
            hasNextMonth, hasNextYear,
            hasPrevMonth, hasPrevYear
        }
    }
    useEffect(() => {
        if (Utility.isNull(defaultValue)) {
            defaultValue = new Date();
        }
        if (Utility.isNull(maxDate)) {
            maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 100);
        }
        if (Utility.isNull(minDate)) {
            minDate = new Date();
            minDate.setFullYear(maxDate.getFullYear() - 100);
        }
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = genPreNext(defaultValue, maxDate, minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, maxDate, minDate, "result": defaultValue ?? new Date(), "type": "init" });
    }, [defaultValue, maxDate, minDate])
    let closePicker = () => {
        updateItemList({ "type": "closePicker" })
    }

    let prevYear = () => {
        let temp = new Date(itemList.tempResult.getTime());
        temp.setFullYear(temp.getFullYear() - 1);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "type": "updateYear", result: temp });
    }
    let nextYear = () => {
        let temp = new Date(itemList.tempResult.getTime());
        temp.setFullYear(temp.getFullYear() + 1);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "type": "updateYear", result: temp });
    }
    let togglePicker = () => {
        updateItemList({ "type": "togglePicker" })
    }
    let updateValue = newValue => {
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = genPreNext(newValue, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "result": newValue, "type": "updateValue" });
    }
    return {
        bodyRow: itemList.bodyRow,
        isShowPicker: itemList.isShowPicker,
        hasNextMonth: itemList.hasNextMonth,
        hasNextYear: itemList.hasNextYear,
        hasPrevMonth: itemList.hasPrevMonth,
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