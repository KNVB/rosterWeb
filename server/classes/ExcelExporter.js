export default class ExcelExporter{
    constructor(res){
        const ExcelJS = require('exceljs');
        const fs = require('fs'); 
        //res.download('server/template.xlsx');
        
        //fs.copyFileSync('server/template.xlsx','server/output.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile('server/template.xlsx');
        const worksheet1 = workbook.getWorksheet("Sheet1");
        const worksheet2 = workbook.getWorksheet("Sheet2");
        console.log(worksheet1===undefined);
        
        const rosterMonthCell = worksheet1.getCell('B2');
        let monthName=worksheet2.getCell('A10').value;
        rosterMonthCell.value=monthName +" 2021";
        await workbook.xlsx.writeFile('server/output.xlsx');
        res.download('server/output.xlsx','output.xlsx'); 
    }
}
