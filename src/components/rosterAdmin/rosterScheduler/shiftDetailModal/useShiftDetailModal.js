import { useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        default:
            break;
    }
    return result;
}
export default function useShiftDetailModal(inShiftDetail){
    const [ tempShiftDetail,updateShiftDetail]=useReducer(reducer,inShiftDetail);
    return {
        tempShiftDetail,
        shiftDetailMethod:{}
    }
}