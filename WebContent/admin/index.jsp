<%@ page trimDirectiveWhitespaces="true"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="com.*"%>    
<%@ page import="com.rosterStatistic.*"%>

<%@ page import="util.*"%>
<%@ page import="util.calendar.*" %>

<%@ page import="java.util.*"%>
<%@ page import="java.util.Calendar"%>
<%@ page import="java.util.GregorianCalendar" %>
<%
int i=0,year,month,startIndex;
int showNoOfPrevDate=2,noOfWorkingDay=0;


GregorianCalendar now=new GregorianCalendar();
year=now.get(Calendar.YEAR);
month=now.get(Calendar.MONTH);
//year=2018;
month=9;
ITO ito=new ITO();
ITORoster itoRoster;
ITOYearlyStatistic iTOYearlyStatistic;

CalendarUtility calendarUtility=new CalendarUtility();
Hashtable<String,ITO> itoList=ito.getITOList(year,month);
Hashtable<String,ITORoster> itoRosterList;
Hashtable<Integer,MyCalendar> myCalendarList;
Hashtable<String,ITOYearlyStatistic> yearlyRosterStatistic;
MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(year,month);
MyCalendar myCalendar;
myCalendarList=mc.getMonthlyCalendar();
String className=new String();
String[] itoIdList = itoList.keySet().toArray(new String[0]);
Arrays.sort(itoIdList);
Roster roster=new Roster();
roster.setRosterYear(year);
roster.setRosterMonth(month);
roster.load();
itoRosterList=roster.getITORosterList();
yearlyRosterStatistic=roster.getYearlyStatistic(year, month);
%>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Roster Scheduling</title>
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/style.css">
		<script type="text/javascript" src="<%=request.getContextPath() %>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script src="<%=request.getContextPath()%>/js/ITO.js"></script>
		<script src="<%=request.getContextPath()%>/js/RosterRule.js"></script>
		<script src="<%=request.getContextPath()%>/js/RosterViewer.js"></script>
		<script src="<%=request.getContextPath()%>/js/util/ShiftCellEventHandler.js"></script>
		<script src="<%=request.getContextPath()%>/js/util/Utility.js"></script>
		
		<script src="js/util/MyModal.js"></script>
		<script src="js/util/MyLoadingScreen.js"></script>
		<script src="js/RosterTable.js"></script>
		<script src="js/RosterScheduler.js"></script>
		<script>
			var utility=new Utility("<%=request.getContextPath() %>/middleware/");
			$( document ).ready(function() {
				var rosterScheduler=new RosterScheduler(utility);
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
			float actualWorkingHour, thisMonthBalance,thisMonthHourTotal,totalHour;
			int aShiftCount,bxShiftCount,cShiftCount,dxShiftCount,totalNoOfWorkingDay;
			String shiftType;
			for (String itoId:itoIdList)
			{
				ito=itoList.get(itoId);
				itoRoster=itoRosterList.get(itoId);
				if (itoRoster!=null)
				{
					out.println("<tr id=\"shift_"+itoId+"\">");
					out.println("<td class=\"borderCell alignLeft\">"+ito.getItoName()+"<br>"+ito.getPostName()+" Extn. 2458</td>");
					aShiftCount=0;
					bxShiftCount=0;
					cShiftCount=0;
					dxShiftCount=0;
					actualWorkingHour=0.0f;
					totalHour=(noOfWorkingDay*ito.getWorkingHourPerDay());
					startIndex=itoRoster.getPreviousMonthShiftList().size()-showNoOfPrevDate;
					for (i=startIndex;i<itoRoster.getPreviousMonthShiftList().size();i++)
					{
						out.println("<script>utility.printPreviousMonthShiftCell(\""+itoRoster.getPreviousMonthShiftList().get(i).getShift()+"\");</script>");
					}
					if (itoRoster.getShiftList().isEmpty())
					{
						for (i=0;i<41;i++)
						{
							out.println("<td class=\"alignCenter borderCell\"></td>");
						}
					}
					else
					{
						aShiftCount=0;
						bxShiftCount=0;
						cShiftCount=0;
						dxShiftCount=0;
						actualWorkingHour=0.0f;
						totalHour=(noOfWorkingDay*ito.getWorkingHourPerDay());
						for (i=0;i<31;i++)
						{
							if (i< myCalendarList.size())
							{
								shiftType=itoRoster.getShiftList().get(i+1);
								out.println("<script>utility.printShiftCell(\""+shiftType+"\");</script>");
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
								actualWorkingHour+=RosterRule.getShiftHourCount().get(shiftType);
							}
							else
							{
								out.println("<td class=\"alignCenter borderCell\"></td>");
							}
						}
						thisMonthHourTotal=actualWorkingHour-totalHour;
						thisMonthBalance=thisMonthHourTotal+itoRoster.getBalance();
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_totalHour\">"+totalHour+"</td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_actualHour\">"+(actualWorkingHour)+"</td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_lastMonthBalance\">"+itoRoster.getBalance()+"</td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_thisMonthHourTotal\"><script>document.write(utility.roundTo("+thisMonthHourTotal+",2));</script></td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_thisMonthBalance\"><script>document.write(utility.roundTo("+thisMonthBalance+",2));</script></td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_aShiftCount\">"+aShiftCount+"</td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_bxShiftCount\">"+bxShiftCount+"</td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_cShiftCount\">"+cShiftCount+"</td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_dxShiftCount\">"+dxShiftCount+"</td>");
						out.println("<td class=\"alignCenter borderCell\" id=\""+itoId+"_noOfWoringDay\">"+(aShiftCount+bxShiftCount+cShiftCount+dxShiftCount)+"</td>");
					}
					out.println("</tr>");
					out.println("<tr id=\"preferredShift_"+itoId+"\">");
					out.println("<td class=\"borderCell alignLeft\">Preferred Shift</td>");
					for (i=0;i<showNoOfPrevDate;i++)
					{
						out.println("<td class=\"alignCenter borderCell\"></td>");
					}
					if (itoRoster.getPreferredShiftList().isEmpty())
					{
						for (i=0;i<31;i++)
						{
							out.println("<td class=\"alignCenter borderCell shiftCell\"></td>");
						}
					}
					else
					{
						for (i=0;i<31;i++)
						{
							shiftType=itoRoster.getPreferredShiftList().get(i+1);
							if (shiftType==null)
							{
								out.println("<td class=\"alignCenter borderCell shiftCell\"></td>");
							}
							else
							{
								out.println("<td class=\"alignCenter borderCell shiftCell\">"+shiftType+"</td>");
							}
						}
					}
					out.println("<td class=\"borderCell alignCenter\" colspan=\"10\"></td>");
					out.println("</tr>");
				}
				else
				{
					out.println("<tr id=\"shift_"+itoId+"\">");
					out.println("<td class=\"borderCell alignLeft\">"+ito.getItoName()+"<br>"+ito.getPostName()+" Extn. 2458</td>");
					for (i=0;i<showNoOfPrevDate;i++)
					{
						out.println("<td class=\"alignCenter borderCell\"></td>");
					}
					for (i=0;i<31;i++)
					{
						if (i< myCalendarList.size())
							out.println("<td class=\"alignCenter borderCell shiftCell\"></td>");
						else
							out.println("<td class=\"alignCenter borderCell\"></td>");
					}
					out.println("</tr>");
					out.println("<tr id=\"preferredShift_"+itoId+"\">");
					out.println("<td class=\"borderCell alignLeft\">Preferred Shift</td>");
					for (i=0;i<33;i++)
					{
						out.println("<td class=\"alignCenter borderCell\"></td>");
					}
					out.println("<td class=\"alignCenter borderCell\" colspan=\"10\"></td>");
					out.println("</tr>");
				}
			}
			
			out.println("<tr id=\"vancantShift\">");
			out.println("<td class=\"vancantShift borderCell\">Vancant Shifts</td>");
			out.println("<td class=\"alignCenter borderCell\"></td>");
			for (i=0;i<32;i++)
			{
				out.println("<td class=\"alignCenter borderCell\"></td>");
			}
			out.println("<td class=\"alignCenter borderCell\" colspan=\"10\"></td>");
			out.println("</tr>");
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
					<td colspan="20" rowspan=10>
						<div style="text-align:center">
							Auto Planning Start From:
							<select id="autoPlannStartDate">
<% 							for (i=1 ;i<=myCalendarList.size();i++)
							{
								out.println("<option value="+i+">"+i+"</option>");									
							}%>	
							</select>
							to
							<select id="autoPlanEndDate">
<% 							for (i=1 ;i<=myCalendarList.size();i++)
							{
								if (i==myCalendarList.size())
									out.println("<option value="+i+" selected>"+i+"</option>");
								else									
									out.println("<option value="+i+">"+i+"</option>");									
							}%>								
							</select>
							<a class="autoPlannerButton">Auto Planner</a>
						</div>
						<div style="padding-left:10px;display:none" id="genResult">
							<table border=0 >
								<tr>
									<td>Standard Deviation:</td>
								</tr>
								<tr id="theLowestSD">
									<td>1</td>
									<td>1</td>
								</tr>
								<tr id="secondLowestSD">
									<td>1</td>
									<td>1</td>
								</tr>
								<tr id="thirdLowestSD">
									<td >1</td>
									<td>1</td>
								</tr>
								<tr>
									<td><br></td>
								</tr>
								<tr>
									<td>Missing shift Count:</td>
								</tr>
								<tr id="theLowestMissingShiftCount">
									<td>1</td>
									<td>1</td>
								</tr>
								<tr id="theSecondLowestMissingShiftCount">
									<td>1</td>
									<td>1</td>
								</tr>
								<tr id="theThirdLowestMissingShiftCount">
									<td>1</td>
									<td>1</td>
								</tr>						
							</table>
						</div>	
					</td>
					<td colspan="11" rowspan="13">
						<div id="yearlyStatistic">
							<table style="width:500px;borderCollapse:collapse">
								<tr>
									<td class="borderCell alignCenter">ITO</td>
									<td class="borderCell alignCenter">a</td>
									<td class="borderCell alignCenter">bx</td>
									<td class="borderCell alignCenter">c</td>
									<td class="borderCell alignCenter">dx</td>
									<td class="borderCell alignCenter">O</td>
									<td class="borderCell alignCenter">total</td>
								</tr>
<%								
								MonthlyStatistic monthlyStatistic; 
								String statisticBodyHTML="";
								
								int aShiftTotal,bxShiftTotal,cShiftTotal,dxShiftTotal,oShiftTotal,allShiftTotal;
								for (String itoId:itoIdList)
								{
									iTOYearlyStatistic= yearlyRosterStatistic.get(itoId);
									month=1;
									aShiftTotal=0;bxShiftTotal=0;cShiftTotal=0;
									dxShiftTotal=0;oShiftTotal=0;allShiftTotal=0;
									statisticBodyHTML="";
									for (i=0;i<iTOYearlyStatistic.getITOMonthlyStatisticList().size();i++)
									{
										monthlyStatistic=iTOYearlyStatistic.getITOMonthlyStatisticList().get(i);
										statisticBodyHTML+="<tr>";
										statisticBodyHTML+="<td class=\"borderCell alignCenter\">"+(month++)+"</td>";
										statisticBodyHTML+="<td class=\"borderCell alignCenter\">"+monthlyStatistic.getAShiftTotal()+"</td>";
										statisticBodyHTML+="<td class=\"borderCell alignCenter\">"+monthlyStatistic.getBxShiftTotal()+"</td>";
										statisticBodyHTML+="<td class=\"borderCell alignCenter\">"+monthlyStatistic.getCShiftTotal()+"</td>";
										statisticBodyHTML+="<td class=\"borderCell alignCenter\">"+monthlyStatistic.getDxShiftTotal()+"</td>";
										statisticBodyHTML+="<td class=\"borderCell alignCenter\">"+monthlyStatistic.getOShiftTotal()+"</td>";
										statisticBodyHTML+="<td class=\"borderCell alignCenter\">"+monthlyStatistic.getMonthlyTotal()+"</td>";
										statisticBodyHTML+="</tr>";
										
										aShiftTotal+=monthlyStatistic.getAShiftTotal();
										bxShiftTotal+=monthlyStatistic.getBxShiftTotal();
										cShiftTotal+=monthlyStatistic.getCShiftTotal();
										dxShiftTotal+=monthlyStatistic.getDxShiftTotal();
										oShiftTotal+=monthlyStatistic.getOShiftTotal();

										allShiftTotal+=monthlyStatistic.getMonthlyTotal();
									}
									out.println("<tr>");
									out.println("<td class=\"borderCell alignCenter\">"+iTOYearlyStatistic.getItoPostName()+"</td>");
									out.println("<td class=\"borderCell alignCenter\">"+aShiftTotal+"</td>");
									out.println("<td class=\"borderCell alignCenter\">"+bxShiftTotal+"</td>");
									out.println("<td class=\"borderCell alignCenter\">"+cShiftTotal+"</td>");
									out.println("<td class=\"borderCell alignCenter\">"+dxShiftTotal+"</td>");
									out.println("<td class=\"borderCell alignCenter\">"+oShiftTotal+"</td>");
									out.println("<td class=\"borderCell alignCenter\">"+allShiftTotal+"</td>");
									out.println("</tr>");
									out.println(statisticBodyHTML);
								}%>
							</table>						
						</div>
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
				<tr>
					<td colspan=33 style="text-align:center">
						<a class="findMissingShiftButton">Find Missing Shift</a>
						<a class="findDuplicateShiftButton">Find Duplicate Shift</a>
						<a class="checkAllButton">is it a valid roster?</a>
						<a class="clearAllButton">Clear All Shift Data</a>
					</td>
				</tr>
				<tr>	
					<td colspan=33 style="text-align:center">	
						<a class="exportButton">Export to Excel File</a>
						<a class="saveRosterToDBButton">Save all data to DB</a>
					</td>
				</tr>												
			</tfoot>
		</table>					
	</body>
</html>		