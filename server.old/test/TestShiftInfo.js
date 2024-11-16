import ShiftInfo from "../classes/ShiftInfo.js";

let shiftInfo = await ShiftInfo.create();
console.log(shiftInfo.essentialShift)
console.log(shiftInfo.activeShiftList);