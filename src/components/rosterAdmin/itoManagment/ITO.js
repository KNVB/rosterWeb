export default function ITO(){
    return {
        availableShift: ["a","b","c","d1","O"],
        blackListedShiftPattern:[""],
        dutyPattern:"operator",
        itoId:"",
        joinDate:(new Date()).toLocaleDateString("en-CA"),
        leaveDate:"2099-12-31",
        name:"",
        post:"",
        workingHourPerDay:""
    }
}