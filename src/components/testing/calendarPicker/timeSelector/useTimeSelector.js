import { useReducer } from "react";

let timeFormatter = new Intl.DateTimeFormat('en-ZA', {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit"
});
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "updateAPM":
            console.log(result.hour + ":" + result.minute + " " + action.value);
            console.log()
            result.aPM = action.value;
            break;
        case "updateSelectedItem":
            result.selectedItem = action.item;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useTimeSelector({
    hourRef,
    minRef,
    aPMRef
}) {

    let timeString = timeFormatter.format(value);
    let initObj = {
        /*
        aPM: timeString.substring(timeString.length - 2).toUpperCase().trim(),
        aPMRef: aPMRef,
        hour: timeString.substring(0, 2),
        hourRef: hourRef,
        minute: timeString.substring(3, 5),
        minRef: minRef,
      */
        selectedItem: "hour"
    };
    //console.log(timeString,value,initObj);   
    const [itemList, updateItemList] = useReducer(reducer, initObj);
    let updateSelectedItem = item => {
        updateItemList({
            "item": item,
            "type": "updateSelectedItem"
        })
    };
    console.log(timeString, value, initObj,itemList);
    return {
        /*
        aPM: itemList.aPM,
        hour: itemList.hour,
        minute: itemList.minute,
     */ 
        selectedItem: itemList.selectedItem,
        action: {
            updateSelectedItem,
        }
    }
}