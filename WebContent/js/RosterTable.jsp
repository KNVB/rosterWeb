<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.Arrays"%>
<%@ page import="java.util.Hashtable"%>
<%@ page import="java.time.DayOfWeek"%>
<%@ page import="java.time.YearMonth"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="com.rosterWeb.ITO"%>
<%@ page import="com.rosterWeb.ITORoster"%>
<%@ page import="com.rosterWeb.Roster"%>
<%@ page import="com.rosterWeb.util.calendar.MyCalendarUtility"%>
<%@ page import="com.rosterWeb.util.calendar.MyDate"%>
<%@ page import="com.rosterWeb.util.calendar.MonthlyCalendar"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
ObjectMapper objectMapper = new ObjectMapper();
Hashtable<Integer,MyDate> myDateList;
int rosterYear=(Integer)session.getAttribute("rosterYear");
int rosterMonth=(Integer)session.getAttribute("rosterMonth");
YearMonth theRosterYearMonth=YearMonth.of(rosterYear,rosterMonth);
MyCalendarUtility myDateUtility=new MyCalendarUtility();
MonthlyCalendar mc=myDateUtility.getMonthlyCalendar(rosterYear,rosterMonth);
myDateList=mc.getMonthlyCalendar();
ITO ito=new ITO();
Hashtable<String,ITO> itoList=ito.getITOList(rosterYear,rosterMonth);
String[] itoIdList = itoList.keySet().toArray(new String[0]);
Arrays.sort(itoIdList);

