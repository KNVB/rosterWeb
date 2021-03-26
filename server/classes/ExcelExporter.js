class ExcelExporter{
    constructor(){
        let centerAligment={ horizontal: 'center',vertical:'middle'};
        let centerWithWrapTextAligment={...centerAligment,...{wrapText:true}};
        let columnWidthList={
			'A':26,
			'AG':11,
			'AH':11,
			'AI':8.25,
			'AJ':8.625,
			'AK':7.875
		};
		
        let fullBorderStyle={top: {style:'thin'},left: {style:'thin'},bottom: {style:'thin'},right: {style:'thin'}};
        let monthNames=[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
        let mergeList=[
			'B1:AF1',
			'B2:AF2',
			'AG2:AH2',
			'AI2:AK2',
			'AG4:AK4',
			'AI5:AJ5',
			'AG5:AG6',
			'AH5:AH6'
		];
		let timesNewRomanFont12={name: "Times New Roman", size: 12};
        let timesNewRomanFont14={name: "Times New Roman", size: 14};
        let weekdayNames=['Su','M','T','W','Th','F','S'];
		
        let ExcelJS = require('exceljs');
		let workbook = new ExcelJS.Workbook();
        
        let captionFont={...timesNewRomanFont14,...{bold:true,underline:true}};
        
        this.monthlyCalendar={};
        this.rosterList={};
        this.rosterMonth=-1;
        this.rosterYear=-1;
        this.vacantShiftList={};

        this.doExport=(outputFileName)=>{
            let worksheet = workbook.addWorksheet('Sheet1');
            setRosterCellWidth(worksheet);
            setCaptionRow(worksheet,this.rosterMonth,this.rosterYear);
            mergeCells(worksheet,this.mergeList);
            setColumnWidth(worksheet,this.columnWidthList);
            setHeaderRow(worksheet,this.monthlyCalendar);
			
            setConditionalFormatting(worksheet,this.rosterList);
            setRosterData(worksheet,this.rosterList);
            
			setVacantShiftRow(worksheet,this.vacantShiftList);
			setFooter(worksheet);
            //console.log(outputFileName);
            return workbook.xlsx.writeFile(outputFileName);
        }
		function genCountIf(address,target){
			let result='(COUNTIF('+address+',"'+target+'"))';
			return result;
		}
        function mergeCells(worksheet){
            mergeList.forEach(mergeAddress=>{
                worksheet.mergeCells(mergeAddress);
            })
        }
        function setColumnWidth(worksheet){
            for (let key in columnWidthList){
                worksheet.getColumn(key).width=columnWidthList[key];
            }
        }
        function setCaptionRow(worksheet,rosterMonth,rosterYear){
            let cell=worksheet.getCell('B1');
    
            cell.value='EMSTF Resident Support & Computer Operation Support Services Team Roster';
            cell.font=captionFont;
            cell.alignment = centerAligment;
            
            cell=worksheet.getCell('B2');
            cell.value=monthNames[rosterMonth]+" "+rosterYear;
            cell.font=captionFont;
            cell.alignment =centerAligment;
        
            cell=worksheet.getCell('AG2');
            cell.font=timesNewRomanFont12;
            cell.value="Approved by SSO(R)5:";
            
            cell=worksheet.getCell('AI2');
            cell.border={bottom: {style:'thin'}};
        }
        function setConditionalFormatting(worksheet,rosterList){
			let firstRowIndex=worksheet.rowCount+1;
			let lastRowIndex=worksheet.rowCount+Object.keys(rosterList).length;
			let address="B"+firstRowIndex+":AF"+lastRowIndex;
			
			worksheet.addConditionalFormatting({
				ref: address,
				rules: [
					{
						type: 'cellIs',
						operator:'equal',
						formulae:['"a"'],
						style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FFFF99CC'}}},
					},
					{
						type: 'cellIs',
						operator:'equal',
						formulae:['"c"'],
						style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FFCCFFCC'}}},
					},
					{
						type: 'containsText',
						operator:'containsText',
						text:"b",
						style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FFFFFFCC'}}},
					},
					{
						type: 'containsText',
						operator:'containsText',
						text:"d",
						style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FFCCFFFF'}}},
					}
				]
			});
		}
		function setFooter(worksheet){
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			let cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFF99CC'},bgColor: { indexed: 46 }};
			cell.value="a : 0800H - 1700H";
			cell.font=timesNewRomanFont14;
			
			cell=worksheet.getCell("S"+worksheet.rowCount);
			cell.value="SITO - Senior Information Technology Officer";
			cell.font=timesNewRomanFont14;
			
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFFCC'},bgColor: { indexed: 46 }};
			cell.value="b : 1630H - 2215H";
			cell.font=timesNewRomanFont14;
			
			cell=worksheet.getCell("S"+worksheet.rowCount);
			cell.value="ITO - Information Technology Officer";
			cell.font=timesNewRomanFont14;
			
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFFCC'},bgColor: { indexed: 46 }};
			cell.value="b1: 1500H - 2215H";
			cell.font=timesNewRomanFont14;

			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFCCFFCC'},bgColor: { indexed: 46 }};
			cell.value="c : 2145H - 0830H (the next day)";
			cell.font=timesNewRomanFont14;
			
			cell=worksheet.getCell("S"+(worksheet.rowCount));
			cell.value="Distrubution List :";
			cell.font=timesNewRomanFont12;
			
			cell=worksheet.getCell("X"+(worksheet.rowCount));
			cell.value="SSO(R)5";
			cell.font=timesNewRomanFont12;			
			
			cell=worksheet.getCell("AB"+(worksheet.rowCount));
			cell.value="CSA(CS)";
			cell.font=timesNewRomanFont12;	
			
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFCCFFFF'},bgColor: { indexed: 46 }};
			cell.value="d : 0800H - 1800H (on weekdays)";
			cell.font=timesNewRomanFont14;
			
			cell=worksheet.getCell("X"+(worksheet.rowCount));
			cell.value="SO(R)51";
			cell.font=timesNewRomanFont12;

			cell=worksheet.getCell("AB"+(worksheet.rowCount));
			cell.value="KP";
			cell.font=timesNewRomanFont12;
			
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFCCFFFF'},bgColor: { indexed: 46 }};
			cell.value="d1 : 0800H - 1700H (on weekdays)";
			cell.font=timesNewRomanFont14;
			
			cell=worksheet.getCell("X"+(worksheet.rowCount));
			cell.value="SEO(R)51";
			cell.font=timesNewRomanFont12;

			cell=worksheet.getCell("AB"+(worksheet.rowCount));
			cell.value="CLK";
			cell.font=timesNewRomanFont12;
			
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFCCFFFF'},bgColor: { indexed: 46 }};
			cell.value="d2 : 0900H - 1800H (on weekdays)";
			cell.font=timesNewRomanFont14;
			
			cell=worksheet.getCell("X"+(worksheet.rowCount));
			cell.value="SEO(R)52";
			cell.font=timesNewRomanFont12;

			cell=worksheet.getCell("AB"+(worksheet.rowCount));
			cell.value="GR";
			cell.font=timesNewRomanFont12;
			
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFCCFFFF'},bgColor: { indexed: 46 }};
			cell.value="d3 : 0800H - 1648H (on weekdays)";
			cell.font=timesNewRomanFont14;
			
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));
			cell.fill={type: 'pattern',pattern: 'solid',fgColor: { argb: 'FFCC99FF' },bgColor: { indexed: 46 }};
			cell.value="s : sick leave standby";
			cell.font=timesNewRomanFont14;
			
			worksheet.mergeCells("A"+(worksheet.rowCount+1)+":L"+(worksheet.rowCount+1));
			cell=worksheet.getCell("A"+(worksheet.rowCount));			
			cell.value="O : dayoff";
			cell.font=timesNewRomanFont14;

			cell=worksheet.getCell("A"+(worksheet.rowCount+2));
			cell.value="* Staff in former IT structure of EMSTF, the working hours be 45 hours per week";
			cell.font={...timesNewRomanFont12,...{italic: true}};
		}
		function setHeaderRow(worksheet,monthlyCalendar){
            let calendarDate,cell;          

            cell=worksheet.getCell('A4');
            cell.value="Holidays";
            cell.font = timesNewRomanFont12;
            cell.border=fullBorderStyle;
            worksheet.getCell('AG4').border=fullBorderStyle;

//=============================================================================            
            cell=worksheet.getCell('A5');
            cell.value="Days";
            cell.font = timesNewRomanFont12;
            cell.border=fullBorderStyle;

            cell=worksheet.getCell('AG5');
            cell.font =timesNewRomanFont12;
            cell.border=fullBorderStyle;
            cell.value="Total\nHour";
            cell.alignment = centerWithWrapTextAligment;

            cell=worksheet.getCell('AH5');
            cell.font =timesNewRomanFont12;
            cell.border=fullBorderStyle;
            cell.value="Actual\nHour";
            cell.alignment = centerWithWrapTextAligment;

            cell=worksheet.getCell('AI5');
            cell.value="Hour Off Due";
            cell.border=fullBorderStyle;
            cell.font = timesNewRomanFont12;
            cell.alignment = centerWithWrapTextAligment;
            
            worksheet.getCell('AK5').border=fullBorderStyle;
//========================================================================================
            cell=worksheet.getCell('A6');
            cell.value='                              Date \nMember .';
            cell.font = timesNewRomanFont12;
            cell.border={...fullBorderStyle,...{diagonal:{ style: 'thin', color: { indexed: 64 }, up: false, down: true }}};
            cell.alignment = {horizontal: 'distributed', vertical: 'top', wrapText: true};

            cell=worksheet.getCell('AI6');
            cell.value="Last Month";
            cell.font = timesNewRomanFont12;
            cell.border=fullBorderStyle;
            cell.alignment = centerWithWrapTextAligment;
            
            cell=worksheet.getCell('AJ6');
            cell.value="This Month";
            cell.font = timesNewRomanFont12;
            cell.border=fullBorderStyle;
            cell.alignment = centerWithWrapTextAligment;
            
            cell=worksheet.getCell('AK6');
            cell.value="Total";
            cell.font = timesNewRomanFont12;
            cell.border=fullBorderStyle;
            cell.alignment = centerWithWrapTextAligment;
            
            cell=worksheet.getCell('AL6');
            cell.value="a";
            cell.font = timesNewRomanFont12
            
            cell=worksheet.getCell('AM6');
            cell.value="b";
            cell.font = timesNewRomanFont12
            
            cell=worksheet.getCell('AN6');
            cell.value="c";
            cell.font = timesNewRomanFont12;
            
            cell=worksheet.getCell('AO6');
            cell.value="d1";
            cell.font = timesNewRomanFont12;
            
            cell=worksheet.getCell('AP6');
            cell.value="o";
            cell.font = timesNewRomanFont12;
            
            cell=worksheet.getCell('AQ6');
            cell.value="No. of working day";
            cell.font = timesNewRomanFont12;
//=========================================================================================
            let holidayRow=worksheet.getRow(4);
            let weekdayRow=worksheet.getRow(5);
            let dateRow=worksheet.getRow(6);
            for (let i=2;i<33;i++){ 
                dateRow.getCell(i).alignment = centerAligment;
                holidayRow.getCell(i).alignment = centerAligment;
                weekdayRow.getCell(i).alignment = centerAligment;

                dateRow.getCell(i).border=fullBorderStyle;
                holidayRow.getCell(i).border=fullBorderStyle;
                weekdayRow.getCell(i).border=fullBorderStyle;
                
                holidayRow.getCell(i).font = timesNewRomanFont12;
                weekdayRow.getCell(i).font = timesNewRomanFont12;
                dateRow.getCell(i).font = timesNewRomanFont12;
            }
            for (let date=0;date< monthlyCalendar.calendarDateList.length;date++){
                calendarDate=monthlyCalendar.calendarDateList[date];
                dateRow.getCell(date+2).value=calendarDate.dateOfMonth;
                dateRow.getCell(date+2).alignment = { horizontal: 'center',vertical:'bottom'};
                weekdayRow.getCell(date+2).value=weekdayNames[calendarDate.dayOfWeek];
                weekdayRow.getCell(date+2).alignment = centerAligment;
                
                if ((calendarDate.dayOfWeek==6)||(calendarDate.publicHoliday)){
                    holidayRow.getCell(date+2).value="PH";
                    holidayRow.getCell(date+2).font={bold:true,color:{argb:"FFFF0000"},name: 'Times New Roman',size: 12};
                    weekdayRow.getCell(date+2).font={bold:true,color:{argb:"FFFF0000"},name: 'Times New Roman',size: 12};
                    holidayRow.getCell(date+2).alignment = centerAligment;
                }
            }
        }
        function setRosterCellWidth(worksheet){
            for (let i=2;i<33;i++){
                worksheet.getColumn(i).width=3.5;
            }
        }
        function setRosterData(worksheet,rosterList){
            let address,cell,i;
            let formula="";
            //let itoCount=itoIdList.length;
            let j,row;
            
			for (let itoId in rosterList){
				let roster=rosterList[itoId];
				row=worksheet.getRow(worksheet.rowCount+1);
				cell=row.getCell(1);
				cell.value=roster.itoName+"\n"+roster.itoPostName+" Extn. 2458";
				cell.font=timesNewRomanFont12;
				cell.border=fullBorderStyle;
				cell.alignment={wrapText: true};
				for (i=1;i<32;i++){
					cell=row.getCell(i+1);
					cell.alignment=centerAligment;
					cell.border=fullBorderStyle;
					cell.font=timesNewRomanFont14;
					if (roster.shiftList[i]){
						cell.value=roster.shiftList[i];
					}
				}
				cell=worksheet.getCell("AG"+(worksheet.rowCount));
				cell.alignment=centerAligment;
				cell.border=fullBorderStyle;
				cell.font=timesNewRomanFont14;
				cell.numFmt = '0.00';
				cell.value=roster.totalHour;
				
				
				address="B"+worksheet.rowCount+":AF"+worksheet.rowCount;
				formula=genCountIf(address,'a')+"*9+";
				formula+=genCountIf(address,'b')+"*5.75+";
				formula+=genCountIf(address,'b1')+"*7.25+";
				formula+=genCountIf(address,'c')+"*10.75+";
				formula+=genCountIf(address,'d')+"*9+";
				formula+=genCountIf(address,'d1')+"*8+";
				formula+=genCountIf(address,'d2')+"*8+";
				formula+=genCountIf(address,'d3')+"*7.8";
			
				cell=worksheet.getCell("AH"+(worksheet.rowCount));
				cell.alignment=centerAligment;
				cell.border=fullBorderStyle;
				cell.font=timesNewRomanFont14;				
				cell.numFmt = '0.00';
				cell.value={"formula":formula};
				
				cell=worksheet.getCell("AI"+(worksheet.rowCount));
				cell.alignment=centerAligment;
				cell.border=fullBorderStyle;
				cell.font=timesNewRomanFont14;
				cell.numFmt = '+#0.##;-#0.##';
				cell.value=roster.lastMonthBalance;
				
				formula="AH"+(worksheet.rowCount)+"-AG"+(worksheet.rowCount);
				cell=worksheet.getCell("AJ"+(worksheet.rowCount));
				cell.alignment=centerAligment;
				cell.border=fullBorderStyle;
				cell.font=timesNewRomanFont14;
				cell.numFmt = '0.00';
				cell.value={"formula":formula,result:roster.thisMonthHourTotal};

				formula="AJ"+(worksheet.rowCount)+"+AI"+(worksheet.rowCount);
				cell=worksheet.getCell("AK"+(worksheet.rowCount));
				cell.alignment=centerAligment;
				cell.border=fullBorderStyle;
				cell.font=timesNewRomanFont14;
				cell.numFmt = '0.00';
				cell.value={"formula":formula};
				
				formula=genCountIf(address,'a');
				cell=worksheet.getCell("AL"+(worksheet.rowCount));
				cell.value={"formula":formula};
				
				formula=genCountIf(address,'b')+"+";
				formula+=genCountIf(address,'b1');
				cell=worksheet.getCell("AM"+(worksheet.rowCount));
				cell.value={"formula":formula};
				
				formula=genCountIf(address,'c');
				cell=worksheet.getCell("AN"+(worksheet.rowCount));
				cell.value={"formula":formula};
				
				formula=genCountIf(address,'d')+"+";
				formula+=genCountIf(address,'d1')+"+";
				formula+=genCountIf(address,'d2')+"+";
				formula+=genCountIf(address,'d3');
				cell=worksheet.getCell("AO"+(worksheet.rowCount));
				cell.value={"formula":formula};
				
				formula=genCountIf(address,'O');
				cell=worksheet.getCell("AP"+(worksheet.rowCount));
				cell.value={"formula":formula};
				
				formula='SUM(AL'+(worksheet.rowCount)+':AP'+(worksheet.rowCount)+')';
				cell=worksheet.getCell("AQ"+(worksheet.rowCount));
				cell.value={"formula":formula};
			}
        }
		function setVacantShiftRow(worksheet,vacantShiftList){
			let cell=worksheet.getCell("A"+(worksheet.rowCount+1));
			cell.alignment={ horizontal: 'right',vertical:'middle'};
			cell.value="Vacant Shifts";
			cell.font={
				bold: true,
				size: 12,
				color: { indexed: 53 },
				name: 'Times New Roman',
				family: 1
			};
			
            let vacantRow=worksheet.getRow(worksheet.rowCount);
			for (let i=2;i<33;i++){
				cell=vacantRow.getCell(i);
				cell.alignment=centerAligment;
				cell.font=timesNewRomanFont12;
				
				if (vacantShiftList[i-2]){
					cell.value=vacantShiftList[i-2];
				}
			}
		}
	}
    
}
module.exports = ExcelExporter;
/*
let excelExporter=new ExcelExporter();

excelExporter.monthlyCalendar={
    "calendarDateList": [
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 1,
            "dayOfWeek": 1,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 18,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "庚寅",
            "chineseDayName": "戊申"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 2,
            "dayOfWeek": 2,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 19,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "庚寅",
            "chineseDayName": "己酉"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 3,
            "dayOfWeek": 3,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 20,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "庚寅",
            "chineseDayName": "庚戌"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 4,
            "dayOfWeek": 4,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 21,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "庚寅",
            "chineseDayName": "辛亥"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 5,
            "dayOfWeek": 5,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 22,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "壬子",
            "solarTermInfo": "驚蟄"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 6,
            "dayOfWeek": 6,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 23,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "癸丑"
        },
        {
            "publicHoliday": true,
            "today": false,
            "dateOfMonth": 7,
            "dayOfWeek": 0,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 24,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "甲寅"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 8,
            "dayOfWeek": 1,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 25,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "乙卯"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 9,
            "dayOfWeek": 2,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 26,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "丙辰"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 10,
            "dayOfWeek": 3,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 27,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "丁巳"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 11,
            "dayOfWeek": 4,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 28,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "戊午"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 12,
            "dayOfWeek": 5,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 29,
            "lunarMonth": 1,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "己未"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 13,
            "dayOfWeek": 6,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 1,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "庚申"
        },
        {
            "publicHoliday": true,
            "today": false,
            "dateOfMonth": 14,
            "dayOfWeek": 0,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 2,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "辛酉"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 15,
            "dayOfWeek": 1,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 3,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "壬戌"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 16,
            "dayOfWeek": 2,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 4,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "癸亥"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 17,
            "dayOfWeek": 3,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 5,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "甲子"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 18,
            "dayOfWeek": 4,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 6,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "乙丑"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 19,
            "dayOfWeek": 5,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 7,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "丙寅"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 20,
            "dayOfWeek": 6,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 8,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "丁卯",
            "solarTermInfo": "春分"
        },
        {
            "publicHoliday": true,
            "today": false,
            "dateOfMonth": 21,
            "dayOfWeek": 0,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 9,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "戊辰"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 22,
            "dayOfWeek": 1,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 10,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "己巳"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 23,
            "dayOfWeek": 2,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 11,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "庚午"
        },
        {
            "publicHoliday": false,
            "today": true,
            "dateOfMonth": 24,
            "dayOfWeek": 3,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 12,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "辛未"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 25,
            "dayOfWeek": 4,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 13,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "壬申"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 26,
            "dayOfWeek": 5,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 14,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "癸酉"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 27,
            "dayOfWeek": 6,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 15,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "甲戌"
        },
        {
            "publicHoliday": true,
            "today": false,
            "dateOfMonth": 28,
            "dayOfWeek": 0,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 16,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "乙亥"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 29,
            "dayOfWeek": 1,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 17,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "丙子"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 30,
            "dayOfWeek": 2,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 18,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "丁丑"
        },
        {
            "publicHoliday": false,
            "today": false,
            "dateOfMonth": 31,
            "dayOfWeek": 3,
            "animalOfYear": "牛",
            "month": 2,
            "year": 2021,
            "lunarDate": 19,
            "lunarMonth": 2,
            "lunarYear": 2021,
            "isLeap": false,
            "chineseYearName": "辛丑",
            "chineseMonthName": "辛卯",
            "chineseDayName": "戊寅"
        }
    ],
    "noOfWorkingDay": 23
}
excelExporter.rosterList={
    "ITO1_1999-01-01": {
        "lastMonthBalance": 5.55,
        "thisMonthBalance": -5.350000000000006,
        "workingHourPerDay": 7.8,
        "shiftList": {
            "1": "O",
            "2": "a",
            "3": "a",
            "4": "a",
            "5": "b",
            "6": "c",
            "7": "O",
            "8": "O",
            "9": "O",
            "10": "b",
            "11": "b",
            "12": "O",
            "13": "O",
            "14": "c",
            "15": "c",
            "16": "O",
            "17": "a",
            "18": "d1",
            "19": "b",
            "20": "c",
            "21": "O",
            "22": "b",
            "23": "c",
            "24": "O",
            "25": "c",
            "26": "c",
            "27": "O",
            "28": "a",
            "29": "b",
            "30": "b",
            "31": "O"
        },
        "availableShiftList": [
            "a",
            "b",
            "c",
            "d1",
            "O",
            "d2"
        ],
        "itoName": "TSANG Ka Shing Gary",
        "itoPostName": "ITO1",
        "actualWorkingHour": 168.5,
        "totalHour": 179.4,
        "thisMonthHourTotal": -10.900000000000006,
        "shiftCountList": {
            "aShiftCount": 5,
            "bxShiftCount": 7,
            "cShiftCount": 7,
            "dxShiftCount": 1
        },
        "actualNoOfWorkingDay": 20
    },
    "ITO3_2017-10-18": {
        "lastMonthBalance": 8.7,
        "thisMonthBalance": -9.3,
        "workingHourPerDay": 9,
        "shiftList": {
            "1": "a",
            "2": "d",
            "3": "c",
            "4": "c",
            "5": "O",
            "6": "O",
            "7": "O",
            "8": "a",
            "9": "a",
            "10": "c",
            "11": "c",
            "12": "O",
            "13": "b1",
            "14": "b1",
            "15": "O",
            "16": "a",
            "17": "b1",
            "18": "c",
            "19": "O",
            "20": "O",
            "21": "O",
            "22": "a",
            "23": "d",
            "24": "b1",
            "25": "b1",
            "26": "O",
            "27": "b1",
            "28": "c",
            "29": "O",
            "30": "a",
            "31": "a"
        },
        "availableShiftList": [
            "a",
            "b1",
            "c",
            "d",
            "O"
        ],
        "itoName": "YUNG Kin Shing Tommy",
        "itoPostName": "ITO3",
        "actualWorkingHour": 189,
        "totalHour": 207,
        "thisMonthHourTotal": -18,
        "shiftCountList": {
            "aShiftCount": 7,
            "bxShiftCount": 6,
            "cShiftCount": 6,
            "dxShiftCount": 2
        },
        "actualNoOfWorkingDay": 21
    },
    "ITO4_1999-01-01": {
        "lastMonthBalance": 9.3,
        "thisMonthBalance": -2.100000000000005,
        "workingHourPerDay": 7.8,
        "shiftList": {
            "1": "O",
            "2": "c",
            "3": "O",
            "4": "b",
            "5": "d1",
            "6": "a",
            "7": "c",
            "8": "O",
            "9": "b",
            "10": "d1",
            "11": "d1",
            "12": "a",
            "13": "a",
            "14": "O",
            "15": "a",
            "16": "b",
            "17": "c",
            "18": "O",
            "19": "O",
            "20": "a",
            "21": "c",
            "22": "O",
            "23": "b",
            "24": "c",
            "25": "O",
            "26": "b",
            "27": "c",
            "28": "O",
            "29": "O",
            "30": "O",
            "31": "b"
        },
        "availableShiftList": [
            "a",
            "b",
            "c",
            "d1",
            "O",
            "d2"
        ],
        "itoName": "HUEN Kwai-leung Andrew",
        "itoPostName": "ITO4",
        "actualWorkingHour": 168,
        "totalHour": 179.4,
        "thisMonthHourTotal": -11.400000000000006,
        "shiftCountList": {
            "aShiftCount": 5,
            "bxShiftCount": 6,
            "cShiftCount": 6,
            "dxShiftCount": 3
        },
        "actualNoOfWorkingDay": 20
    },
    "ITO6_1999-01-01": {
        "lastMonthBalance": 1.43,
        "thisMonthBalance": -7.970000000000006,
        "workingHourPerDay": 7.8,
        "shiftList": {
            "1": "b",
            "2": "b",
            "3": "b",
            "4": "O",
            "5": "c",
            "6": "O",
            "7": "a",
            "8": "b",
            "9": "O",
            "10": "a",
            "11": "a",
            "12": "c",
            "13": "O",
            "14": "a",
            "15": "b",
            "16": "O",
            "17": "d1",
            "18": "b",
            "19": "c",
            "20": "O",
            "21": "a",
            "22": "c",
            "23": "O",
            "24": "a",
            "25": "a",
            "26": "O",
            "27": "O",
            "28": "O",
            "29": "O",
            "30": "c",
            "31": "c"
        },
        "availableShiftList": [
            "a",
            "b",
            "c",
            "d1",
            "O",
            "d2"
        ],
        "itoName": "LI Chi-wai Joseph",
        "itoPostName": "ITO6",
        "actualWorkingHour": 170,
        "totalHour": 179.4,
        "thisMonthHourTotal": -9.400000000000006,
        "shiftCountList": {
            "aShiftCount": 7,
            "bxShiftCount": 6,
            "cShiftCount": 6,
            "dxShiftCount": 1
        },
        "actualNoOfWorkingDay": 20
    },
    "ITO8_1999-01-01": {
        "lastMonthBalance": 4.55,
        "thisMonthBalance": -6.850000000000006,
        "workingHourPerDay": 7.8,
        "shiftList": {
            "1": "c",
            "2": "O",
            "3": "O",
            "4": "O",
            "5": "a",
            "6": "b",
            "7": "b",
            "8": "c",
            "9": "c",
            "10": "d1",
            "11": "d1",
            "12": "b",
            "13": "c",
            "14": "O",
            "15": "O",
            "16": "c",
            "17": "d1",
            "18": "O",
            "19": "a",
            "20": "b",
            "21": "b",
            "22": "O",
            "23": "a",
            "24": "O",
            "25": "O",
            "26": "a",
            "27": "a",
            "28": "b",
            "29": "c",
            "30": "O",
            "31": "O"
        },
        "availableShiftList": [
            "a",
            "b",
            "c",
            "d1",
            "O",
            "d2"
        ],
        "itoName": "CHAN Tai-hin Jimmy",
        "itoPostName": "ITO8",
        "actualWorkingHour": 168,
        "totalHour": 179.4,
        "thisMonthHourTotal": -11.400000000000006,
        "shiftCountList": {
            "aShiftCount": 5,
            "bxShiftCount": 6,
            "cShiftCount": 6,
            "dxShiftCount": 3
        },
        "actualNoOfWorkingDay": 20
    }
}
excelExporter.vacantShiftList={
    "0": "",
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
    "6": "",
    "7": "",
    "8": "",
    "9": "",
    "10": "",
    "11": "",
    "12": "",
    "13": "",
    "14": "",
    "15": "",
    "16": "",
    "17": "a",
    "18": "",
    "19": "",
    "20": "",
    "21": "",
    "22": "",
    "23": "",
    "24": "",
    "25": "",
    "26": "",
    "27": "",
    "28": "a",
    "29": "",
    "30": ""
}
excelExporter.rosterMonth=2;
excelExporter.rosterYear=2021;
console.log("Export Excel Start");
excelExporter.doExport('./output.xlsx')
.then(()=>{
    console.log("export complete");
})
.catch(error=>{
    console.log("Some wrong:"+error);
});
*/