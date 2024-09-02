import { useReducer } from "react";
let genMonthlyCalendar = (selectedDate) => {
    let temp = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    console.log("===================");
    console.log("selectedDate:" + selectedDate);
    console.log("temp:" + temp);
    console.log("===================");
    let monthEndDate = temp.getDate();
    let monthlyCalendar = { rowList: [] };
    temp = new Date(selectedDate.getTime());
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
    temp = new Date(selectedDate.getTime());
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
        case "closePicker":
            result.isShowPicker = false;
            break;
        case "init":
            result.result = action.result;
            result.tempValue = action.result;
            result.monthlyCalendar = genMonthlyCalendar(action.result);
            break;
        case "updateTempValue":
            console.log(action);
            result.tempValue = action.newTempValue;
            result.monthlyCalendar = genMonthlyCalendar(action.newTempValue);
            break
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
        monthlyCalendar: genMonthlyCalendar(defaultValue ?? new Date()),
        result: (defaultValue ?? new Date()),
        tempValue: (defaultValue ?? new Date()),
        weekDayNameList: ["Su", "M", "T", "W", "Th", "F", "S"]
    };

    const [itemList, updateItemList] = useReducer(reducer, initObj);
    let closePicker = () => {
        updateItemList({ "type": "closePicker" })
    }
    let prevMonth = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setMonth(temp.getMonth() - 1);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let prevYear = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setFullYear(temp.getFullYear() - 1);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let nextMonth = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setMonth(temp.getMonth() + 1);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let nextYear = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setFullYear(temp.getFullYear() + 1);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let selectToday = () => {
        let temp = new Date();
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let togglePicker = () => {
        updateItemList({ "type": "togglePicker" })
    }
    let updateDateValue = date => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setDate(date);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let updateValue = date => {
        let temp = new Date(itemList.result.getTime());
        temp.setDate(date);
        updateItemList({ "newValue": temp, "type": "updateValue" });
    }
    let updateTempValue = dateObj => {
        let temp = new Date(dateObj.getTime());
        console.log(temp);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    return {
        isShowPicker: itemList.isShowPicker,
        monthFullNameList: itemList.monthFullNameList,
        monthlyCalendar: itemList.monthlyCalendar,
        result: itemList.result,
        tempValue: itemList.tempValue,
        weekDayNameList: itemList.weekDayNameList,
        action: {
            closePicker,
            prevMonth,
            prevYear,
            nextMonth,
            nextYear,
            selectToday,
            togglePicker,
            updateDateValue,
            updateTempValue,
            updateValue,
        }
    }
}