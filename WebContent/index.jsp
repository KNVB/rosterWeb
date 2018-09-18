<%@ page trimDirectiveWhitespaces="true"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="com.*"%>    
<%@ page import="util.*"%>
<%@ page import="util.calendar.*" %>
<%@ page import="java.util.*"%>
<%@ page import="java.util.Calendar"%>
<%@ page import="java.util.GregorianCalendar" %>
<%
int i=0,year,month;
int showNoOfPrevDate=2,noOfWorkingDay=0;
float actualWorkingHour;
String className=new String();
GregorianCalendar now=new GregorianCalendar();
year=now.get(Calendar.YEAR);
month=now.get(Calendar.MONTH);
//year=2018;
//month=10;
ITO ito=new ITO();
CalendarUtility calendarUtility=new CalendarUtility();
MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(year,month);
Hashtable<Integer,MyCalendar> myCalendarList=mc.getMonthlyCalendar();
MyCalendar myCalendar;
%>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Roster Scheduling</title>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script type="text/javascript" src="<%=request.getContextPath() %>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script src="js/ITO.js"></script>
		<script src="js/RosterRule.js"></script>
		<script src="js/RosterTable.js"></script>
		<script src="js/RosterViewer.js"></script>
		<script src="js/util/ShiftCellEventHandler.js"></script>
		<script src="js/util/Utility.js"></script>
		<script>
			$( document ).ready(function() {
				var rosterViewer=new RosterViewer();
				rosterViewer.reloadRosterData(<%=year%>,<%=month%>);
			});
		</script>	
	</head>
	<body>
		<table border="0" id="rosterTable">
			<thead id="rosterHeader">
				<tr>
					<td class="nameCell"></td>
					<td colspan="2"></td>
					<td class="alignCenter titleCell underlineText" colspan="31">
						EMSTF Resident Support &amp; Computer Operation Support Services Team Roster
					</td>
					<td class="totalHourCell"><br></td>
					<td class="actualHourCell"><br></td>
					<td class="lastMonthCell"><br></td>
					<td class="thisMonthCell"><br></td>
					<td class="totalCell"><br></td>
					<td class="totalNoOfCell"><br></td>
					<td class="totalNoOfCell"><br></td>
					<td class="totalNoOfCell"><br></td>
					<td class="totalNoOfCell"><br></td><td class="noOfWorkingDay"><br></td>
				</tr>
				<tr id="rosterMonthRow">
					<td class="nameCell">
					</td><td colspan="2"></td>
					<td colspan="31" class="underlineText alignCenter rosterMonthSelectCell">
						<select id="selectRosterMonth" class="underlineText rosterMonthSelect" onchange=>
							<option <%=((month==Calendar.JANUARY)?"selected":"")%> value="0">January</option>
							<option <%=((month==Calendar.FEBRUARY)?"selected":"")%> value="1">February</option>
							<option <%=((month==Calendar.MARCH)?"selected":"")%> value="2">March</option>
							<option <%=((month==Calendar.APRIL)?"selected":"")%> value="3">April</option>
							<option <%=((month==Calendar.MAY)?"selected":"")%> value="4">May</option>
							<option <%=((month==Calendar.JUNE)?"selected":"")%> value="5">June</option>
							<option <%=((month==Calendar.JULY)?"selected":"")%> value="6">July</option>
							<option <%=((month==Calendar.AUGUST)?"selected":"")%> value="7">August</option>
							<option <%=((month==Calendar.SEPTEMBER)?"selected":"")%> value="8">September</option>
							<option <%=((month==Calendar.OCTOBER)?"selected":"")%> value="9">October</option>
							<option <%=((month==Calendar.NOVEMBER)?"selected":"")%> value="10">November</option>
							<option <%=((month==Calendar.DECEMBER)?"selected":"")%> value="11">December</option>
						</select>2018
					</td>
					<td colspan="10"></td>
				</tr>
				<tr>
					<td colspan="44">
						<br>
					</td>
				</tr>
				<tr id="holidayRow">
					<td class="nameCell borderCell">Holiday</td>
<%				for (i=0;i<showNoOfPrevDate;i++)
				{
					out.println("<td class=\"dataCell alignCenter borderCell\"></td>");
				}
				for (i=0;i<31;i++)
				{
 					if (i< myCalendarList.size())
					{
						myCalendar= myCalendarList.get(i+1);
						if (myCalendar.isPublicHoliday())
						{
							out.println("<td class=\"dataCell alignCenter borderCell phCell\">PH</td>");	
						}
						else
						{
							out.println("<td class=\"dataCell alignCenter borderCell phCell\"></td>");
						}
					}
					else
					{
						out.println("<td class=\"dataCell alignCenter borderCell phCell\"></td>");
					}
				}%>	
					<td class="borderCell" colspan="10"></td>				
				</tr>
				<tr id="weekdayRow">
					<td class="nameCell borderCell">Days</td>
