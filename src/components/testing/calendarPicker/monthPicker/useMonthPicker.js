import { useEffect, useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "closePicker":
            result.isShowPicker = false;
            break;
        case "togglePicker":
            result.isShowPicker = !result.isShowPicker;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useMonthPicker(defaultValue, maxDate, minDate) {
    let initObj = {
        bodyRow:{
            rowList:[
                [{className:null,value:"JAN"},{className:null,value:"FEB"},{className:null,value:"MAR"}],
                [{className:null,value:"APR"},{className:null,value:"MAY"},{className:null,value:"JUN"}],
                [{className:null,value:"JUL"},{className:null,value:"AUG"},{className:null,value:"SEP"}],
                [{className:null,value:"OCT"},{className:null,value:"NOV"},{className:null,value:"DEC"}]
            ]
        },
        isShowPicker: false,
        hasNextYear: true,
        hasPrevYear: true,
        maxDate: maxDate,
        minDate: minDate,
        result: (defaultValue ?? new Date())
    }
    const [itemList, updateItemList] = useReducer(reducer, initObj);
    let closePicker = () => {
        updateItemList({ "type": "closePicker" })
    }
    let prevYear = () => { }
    let nextYear = () => { }
    let togglePicker = () => {
        updateItemList({ "type": "togglePicker" })
    }
    let updateValue = newValue => { }
    return {
        bodyRow:itemList.bodyRow,
        isShowPicker: itemList.isShowPicker,       
        hasNextYear: itemList.hasNextYear,
        hasPrevYear: itemList.hasPrevYear,
        result: itemList.result,
        action: {
            closePicker,
            prevYear,
            nextYear,
            togglePicker,
            updateValue,
        }
    }
}