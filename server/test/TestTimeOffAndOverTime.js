import TimeOffAndOverTime from "../classes/TimeOffAndOverTime.js";
let timeOffAndOvertime =new TimeOffAndOverTime();
console.log(JSON.stringify(await timeOffAndOvertime.getTimeOffAndOverTimeSummary(2024,9)));