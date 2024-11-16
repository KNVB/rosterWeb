import TimeOff from "../classes/TimeOff.js";

let timeOff=new TimeOff()
console.log(JSON.stringify(await timeOff.getTimeOffList(2024,9)));