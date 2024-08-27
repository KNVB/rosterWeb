import { useEffect, useReducer } from "react";
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
    monthlyCalendar: null,
    weekDayNameList: ["Su", "M", "T", "W", "Th", "F", "S"]
};
let genMonthlyCalendar = (result) => {
    let temp = new Date(result.getTime());
    temp.setMonth(temp.getMonth() + 1);
    temp.setDate(0);
    let monthEndDate = temp.getDate();
    let monthlyCalendar = [];
    temp = new Date(result.getTime());
    temp.setDate(1);
    let date = 1, firstWeekday = temp.getDay();
    let weekRow = [];
    for (let i = 0; i < firstWeekday; i++) {
        weekRow.push("");
    }
    for (let i = firstWeekday; i <= 6; i++) {
        weekRow.push(date++);
    }
    monthlyCalendar.push(structuredClone(weekRow));
    weekRow = [];
    temp = new Date(result.getTime());
    while (date <= monthEndDate) {
        temp.setDate(date);
        weekRow.push(date++);
        if (temp.getDay() === 6) {
            monthlyCalendar.push(structuredClone(weekRow));
            weekRow = [];
        }
    }
    if (temp.getDay() < 6) {
        for (let i = temp.getDay(); i < 6; i++) {
            weekRow.push("");
        }
        monthlyCalendar.push(structuredClone(weekRow));
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
        case "setSelectedDate":
            result.result=action.selectedDate;
            result.isShowPicker = false;
            break
        case "showPicker":
            result.isShowPicker = true;
            break;
        default:
            break;
    }
    return result;
}
export default function useDateTimePicker(defaultValue) {
    useEffect(() => {
        let result;
        if (defaultValue) {
            result = defaultValue;
        } else {
            result = new Date();
        }
        updateItemList({ "type": "init", result });
    }, [])


    const [itemList, updateItemList] = useReducer(reducer, initObj);
    let showPicker = () => {
        updateItemList({ "type": "showPicker" })
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
    let setSelectedDate=date=>{
        let temp = new Date(itemList.result.getTime());
        temp.setDate(date);
        updateItemList({"selectedDate":temp,"type":"setSelectedDate"});
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
            setSelectedDate,
            showPicker,
        }
    }
}