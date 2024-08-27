import { useEffect, useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        default:
            break;
    }
    return result;
}
export default function useDateTimePicker(defaultValue) {
    let initObj={
        isShowPicker: false
    };
    if (defaultValue){
        initObj.result=defaultValue;
    }else {
        initObj.result=new Date();
    }
    const [itemList, updateItemList] = useReducer(reducer, initObj);
    return {
        isShowPicker:itemList.isShowPicker,
        result:itemList.result,
        action:{}
    }
}