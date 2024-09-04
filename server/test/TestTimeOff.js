import TimeOff from "../classes/TimeOff.js";

let timeOff=new TimeOff()
console.log(JSON.stringify(await timeOff.getTimeOff(2024,9)));