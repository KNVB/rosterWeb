import ShiftDetail from "../classes/ShiftDetail.js";
let shiftDetail=new ShiftDetail();
console.log(await shiftDetail.getShiftDetailList(2024,9));
//console.log(await shiftDetail.getITOShiftDetailList(2024,9));