<%				for (i=0;i<showNoOfPrevDate;i++)
				{
					out.println("<td class=\"dataCell alignCenter borderCell\"></td>");
				}
				for (i=0;i<31;i++)
				{
					className="dataCell alignCenter borderCell";
					if (i< myCalendarList.size())
					{
						myCalendar= myCalendarList.get(i+1);
						if (myCalendar.isPublicHoliday()||
							(myCalendar.getDayOfWeek()==Calendar.SATURDAY)||
							(myCalendar.getDayOfWeek()==Calendar.SUNDAY))
						{
							className+=" phCell";	
						}
						else
							noOfWorkingDay++;
						switch (myCalendar.getDayOfWeek())
						{
							case Calendar.FRIDAY:out.println("<td class=\""+className+"\">F</td>");
												break;
							case Calendar.MONDAY:out.println("<td class=\""+className+"\">M</td>");
													break;
							case Calendar.SATURDAY:out.println("<td class=\""+className+"\">S</td>");
													break;
							case Calendar.SUNDAY:out.println("<td class=\""+className+"\">Su</td>");
												 break;
							case Calendar.TUESDAY:out.println("<td class=\""+className+"\">T</td>");
												break;
							case Calendar.THURSDAY:out.println("<td class=\""+className+"\">Th</td>");
												break;
							case Calendar.WEDNESDAY:out.println("<td class=\""+className+"\">W</td>");
												break;
												 
						}
					}
					else
						out.println("<td class=\""+className+"\"></td>");
				}%>
					<td class="alignCenter borderCell" rowspan="2">Total<br>Hour</td>
					<td class="alignCenter borderCell" rowspan="2">Actual<br>Hour</td>
					<td class="alignCenter borderCell" colspan="8">Hour Off Due</td>					
				</tr>
				<tr id="dateRow">
					<td class="nameCell borderCell">Resident Support<br>Team Members</td>
<%				for (i=0;i<showNoOfPrevDate;i++)
				{
					out.println("<td class=\"dataCell alignCenter borderCell\"></td>");
				}
				for (i=0;i<31;i++)
				{
					if (i< myCalendarList.size())
					{
						out.println("<td class=\"dataCell alignCenter borderCell\">"+(i+1)+"</td>");
					}
					else
						out.println("<td class=\"dataCell alignCenter borderCell\"></td>");	
				}%>
					<td class="alignCenter borderCell">Last<br>Month</td>
					<td class="alignCenter borderCell">This<br>Month</td>
					<td class="alignCenter borderCell">Total</td>
					<td class="alignCenter borderCell">Total No. of<br>A shift</td>
					<td class="alignCenter borderCell">Total No. of<br>Bx shift</td>
					<td class="alignCenter borderCell">Total No. of<br>C shift</td>
					<td class="alignCenter borderCell">Total No. of<br>Dx shift</td>
					<td class="alignCenter borderCell">No. of<br>working<br>day</td>
				</tr>
			</thead>
			<tbody id="rosterBody">
<%	
			Hashtable<String,ITO> itoList=ito.getITOList(year,month);
			String[] itoIdList = itoList.keySet().toArray(new String[0]);
			for (String itoId:itoIdList)
			{
				ito=itoList.get(itoId);
				out.println("<tr id=\"shift_"+itoId+"\">");
				out.println("<td class=\"borderCell alignLeft\">"+ito.getItoName()+"<br>"+ito.getPostName()+" Extn. 2458</td>");
				for (i=0;i<showNoOfPrevDate;i++)
				{
					out.println("<td class=\"dataCell alignCenter borderCell\"></td>");
				}
				for (i=0;i<31;i++)
				{
					out.println("<td class=\"borderCell alignCenter shiftCell\"></td>");
				}
				for (i=0;i<10;i++)
				{
					out.println("<td class=\"borderCell alignCenter\"></td>");
				}
				out.println("</tr>");
			}
%>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="44">
						<br>
					</td>
				</tr>
				<tr>
					<td colspan=13 class="aShiftColor">	
						a : 0800H - 1700H
					</td>
				</tr>
				<tr>
					<td colspan=13 class="bShiftColor">	
						b : 1630H - 2215H
					</td>
				</tr>
				<tr>
					<td colspan=13 class="bShiftColor">	
						b1: 1500H - 2215H
					</td>															
				</tr>
				<tr>
					<td colspan=13 class="cShiftColor">
						c : 2145H - 0830H (the next day)
					</td>				
				</tr>
				<tr>
					<td colspan=13 class="dxShiftColor">
						d : 0800H - 1800H (on weekdays)
					</td>
				</tr>
				<tr>
					<td colspan=13 class="dxShiftColor">
						d1 : 0800H - 1700H (on weekdays)
					</td>								
				</tr>
				<tr>
					<td colspan=13 class="dxShiftColor">
						d2 : 0900H - 1800H (on weekdays)
					</td>				
				</tr>
				<tr>
					<td colspan=13 class="dxShiftColor">
						d3 : 0800H - 1648H (on weekdays)
					</td>
				</tr>
				<tr>
					<td colspan=13 class="sickLeaveColor">
						s : sick leave standby
					</td>
				</tr>
				<tr>
					<td colspan=13 class="oShiftColor">
						O : dayoff
					</td>
				</tr>								
				<tr>
					<td colspan="33">
						<br>
					</td>
				</tr>						
			</tfoot>
		</table>
	</body>
</html>		