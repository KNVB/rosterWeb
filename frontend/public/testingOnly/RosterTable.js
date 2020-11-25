class RosterTable
{
	constructor(container)
	{
		var self=this;
		this.actualHourCellClassName="actualHourCell"; 
		this.alignCenterClassName="alignCenter"; 
		this.alignLeftClassName="alignLeft";
		this.aShiftColorClassName="aShiftColor";
		this.borderCellClassName="borderCell";
		this.bShiftColorClassName="bShiftColor";
		this.clickableClassName="clickable";
		this.cShiftColorClassName="cShiftColor";
		this.cursorCellClassName="cursorCell";
		this.dateCellClassName="dateCell";
		this.dShiftColorClassName="dShiftColor";
		this.highlightClassName="highlight";
		this.lastMonthCellClassName="lastMonthCell";
		this.nameCellClassName="nameCell";
		this.noOfWorkingDayClassName="noOfWorkingDay";
		this.oShiftColorClassName="oShiftColor";
		this.phCellClassName="phCell";
		this.rosterMonthSelectCellClassName="rosterMonthSelectCell";
		this.shiftCellClassName="shiftCell";
		this.sickLeaveColorClassName="sickLeaveColor";
		this.thisMonthCellClassName="thisMonthCell";
		this.titleCellClassName="titleCell";
		this.totalCellClassName="totalCell";
		this.totalHourCellClassName="totalHourCell";
		this.totalNoOfCellClassName="totalNoOfCell";
		this.underlineTextClassName="underlineText"; 
		
		this.shiftHourCount={"a":9.0,"b":5.75,"b1":7.25,"c":10.75,"d":9.0,"d1":8.0,"d2":8.0,"d3":7.8,"O":0.0};
		this.monthNames={1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"};
		this.dateObjList={"28":{"festivalInfo":"","lunarDate":24,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"丙申","solarTermInfo":"","dayOfWeek":"THURSDAY","leap":false,"year":2019,"month":2,"dayOfMonth":28},"27":{"festivalInfo":"","lunarDate":23,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"乙未","solarTermInfo":"","dayOfWeek":"WEDNESDAY","leap":false,"year":2019,"month":2,"dayOfMonth":27},"26":{"festivalInfo":"","lunarDate":22,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"甲午","solarTermInfo":"","dayOfWeek":"TUESDAY","leap":false,"year":2019,"month":2,"dayOfMonth":26},"25":{"festivalInfo":"","lunarDate":21,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"癸巳","solarTermInfo":"","dayOfWeek":"MONDAY","leap":false,"year":2019,"month":2,"dayOfMonth":25},"24":{"festivalInfo":"","lunarDate":20,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"壬辰","solarTermInfo":"","dayOfWeek":"SUNDAY","leap":false,"year":2019,"month":2,"dayOfMonth":24},"23":{"festivalInfo":"","lunarDate":19,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"辛卯","solarTermInfo":"","dayOfWeek":"SATURDAY","leap":false,"year":2019,"month":2,"dayOfMonth":23},"22":{"festivalInfo":"","lunarDate":18,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"庚寅","solarTermInfo":"","dayOfWeek":"FRIDAY","leap":false,"year":2019,"month":2,"dayOfMonth":22},"21":{"festivalInfo":"","lunarDate":17,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"己丑","solarTermInfo":"","dayOfWeek":"THURSDAY","leap":false,"year":2019,"month":2,"dayOfMonth":21},"20":{"festivalInfo":"","lunarDate":16,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"戊子","solarTermInfo":"","dayOfWeek":"WEDNESDAY","leap":false,"year":2019,"month":2,"dayOfMonth":20},"19":{"festivalInfo":"","lunarDate":15,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"丁亥","solarTermInfo":"雨水","dayOfWeek":"TUESDAY","leap":false,"year":2019,"month":2,"dayOfMonth":19},"18":{"festivalInfo":"","lunarDate":14,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"丙戌","solarTermInfo":"","dayOfWeek":"MONDAY","leap":false,"year":2019,"month":2,"dayOfMonth":18},"17":{"festivalInfo":"","lunarDate":13,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"乙酉","solarTermInfo":"","dayOfWeek":"SUNDAY","leap":false,"year":2019,"month":2,"dayOfMonth":17},"16":{"festivalInfo":"","lunarDate":12,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"甲申","solarTermInfo":"","dayOfWeek":"SATURDAY","leap":false,"year":2019,"month":2,"dayOfMonth":16},"15":{"festivalInfo":"","lunarDate":11,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"癸未","solarTermInfo":"","dayOfWeek":"FRIDAY","leap":false,"year":2019,"month":2,"dayOfMonth":15},"14":{"festivalInfo":"","lunarDate":10,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"壬午","solarTermInfo":"","dayOfWeek":"THURSDAY","leap":false,"year":2019,"month":2,"dayOfMonth":14},"13":{"festivalInfo":"","lunarDate":9,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"辛巳","solarTermInfo":"","dayOfWeek":"WEDNESDAY","leap":false,"year":2019,"month":2,"dayOfMonth":13},"12":{"festivalInfo":"","lunarDate":8,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"庚辰","solarTermInfo":"","dayOfWeek":"TUESDAY","leap":false,"year":2019,"month":2,"dayOfMonth":12},"11":{"festivalInfo":"","lunarDate":7,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"己卯","solarTermInfo":"","dayOfWeek":"MONDAY","leap":false,"year":2019,"month":2,"dayOfMonth":11},"10":{"festivalInfo":"","lunarDate":6,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"戊寅","solarTermInfo":"","dayOfWeek":"SUNDAY","leap":false,"year":2019,"month":2,"dayOfMonth":10},"9":{"festivalInfo":"","lunarDate":5,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"丁丑","solarTermInfo":"","dayOfWeek":"SATURDAY","leap":false,"year":2019,"month":2,"dayOfMonth":9},"8":{"festivalInfo":"","lunarDate":4,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"丙子","solarTermInfo":"","dayOfWeek":"FRIDAY","leap":false,"year":2019,"month":2,"dayOfMonth":8},"7":{"festivalInfo":"年初三","lunarDate":3,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":true,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"乙亥","solarTermInfo":"","dayOfWeek":"THURSDAY","leap":false,"year":2019,"month":2,"dayOfMonth":7},"6":{"festivalInfo":"年初二","lunarDate":2,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":true,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"甲戌","solarTermInfo":"","dayOfWeek":"WEDNESDAY","leap":false,"year":2019,"month":2,"dayOfMonth":6},"5":{"festivalInfo":"大年初一","lunarDate":1,"lunarYear":2019,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":true,"chineseYearName":"戊戌","lunarMonth":1,"chineseMonthName":"丙寅","chineseDayName":"癸酉","solarTermInfo":"","dayOfWeek":"TUESDAY","leap":false,"year":2019,"month":2,"dayOfMonth":5},"4":{"festivalInfo":"","lunarDate":30,"lunarYear":2018,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":12,"chineseMonthName":"丙寅","chineseDayName":"壬申","solarTermInfo":"立春","dayOfWeek":"MONDAY","leap":false,"year":2019,"month":2,"dayOfMonth":4},"3":{"festivalInfo":"","lunarDate":29,"lunarYear":2018,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":12,"chineseMonthName":"乙丑","chineseDayName":"辛未","solarTermInfo":"","dayOfWeek":"SUNDAY","leap":false,"year":2019,"month":2,"dayOfMonth":3},"2":{"festivalInfo":"","lunarDate":28,"lunarYear":2018,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":12,"chineseMonthName":"乙丑","chineseDayName":"庚午","solarTermInfo":"","dayOfWeek":"SATURDAY","leap":false,"year":2019,"month":2,"dayOfMonth":2},"1":{"festivalInfo":"","lunarDate":27,"lunarYear":2018,"animalOfYear":"狗","chineseHourName":"子","publicHoliday":false,"chineseYearName":"戊戌","lunarMonth":12,"chineseMonthName":"乙丑","chineseDayName":"己巳","solarTermInfo":"","dayOfWeek":"FRIDAY","leap":false,"year":2019,"month":2,"dayOfMonth":1}};

		this.rosterList={"ITO1_1999-01-01":{"lastMonthBalance":17.85,"thisMonthBalance":0.0,"shiftList":{"1":"a","2":"O","3":"O","4":"a","5":"O","6":"O","7":"b","8":"b","9":"c","10":"O","11":"b","12":"O","13":"b","14":"c","15":"O","16":"O","17":"a","18":"a","19":"O","20":"b","21":"c","22":"O","23":"O","24":"O","25":"a","26":"c","27":"c","28":"O"},"previousMonthShiftList":{"1":"a","2":"a","3":"O","4":"c","5":"O","6":"O"},"itoname":"TSANG Ka Shing Gary","itopostName":"ITO1","itoworkingHourPerDay":7.8},"ITO3_2017-10-18":{"lastMonthBalance":-8.3,"thisMonthBalance":0.0,"shiftList":{"1":"O","2":"b1","3":"c","4":"O","5":"b1","6":"c","7":"c","8":"O","9":"O","10":"b1","11":"c","12":"O","13":"a","14":"a","15":"b1","16":"c","17":"O","18":"O","19":"a","20":"a","21":"O","22":"a","23":"b1","24":"b1","25":"c","26":"O","27":"O","28":"a"},"previousMonthShiftList":{"1":"c","2":"c","3":"O","4":"a","5":"O","6":"c"},"itoname":"YUNG Kin Shing Tommy","itopostName":"ITO3","itoworkingHourPerDay":9.0},"ITO4_1999-01-01":{"lastMonthBalance":-2.65,"thisMonthBalance":0.0,"shiftList":{"1":"O","2":"a","3":"b","4":"c","5":"d1","6":"b","7":"O","8":"O","9":"a","10":"c","11":"O","12":"b","13":"c","14":"O","15":"O","16":"a","17":"c","18":"O","19":"b","20":"c","21":"O","22":"O","23":"a","24":"O","25":"O","26":"b","27":"b","28":"c"},"previousMonthShiftList":{"1":"O","2":"O","3":"O","4":"b","5":"c","6":"d1"},"itoname":"HUEN Kwai-leung Andrew","itopostName":"ITO4","itoworkingHourPerDay":7.8},"ITO6_1999-01-01":{"lastMonthBalance":1.98,"thisMonthBalance":0.0,"shiftList":{"1":"c","2":"O","3":"a","4":"d1","5":"a","6":"a","7":"d1","8":"c","9":"O","10":"a","11":"d1","12":"c","13":"O","14":"b","15":"c","16":"O","17":"O","18":"b","19":"c","20":"O","21":"b","22":"c","23":"O","24":"a","25":"b","26":"O","27":"O","28":"b"},"previousMonthShiftList":{"1":"O","2":"O","3":"b","4":"O","5":"b","6":"b"},"itoname":"LI Chi-wai Joseph","itopostName":"ITO6","itoworkingHourPerDay":7.8},"ITO8_1999-01-01":{"lastMonthBalance":7.85,"thisMonthBalance":0.0,"shiftList":{"1":"b","2":"c","3":"O","4":"b","5":"c","6":"O","7":"a","8":"a","9":"b","10":"O","11":"a","12":"a","13":"O","14":"O","15":"O","16":"b","17":"b","18":"c","19":"O","20":"O","21":"O","22":"b","23":"c","24":"c","25":"O","26":"a","27":"d1","28":"d1"},"previousMonthShiftList":{"1":"b","2":"b","3":"c","4":"O","5":"d1","6":"d1"},"itoname":"CHAN Tai-hin Jimmy","itopostName":"ITO8","itoworkingHourPerDay":7.8}};
		
		this.monthPicker=null;
		this.rosterBody=document.createElement("tbody");
		this.rosterFooter=document.createElement("tFoot");
		this.rosterHeader=document.createElement("thead");
		
		this.rosterTable=document.createElement("table");
		this.rosterMonthRow,this.rosterHolidayRow,this.rosterWeekDayRow,this.rosterDateRow;
		this.showNoOfPrevDate=0;
		
		this.rosterBody.id="rosterBody";
		this.rosterFooter.id="rosterFooter";
		this.rosterHeader.id="rosterHeader";
		this.rosterTable.id="rosterTable";
		
		this.rosterTable.append(this.rosterHeader);
		
		$(this.rosterTable).attr("border","0");
		this.container=container;
		
		container.append(this.rosterTable);
		this.rosterTable.append(this.rosterHeader);
		this.rosterTable.append(this.rosterBody);
		this.rosterTable.append(this.rosterFooter);
	}
	build(year,month)
	{
		var self=this;
		this.rosterYear=year;
		this.rosterMonth=month;
		this.noOfWorkingDay=0;

		this._buildTableHeader();
		this._buildTableBody();
		this._buildTableFooter();
	}
	_buildDateRow()
	{
		var now=new Date(); 
		$(this.rosterDateRow).empty();
		var cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		//cell.className="nameCell borderCell";
		$(cell).addClass(this.borderCellClassName);
		$(cell).addClass(this.nameCellClassName);
		cell.innerHTML="Resident Support<br>Team Members";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.dateCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.dateCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
			if (i<Object.keys(this.dateObjList).length)
			{
				cell.textContent=(i+1);
				if ((this.rosterYear==now.getFullYear()) &&
					(this.rosterMonth==(1+now.getMonth())) &&
					((i+1)==(now.getDate())))
					$(cell).addClass(this.highlightClassName);	
			}
		}
	
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Last<br>Month";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="This<br>Month";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total No. of <br>A Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total No. of <br>Bx Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total No. of <br>C Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total No. of <br>Dx Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="No. of <br>working<br>day";
	}
	_buildHolidayRow()
	{
		var dateObj;
		$(this.rosterHolidayRow).empty();
		var cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
		$(cell).addClass(this.borderCellClassName);
		$(cell).addClass(this.nameCellClassName);
		cell.textContent="Holiday";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
			$(cell).addClass(this.dateCellClassName);
			
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
			$(cell).addClass(this.dateCellClassName);
			$(cell).addClass(this.phCellClassName);
			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i+1];
				if(dateObj.publicHoliday==true)
				{
					cell.textContent="PH";
				}
			}
		}
		cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
		cell.colSpan=10;
		$(cell).addClass(this.borderCellClassName);
	}
	_buildITORow(itoId)
	{
		var aShiftCount=0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0,balance=0.0;
		var	actualWorkingHour=0.0,thisMonthHourTotal=0.0,thisMonthBalance=0.0;

		var cell,i;
		var rosterDataList=this.rosterList[itoId]
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		var shiftType;
		cell=row.insertCell(row.cells.length);
		row.id="shift_"+itoId;
		//cell.className="borderCell alignLeft";
		$(cell).addClass(this.borderCellClassName);
		$(cell).addClass(this.alignLeftClassName);
		cell.innerHTML=rosterDataList.itoname+"<br>"+rosterDataList.itopostName+" Extn. 2458";
		
		var index=Object.keys(rosterDataList.previousMonthShiftList).length-this.showNoOfPrevDate+1;
		for (i=index;i<=Object.keys(rosterDataList.previousMonthShiftList).length;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.textContent=rosterDataList.previousMonthShiftList[i];
			cell.className=this.getShiftCssClassName(rosterDataList.previousMonthShiftList[i]);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		for (i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);

			if (i<Object.keys(this.dateObjList).length)
			{
				//cell.className+=" cursorCell shiftCell";
				$(cell).addClass(this.cursorCellClassName);
				$(cell).addClass(this.shiftCellClassName);
				$(cell).addClass(this.dateCellClassName);
				var inputBox=document.createElement("input");
				inputBox.type="text";
				inputBox.readOnly=true;
				$(inputBox).height($(cell).height());
				$(cell).append(inputBox);
				shiftType=rosterDataList.shiftList[i+1];
				if (shiftType!=null)
				{
					//cell.textContent=shiftType;
					$(cell).addClass(this.getShiftCssClassName(shiftType));
					inputBox.value=shiftType;
					$(inputBox).addClass(this.getShiftCssClassName(shiftType));
					actualWorkingHour+=this.shiftHourCount[shiftType];
					switch(shiftType)
					{
						case "a":
								aShiftCount++;
								break;
						case "b":
						case "b1":
								bxShiftCount++;
								break;
						case "c":
								cShiftCount++;
								break;
						case "d":
						case "d1":
						case "d2":
						case "d3":
								dxShiftCount++;
								break;		
					}
				}	
			}	
		}	
		var totalHour=rosterDataList.itoworkingHourPerDay*this.noOfWorkingDay;
		thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=thisMonthHourTotal+rosterDataList.lastMonthBalance;
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_totalHour";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_actualHour";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_lastMonthBalance";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_thisMonthHourTotal";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
				
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_thisMonthBalance";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_aShiftCount";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_bxShiftCount";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_cShiftCount";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_dxShiftCount";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_noOfWoringDay";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);

		this._updateShiftCount(itoId,totalHour,actualWorkingHour,rosterDataList.lastMonthBalance,thisMonthHourTotal,thisMonthBalance,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount);
	}				
	_buildRosterMonthRow()
	{
		var input,span;
		var self=this;
		$(this.rosterMonthRow).empty();
		var cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		$(cell).addClass(this.nameCellClassName);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		}
		cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.rosterMonthSelectCellClassName);
		cell.colSpan=31;
		
		span=document.createElement("span");
		span.innerHTML="<&nbsp;&nbsp;";
		$(span).addClass(this.underlineTextClassName);
		$(span).addClass(this.clickableClassName);
		cell.append(span);
		$(span).click(function(){
			self._buildPreviousMonth();	
		});
		
		span=document.createElement("span");
		span.id="rosterMonth";
		$(span).addClass(this.underlineTextClassName);
		$(span).addClass(this.clickableClassName);
		span.textContent=this.monthNames[this.rosterMonth]+" "+this.rosterYear;
		cell.append(span);	
	
		span=document.createElement("span");
		span.innerHTML="&nbsp;&nbsp;>";
		$(span).addClass(this.underlineTextClassName);
		$(span).addClass(this.clickableClassName);
		cell.append(span);		
		$(span).click(function(){
			self._buildNextMonth();	
		});
		
		cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		cell.colSpan=10;		
	}
	_buildRosterRows()
	{
		var self=this;
		Object.keys(this.rosterList).forEach(function(itoId){
			self._buildITORow(itoId);
		});
	}
	_buildTableBody()
	{
		var self=this;
		$(this.rosterBody).empty();
		self._buildRosterRows();
	}
	_buildTableCaptionRow()
	{
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.nameCellClassName);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
		}
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.titleCellClassName)
		$(cell).addClass(this.underlineTextClassName);
		cell.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		cell.colSpan=31;
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.className=this.actualHourCellClassName;
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.lastMonthCellClassName);
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.thisMonthCellClassName);
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalCellClassName);
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalNoOfCellClassName);
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalNoOfCellClassName);
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalNoOfCellClassName);
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalNoOfCellClassName);
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.noOfWorkingDayClassName);
	}
	_buildTableFooter()
	{
		$(this.rosterFooter).empty();
		var shiftCellColSpan=11+this.showNoOfPrevDate;
		var row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		var cell=row.insertCell(row.cells.length);
		cell.colSpan=44+this.showNoOfPrevDate;
		cell.innerHTML="<br>";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.aShiftColorClassName);
		cell.textContent="a : 0800H - 1700H";
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=21;
		cell.rowSpan=10;
		cell.id="autoScheduler"; 
		cell.style.verticalAlign="top";
		//this._buildSchedulerButton(cell);
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=10;
		cell.rowSpan=20;
		cell.id="yearlyStat"; 
		cell.style.verticalAlign="top";
		//this._buildStatisticReport(cell);
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.bShiftColorClassName);
		cell.textContent="b : 1630H - 2215H";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.bShiftColorClassName);
		cell.textContent="b1: 1500H - 2215H";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.cShiftColorClassName);
		cell.textContent="c : 2145H - 0830H (the next day)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.dShiftColorClassName);
		cell.textContent="d : 0800H - 1800H (on weekdays)";

		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.dShiftColorClassName);
		cell.textContent="d1 : 0800H - 1700H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.dShiftColorClassName);
		cell.textContent="d2 : 0900H - 1800H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.dShiftColorClassName);
		cell.textContent="d3 : 0800H - 1648H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.sickLeaveColorClassName);
		cell.textContent="s : sick leave standby";

		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		$(cell).addClass(this.oShiftColorClassName);
		cell.textContent="O : dayoff";
		
	}
	_buildTableHeader()
	{
		var self=this;
		$(this.rosterHeader).empty();
		this._buildTableCaptionRow();
		this.rosterMonthRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		this.rosterHolidayRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		this.rosterWeekDayRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		this.rosterDateRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		this.rosterMonthRow.id="rosterMonthRow";
		this.rosterHolidayRow.id="holidayRow";
		this.rosterWeekDayRow.id="dayRow";
		this.rosterDateRow.id="dateRow";	
		this._buildRosterMonthRow();
		
		self._buildHolidayRow();
		self._buildWeekDayRow();
		self._buildDateRow();
	
	}
	_buildWeekDayRow()
	{
		var dateObj;
		$(this.rosterWeekDayRow).empty();
		var cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		
		//cell.className="nameCell borderCell";
		$(cell).addClass(this.nameCellClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.textContent="Days";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.dateCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.dateCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);

			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i+1];
				if ((dateObj.publicHoliday==true)||(dateObj.dayOfWeek=="SATURDAY")||(dateObj.dayOfWeek=="SUNDAY"))
				{
					//cell.className+=" phCell";	
					$(cell).addClass(this.phCellClassName);
				}
				else
					this.noOfWorkingDay++;
				
				switch (dateObj.dayOfWeek)
				{
					case "MONDAY":
								cell.textContent="M";
								break;	
					case "TUESDAY":
								cell.textContent="T";
								break;	
					case "WEDNESDAY":
								cell.textContent="W";
								break;	
					case "THURSDAY":
								cell.textContent="Th";
								break;	
					case "FRIDAY":
								cell.textContent="F";
								break;	
					case "SATURDAY":
								cell.textContent="S";
								break;	
					case "SUNDAY":
								cell.textContent="Su";
								break;	
				}					
			}
		}
		cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		//cell.className="alignCenter borderCell"; 
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.rowSpan=2;
		cell.innerHTML="Total<br>Hour";
		
		cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		//cell.className="alignCenter borderCell"; 
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.rowSpan=2;
		cell.innerHTML="Actual<br>Hour";
		
		cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		//cell.className="alignCenter borderCell"; 
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.colSpan=8;
		cell.innerHTML="Hour Off Due";
	}
	_updateShiftCount(itoId,totalHour,actualWorkingHour,lastMonthBalance,thisMonthHourTotal,thisMonthBalance,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount)
	{
		document.getElementById(itoId+"_totalHour").textContent=this.roundTo(totalHour,2);
		document.getElementById(itoId+"_actualHour").textContent=this.roundTo(actualWorkingHour,2);
		document.getElementById(itoId+"_lastMonthBalance").textContent=this.roundTo(lastMonthBalance,2);
		document.getElementById(itoId+"_thisMonthHourTotal").textContent=this.roundTo(thisMonthHourTotal,2);
		document.getElementById(itoId+"_thisMonthBalance").textContent=this.roundTo(thisMonthBalance,2);
		document.getElementById(itoId+"_aShiftCount").textContent=aShiftCount;
		document.getElementById(itoId+"_bxShiftCount").textContent=bxShiftCount;
		document.getElementById(itoId+"_cShiftCount").textContent=cShiftCount;
		document.getElementById(itoId+"_dxShiftCount").textContent=dxShiftCount;
		document.getElementById(itoId+"_noOfWoringDay").textContent=aShiftCount+bxShiftCount+cShiftCount+dxShiftCount;
	}
	getShiftCssClassName(shiftType)
	{
		var className="";
		switch (shiftType)
		{
			case "a":
					className="aShiftColor";
					break;	
			case "b":
			case "b1":
					className="bShiftColor";
					break;
			case "c":
					className="cShiftColor";
					break;
			case "d":
			case "d1":
			case "d2":
			case "d3":
					 className="dShiftColor";
					 break;
			case  "O":
					 className="oShiftColor";
					 break;
		}
		return className;
	}	
	roundTo(theValue,decPlace)
	{
		var result=theValue*Math.pow(10,decPlace);
		result=Math.round(result);
		result=result/Math.pow(10,decPlace);
		return result;
	}
}
