import { useEffect, useReducer } from "react";

let genMonthlyCalendar = (result) => {
    let temp = new Date(result.getTime());
    temp.setMonth(temp.getMonth() + 1);
    temp.setDate(0);
    let monthEndDate = temp.getDate();
    let monthlyCalendar = { rowList: [] };
    temp = new Date(result.getTime());
    temp.setDate(1);
    let date = 1, firstWeekday = temp.getDay();
    let weekRow = [];
    for (let i = 0; i < firstWeekday; i++) {
        weekRow.push({ value: "" });
    }
    for (let i = firstWeekday; i <= 6; i++) {
        switch (i) {
            case 0:
            case 6:
                weekRow.push({ className: "ph", value: date++ });
                break;
            default:
                weekRow.push({ value: date++ });
                break;
        }
    }
    monthlyCalendar.rowList.push(structuredClone(weekRow));
    weekRow = [];
    temp = new Date(result.getTime());
    while (date <= monthEndDate) {
        temp.setDate(date);
        switch (temp.getDay()) {
            case 0:
                weekRow.push({ className: "ph", value: date++ });
                break;
            case 6:
                weekRow.push({ className: "ph", value: date++ });
                monthlyCalendar.rowList.push(structuredClone(weekRow));
                weekRow = [];
                break;
            default:
                weekRow.push({ value: date++ });
                break;
        }
    }
    if (temp.getDay() < 6) {
        for (let i = temp.getDay(); i < 6; i++) {
            weekRow.push({ value: "" });
        }
        weekRow[weekRow.length - 1].className = "ph";
        monthlyCalendar.rowList.push(structuredClone(weekRow));
    }
    return monthlyCalendar;
}
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.result = action.result;
            result.monthlyCalendar = genMonthlyCalendar(action.result);
            break;
        case "updateValue":
            result.result = action.newValue;
            result.monthlyCalendar = genMonthlyCalendar(action.newValue);
            break
        case "togglePicker":
            result.isShowPicker = !result.isShowPicker;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useDateTimePicker(defaultValue) {
    let initObj = {
        isShowPicker: false,
        monthFullNameList: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        monthlyCalendar: genMonthlyCalendar(defaultValue??new Date()),
        result: (defaultValue??new Date()),       
        weekDayNameList: ["Su", "M", "T", "W", "Th", "F", "S"]
    };
    
    const [itemList, updateItemList] = useReducer(reducer, initObj);
    let togglePicker = () => {
        updateItemList({ "type": "togglePicker" })
    }
    let prevMonth = () => {
        let temp = new Date(itemList.result.getTime());
        temp.setMonth(temp.getMonth() - 1);
        updateItemList({ "type": "init", "result": temp });
    }
    let prevYear = () => {
        let temp = new Date(itemList.result.getTime());
        temp.setFullYear(temp.getFullYear() - 1);
        updateItemList({ "type": "init", "result": temp });
    }
    let nextMonth = () => {
        let temp = new Date(itemList.result.getTime());
        temp.setMonth(temp.getMonth() + 1);
        updateItemList({ "type": "init", "result": temp });
    }
    let nextYear = () => {
        let temp = new Date(itemList.result.getTime());
        temp.setFullYear(temp.getFullYear() + 1);
        updateItemList({ "type": "init", "result": temp });
    }
    let selectToday = () => {
        let temp = new Date();
        updateItemList({ "newValue": temp, "type": "updateValue" });
    }
    
    let updateValue = date => {
        let temp = new Date(itemList.result.getTime());
        temp.setDate(date);
        updateItemList({ "newValue": temp, "type": "updateValue" });
    }
    return {
        isShowPicker: itemList.isShowPicker,
        monthFullNameList: itemList.monthFullNameList,
        monthlyCalendar: itemList.monthlyCalendar,
        result: itemList.result,
        weekDayNameList: itemList.weekDayNameList,
        action: {
            prevMonth,
            prevYear,
            nextMonth,
            nextYear,
            selectToday,            
            togglePicker,
            updateValue,            
        }
    }
}