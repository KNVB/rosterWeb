class ExcelExporter{
    constructor(){
        this.monthlyCalendar;
        this.rosterMonth;
        this.rosterYear;
        this.vacantShiftList=null;
        this.weekdayNames=['Su','M','T','W','Th','F','S'];
        this.doExport=async()=>{
            const ExcelJS = require('exceljs');
            const fs = require('fs'); 
            //res.download('server/template.xlsx');
            
            //fs.copyFileSync('server/template.xlsx','server/output.xlsx');
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile('./input.xlsx');
            const worksheet1 = workbook.getWorksheet("Sheet1");
            const worksheet2 = workbook.getWorksheet("Sheet2");
            //console.log(worksheet1===undefined);
            
            const rosterMonthCell = worksheet1.getCell('B2');
            let monthName=worksheet2.getCell('A'+(1+this.rosterMonth)).value;
            rosterMonthCell.value=monthName +" "+this.rosterYear;

            let dateRow=worksheet1.getRow(6);
            let holidayRow=worksheet1.getRow(4);
            let weekdayRow=worksheet1.getRow(5);

            for (let i=0;i<this.monthlyCalendar.calendarDateList.length;i++){
                let calendarDate=this.monthlyCalendar.calendarDateList[i];
                weekdayRow.getCell(calendarDate.dateOfMonth+1).value=this.weekdayNames[calendarDate.dayOfWeek];
                let address=weekdayRow.getCell(calendarDate.dateOfMonth+1).address;
                if ((calendarDate.dayOfWeek==6)||(calendarDate.publicHoliday)){
                    console.log(weekdayRow.getCell(calendarDate.dateOfMonth+1).address);
                    worksheet1.getCell(address).font = {color:{argb: 'FFFF0000'}, name: "Times New Roman", size: 12};
                    break;
                }
            }
            
            await workbook.xlsx.writeFile('./output.xlsx');
            //await workbook.xlsx.writeFile('server/output.xlsx');
            //res.download('server/output.xlsx','output.xlsx'); 
        }
    }
}
module.exports = ExcelExporter;