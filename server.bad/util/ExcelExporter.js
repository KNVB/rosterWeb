import ExcelJS from 'exceljs';
export default class ExcelExporter {
    constructor() {
        this.exportRoster = async (rosterData) => {
            let workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile('./template.xlsx');
            let outputFileName=(rosterData.year%100)*100+rosterData.month+".xlsx";
            let worksheet1 = workbook.getWorksheet('Sheet1');
            setCaptionRow(workbook,rosterData.month,rosterData.year);
            return workbook.xlsx.writeFile(outputFileName);
        }
//======================================================================================        
        function setCaptionRow(workbook,rosterMonth,rosterYear){
            let worksheet1 = workbook.getWorksheet('Sheet1');
            let worksheet2 = workbook.getWorksheet('Sheet2');
            worksheet1.getCell('B2').value=(worksheet2.getCell("A"+(1+rosterMonth)).value)+" "+rosterYear;
        }       
    }
}