Roster roster=new Roster(rosterYear,rosterMonth);
Hashtable<String,ITORoster>itoRosterList=roster.getITORosterList(itoIdList);
YearMonth thePreviousRosterYearMonth=theRosterYearMonth.plusMonths(-1L);
YearMonth theNextRosterYearMonth=theRosterYearMonth.plusMonths(1L);
%>
class RosterTable
{
	constructor()
	{
		var self=this;
		this.aShiftData=[];
		this.bShiftData=[];
		this.cShiftData=[];
		this.noOfWorkingDay=0;
		this.itoIdList=<%=objectMapper.writeValueAsString(itoIdList)%>;
		this.dateObjectList=<%=objectMapper.writeValueAsString(myDateList)%>;
		this.rosterDataList=<%=objectMapper.writeValueAsString(itoRosterList)%>;
		this.utility=new Utility();
		this.rosterRule=new RosterRule();
		this.showNoOfPrevDate=0;
		this.previousMonth=<%=thePreviousRosterYearMonth.getMonthValue()%>;
		this.previousYear=<%=thePreviousRosterYearMonth.getYear()%>;
		
		this.nextMonth=<%=theNextRosterYearMonth.getMonthValue()%>;
		this.nextYear=<%=theNextRosterYearMonth.getYear()%>;
		
		
		this.rosterYear=<%=session.getAttribute("rosterYear")%>;
		this.rosterMonth=<%=session.getAttribute("rosterMonth")%>;
		
		this.rosterBody=document.createElement("tbody");
		this.rosterFooter=document.createElement("tFoot");
		this.rosterHeader=document.createElement("thead");
		this.rosterTable=document.createElement("table");
		
		this.rosterBody.id="rosterBody";
		this.rosterFooter.id="rosterFooter";
		this.rosterHeader.id="rosterHeader";
		this.rosterTable.id="rosterTable";
		
		$(this.rosterTable).attr("border","0");
		this.rosterTable.append(this.rosterHeader);
		this.rosterTable.append(this.rosterBody);
		this.rosterTable.append(this.rosterFooter);
	}
	isAllDataReady()
	{
		return (this.isDateListReady & this.isRosterDataRead);
	}
	build()
	{
		this._buildTableHeader();
		this._buildTableBody();
		this._buildTableFooter();
	}
	appendTo(element)
	{
		element.append(this.rosterTable);
	}
	_buildSchedulerButton(theCell)
	{
	}
	_buildStatisticReport(theCell)
	{
	}
	_buildTableFooter()
	{
		var shiftCellColSpan=11+this.showNoOfPrevDate;
		var row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		var cell=row.insertCell(row.cells.length);
		cell.colSpan=44-this.showNoOfPrevDate;
		cell.innerHTML="<br>";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="aShiftColor";
		cell.textContent="a : 0800H - 1700H";
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=21;
		cell.rowSpan=10;
		cell.id="autoScheduler"; 
		cell.style.verticalAlign="top";
		this._buildSchedulerButton(cell);
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=10;
		cell.rowSpan=20;
		cell.id="yearlyStat"; 
		cell.style.verticalAlign="top";
		this._buildStatisticReport(cell);
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="bShiftColor";
		cell.textContent="b : 1630H - 2215H";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="bShiftColor";
		cell.textContent="b1: 1500H - 2215H";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="cShiftColor";
		cell.textContent="c : 2145H - 0830H (the next day)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="dxShiftColor";
		cell.textContent="d : 0800H - 1800H (on weekdays)";

		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="dxShiftColor";
		cell.textContent="d1 : 0800H - 1700H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="dxShiftColor";
		cell.textContent="d2 : 0900H - 1800H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="dxShiftColor";
		cell.textContent="d3 : 0800H - 1648H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="sickLeaveColor";
		cell.textContent="s : sick leave standby";

		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="oShiftColor";
		cell.textContent="O : dayoff";
	}
	_buildTableBody()
	{
		this._buildRosterRows();
	}
	_buildRosterRows()
	{
		for (var i=0;i<this.itoIdList.length;i++)
		{
			this._buildITORow(this.itoIdList[i]);
		}
	}
	_buildITORow(itoId)
	{
		var aShiftCount=0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0;
		var	actualWorkingHour=0.0,thisMonthHourTotal=0.0,thisMonthBalance=0.0;
		var i,shiftType;
		var roster=this.rosterDataList[itoId];
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		var cell=row.insertCell(row.cells.length);
		row.id="shift_"+itoId;
		cell.className="borderCell alignLeft";
		cell.innerHTML=roster.itoname+"<br>"+roster.itopostName+" Extn. 2458";
		var index=Object.keys(roster.previousMonthShiftList).length-this.showNoOfPrevDate+1;
		
		for (i=index;i<=Object.keys(roster.previousMonthShiftList).length;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.textContent=roster.previousMonthShiftList[i];
			cell.className=this.utility.getShiftCssClassName(roster.previousMonthShiftList[i]);
			cell.className+=" alignCenter borderCell";
		}
		for (i=0;i<Object.keys(roster.shiftList).length;i++)
		{
			shiftType=roster.shiftList[i+1];
			cell=row.insertCell(row.cells.length);
			cell.textContent=shiftType;
			cell.className=this.utility.getShiftCssClassName(shiftType);
			cell.className+=" alignCenter borderCell cursorCell shiftCell";
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
			actualWorkingHour+=this.rosterRule.shiftHourCount[shiftType];			
		}
		for (var j=i;j<31;j++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="alignCenter borderCell";
		}
		
		var totalHour=roster.itoworkingHourPerDay*this.noOfWorkingDay;
		thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=thisMonthHourTotal+roster.balance;
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_totalHour";
		cell.className="alignCenter borderCell";
		cell.textContent=this.utility.roundTo(totalHour,2);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_actualHour";
		cell.className="alignCenter borderCell";
		cell.textContent=this.utility.roundTo(actualWorkingHour,2);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_lastMonthBalance";
		cell.className="alignCenter borderCell";
		cell.textContent=this.utility.roundTo(roster.balance,2);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_thisMonthHourTotal";
		cell.className="alignCenter borderCell";
		cell.textContent=this.utility.roundTo(thisMonthHourTotal,2);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_thisMonthBalance";
		cell.className="alignCenter borderCell";
		cell.textContent=this.utility.roundTo(thisMonthBalance,2);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_aShiftCount";
		cell.className="alignCenter borderCell";
		cell.textContent=aShiftCount;
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_bxShiftCount";
		cell.className="alignCenter borderCell";
		cell.textContent=bxShiftCount;

		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_cShiftCount";
		cell.className="alignCenter borderCell";
		cell.textContent=cShiftCount;

		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_dxShiftCount";
		cell.className="alignCenter borderCell";
		cell.textContent=dxShiftCount;

		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_noOfWoringDay";
		cell.className="alignCenter borderCell";
		cell.textContent=(dxShiftCount+cShiftCount+bxShiftCount+aShiftCount);
		
		if ($.isEmptyObject(roster.shiftList))
		{
			this.aShiftData.push(0);
			this.bShiftData.push(0);
			this.cShiftData.push(0);
		}	
		else
		{
			this.aShiftData.push(aShiftCount); 
			this.bShiftData.push(bxShiftCount); 
			this.cShiftData.push(cShiftCount);
		}	

	}
	_buildTableHeader()
	{
		this._buildCaptionRow();
		this._buildRosterMonthRow();
		this._buildHolidayRow();
		this._buildWeekDayRow();
		this._buildDateRow();
	}
	_buildCaptionRow()
	{
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var cell=row.insertCell(row.cells.length);
		cell.className="nameCell";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
		}
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter titleCell underlineText";
		cell.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		cell.colSpan=31;
		cell=row.insertCell(row.cells.length);
		cell.className="totalHourCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="actualHourCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="lastMonthCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="thisMonthCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="noOfWorkingDay";
	}
	_buildRosterMonthRow()
	{
		var input,span,link;
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var rosterMonthForm=document.createElement("form");
		row.id="rosterMonthRow";
		var cell=row.insertCell(row.cells.length);
		cell.className="nameCell";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
		}
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter rosterMonthSelectCell";
		cell.colSpan=31;
		rosterMonthForm.method="post";
		rosterMonthForm.id="rosterMonthForm";
		input=document.createElement("input");
		input.type="hidden";
		input.id="selectRosterMonth"; 
		input.name="month";
		input.value=this.rosterMonth;
		rosterMonthForm.append(input);

		input=document.createElement("input");
		input.type="hidden";
		input.id="selectRosterYear"; 
		input.name="year";
		input.value=this.rosterYear;
		rosterMonthForm.append(input);
		cell.append(rosterMonthForm);
		
		link=document.createElement("a");
		link.innerHTML="<&nbsp;&nbsp;";
		cell.append(link);
		
		span=document.createElement("span");
		span.id="rosterMonth";
		span.className="underlineText clickable"
		span.textContent=this.utility.monthNames[this.rosterMonth]+" "+this.rosterYear;
		cell.append(span);	
		
		link=document.createElement("a");
		link.innerHTML="&nbsp;&nbsp;>";
		cell.append(link);		
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=10;
	}
	_buildHolidayRow()
	{
		var dateObj;
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var cell=row.insertCell(row.cells.length);
		row.id="holidayRow";
		cell.className="nameCell borderCell";
		cell.textContent="Holiday";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="dataCell alignCenter borderCell";
		}
		for (var i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="dataCell alignCenter borderCell phCell";
			
			if (i<Object.keys(this.dateObjectList).length)
			{
				dateObj=this.dateObjectList[i+1];
				if(dateObj.publicHoliday==true)
				{
					cell.textContent="PH";
				}
			}
		}
		cell=row.insertCell(row.cells.length);
		cell.colSpan=10;
		cell.className="borderCell";		
	}
	_buildWeekDayRow()
	{
		var dateObj;
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var cell=row.insertCell(row.cells.length);
		row.id="dayRow";
		cell.className="nameCell borderCell";
		cell.textContent="Days";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="dataCell alignCenter borderCell";
		}
		for (var i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="dataCell alignCenter borderCell";
			
			if (i<Object.keys(this.dateObjectList).length)
			{
				dateObj=this.dateObjectList[i+1];
				if ((dateObj.publicHoliday==true)||(dateObj.dayOfWeek=="SATURDAY")||(dateObj.dayOfWeek=="SUNDAY"))
				{
					cell.className+=" phCell";	
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
								cell.textContent="TH";
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
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell"; 
		cell.rowSpan=2;
		cell.innerHTML="Total<br>Hour";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell"; 
		cell.rowSpan=2;
		cell.innerHTML="Actual<br>Hour";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell"; 
		cell.colSpan=8;
		cell.innerHTML="Hour Off Due";
		
	}
	_buildDateRow()
	{
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var cell=row.insertCell(row.cells.length);
		row.id="dateRow";
		cell.className="nameCell borderCell";
		cell.innerHTML="Resident Support<br>Team Members";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="dataCell alignCenter borderCell";
		}
		for (var i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="dataCell alignCenter borderCell";
			
			if (i<Object.keys(this.dateObjectList).length)
			{
				cell.textContent=(i+1);
			}
		}
	
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Last<br>Month";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="This<br>Month";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of <br>A Shift";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of <br>Bx Shift";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of <br>C Shift";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of <br>Dx Shift";
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="No. of <br>working<br>day";
	}	
}