async function doExport(){
    monthlyCalendar={
        "calendarDateList": [
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 1,
                "dayOfWeek": 1,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 2,
                "dayOfWeek": 2,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 3,
                "dayOfWeek": 3,
            },  
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 4,
                "dayOfWeek": 4,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 5,
                "dayOfWeek": 5,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 6,
                "dayOfWeek": 6,
            },
            {
                "publicHoliday": true,
                "today": false,
                "dateOfMonth": 7,
                "dayOfWeek": 0,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 8,
                "dayOfWeek": 1,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 9,
                "dayOfWeek": 2,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 10,
                "dayOfWeek": 3,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 11,
                "dayOfWeek": 4,
            },
            {
                "publicHoliday": true,
                "today": false,
                "dateOfMonth": 12,
                "dayOfWeek": 5,
            },
            {
                "publicHoliday": true,
                "today": false,
                "dateOfMonth": 13,
                "dayOfWeek": 6,          
            },
            {
                "publicHoliday": true,
                "today": false,
                "dateOfMonth": 14,
                "dayOfWeek": 0,
            },
            {
                "publicHoliday": true,
                "today": false,
                "dateOfMonth": 15,
                "dayOfWeek": 1,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 16,
                "dayOfWeek": 2,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 17,
                "dayOfWeek": 3,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 18,
                "dayOfWeek": 4,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 19,
                "dayOfWeek": 5,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 20,
                "dayOfWeek": 6,
            },
            {
                "publicHoliday": true,
                "today": false,
                "dateOfMonth": 21,
                "dayOfWeek": 0,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 22,
                "dayOfWeek": 1,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 23,
                "dayOfWeek": 2,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 24,
                "dayOfWeek": 3,
        
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 25,
                "dayOfWeek": 4,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 26,
                "dayOfWeek": 5,
            },
            {
                "publicHoliday": false,
                "today": false,
                "dateOfMonth": 27,
                "dayOfWeek": 6,
            },
            {
                "publicHoliday": true,
                "today": false,
                "dateOfMonth": 28,
                "dayOfWeek": 0,
            }
        ],
        "noOfWorkingDay": 18
        }
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./input.xlsx');
    const worksheet1 = workbook.getWorksheet("Sheet1");
    let weekdayNames=['Su','M','T','W','Th','F','S'];
    let weekdayRow=worksheet1.getRow(5);
    for (let i=0;i<this.monthlyCalendar.calendarDateList.length;i++){
        let calendarDate=this.monthlyCalendar.calendarDateList[i];
        weekdayRow.getCell(calendarDate.dateOfMonth+1).value=weekdayNames[calendarDate.dayOfWeek];
        if ((calendarDate.dayOfWeek==6)||(calendarDate.publicHoliday)){
            let address=weekdayRow.getCell(calendarDate.dateOfMonth+1).address;
            console.log(weekdayRow.getCell(calendarDate.dateOfMonth+1).address);
            worksheet1.getCell(address).font = {color:{argb: 'FFFF0000'}, name: "Times New Roman", size: 12};
            break;
        }
    }
    await workbook.xlsx.writeFile('./output.xlsx');   
}
doExport()
.then(()=>{
    console.log("Export Completed.")
})
.catch(error=>{
    console.log("Something Wrong:"+error.stack);
})
