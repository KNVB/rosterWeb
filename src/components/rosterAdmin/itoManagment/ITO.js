export default function ITO(){
    return {
        availableShift: ["a","b","c","d1","O"],
        blackListedShiftPattern:[""],
        dutyPattern:"",
        itoId:"",
        joinDate:new Date(),
        leaveDate:new Date("2099-12-31"),
        name:"",
        post:"",
        workingHourPerDay:""
    }
}