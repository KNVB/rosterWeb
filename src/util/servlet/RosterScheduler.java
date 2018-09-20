package util.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Hashtable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ITO;
import com.ITORoster;
import com.Roster;
import com.RosterRule;
import com.rosterStatistic.ITOYearlyStatistic;
import com.rosterStatistic.MonthlyStatistic;

import util.calendar.CalendarUtility;
import util.calendar.MonthlyCalendar;
import util.calendar.MyCalendar;

/**
 * Servlet implementation class RosterScheduler
 */
public class RosterScheduler extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private int i=0,year,month;
	private int showNoOfPrevDate=2,noOfWorkingDay=0; 
	private Hashtable<String,ITO> itoList;
	private Hashtable<String,ITORoster> itoRosterList;
	private Hashtable<Integer,MyCalendar> myCalendarList;
	private Hashtable<String,ITOYearlyStatistic> yearlyRosterStatistic;
	private MyCalendar myCalendar;
	private String className=new String();
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RosterScheduler() {
        super();

    }
    /**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		PrintWriter out=response.getWriter();
		response.setContentType("text/html; charset=UTF-8");

		//startIndex;

		GregorianCalendar now=new GregorianCalendar();
		year=now.get(Calendar.YEAR);
		month=now.get(Calendar.MONTH);
		//year=2018;
		//month=9;
		ITO ito;
		try 
		{
			ito = new ITO();
			
			CalendarUtility calendarUtility=new CalendarUtility();
			itoList=ito.getITOList(year,month);
			MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(year,month);
			myCalendarList=mc.getMonthlyCalendar();
			
			Roster roster=new Roster();
			roster.setRosterYear(year);
			roster.setRosterMonth(month);
			roster.load();
			itoRosterList=roster.getITORosterList();
			yearlyRosterStatistic=roster.getYearlyStatistic(year, month);
			printHeader(request, out);
			printBody(out);
			printFooter(out);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}
	private void printBody(PrintWriter out)
	{
		String[] itoIdList = itoList.keySet().toArray(new String[0]);
		Arrays.sort(itoIdList);
		out.println("			<tbody id=\"rosterBody\">");
		for (String itoId:itoIdList)
		{
			printShiftRow(out,itoId);
			printPreferredShiftRow(out,itoId);
		}
		printVacantShiftRow(out);
		out.println("			</tbody>");
	}	
	private void printEmptyRow(PrintWriter out,String itoId)
	{
		int i;
		for (i=0;i<showNoOfPrevDate;i++)
		{
			out.println("					<td class=\"alignCenter borderCell\"></td>");
		}
		printEmptyShiftRow(out, itoId);
	}
	private void printEmptyShiftRow(PrintWriter out,String itoId)
	{
		for (i=0;i<31;i++)
		{
			out.println("					<td class=\"shiftCell alignCenter borderCell\"></td>");
		}
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_totalHour\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_actualHour\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_lastMonthBalance\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_thisMonthHourTotal\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_thisMonthBalance\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_aShiftCount\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_bxShiftCount\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_cShiftCount\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_dxShiftCount\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_noOfWoringDay\"></td>");
	}
	private void printFooter(PrintWriter out)
	{
		out.println("			<tfoot>");
		out.println("				<tr>");
		out.println("					<td colspan=\"44\">");
		out.println("						<br>");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"aShiftColor\">");	
		out.println("					a : 0800H - 1700H");
		out.println("					</td>");
		out.println("					<td colspan=\"20\" rowspan=10>");
		out.println("						<div style=\"text-align:center\">");
		out.println("							Auto Planning Start From:");
		out.println("							<select id=\"autoPlannStartDate\">");
		for (i=1 ;i<=myCalendarList.size();i++)
		{
			out.println("								<option value="+i+">"+i+"</option>");									
		}
		out.println("							</select>");
		out.println("							to");
		out.println("							<select id=\"autoPlanEndDate\">");
		for (i=1 ;i<=myCalendarList.size();i++)
		{
			if (i==myCalendarList.size())
				out.println("								<option value="+i+" selected>"+i+"</option>");
			else									
				out.println("								<option value="+i+">"+i+"</option>");									
		}	
		out.println("							</select>");
		out.println("							<a class=\"autoPlannerButton\">Auto Planner</a>");
		out.println("						</div>");
		out.println("						<div style=\"padding-left:10px;display:none\" id=\"genResult\">");
		out.println("							<table border=0>");
		out.println("								<tr>");
		out.println("									<td>Standard Deviation:</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"theLowestSD\">");
		out.println("									<td>1</td>");
		out.println("									<td>1</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"secondLowestSD\">");
		out.println("									<td>1</td>");
		out.println("									<td>1</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"thirdLowestSD\">");
		out.println("									<td >1</td>");
		out.println("									<td>1</td>");
		out.println("								</tr>");
		out.println("								<tr>");
		out.println("									<td><br></td>");
		out.println("								</tr>");
		out.println("								<tr>");
		out.println("									<td>Missing shift Count:</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"theLowestMissingShiftCount\">");
		out.println("									<td>1</td>");
		out.println("									<td>1</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"theSecondLowestMissingShiftCount\">");
		out.println("									<td>1</td>");
		out.println("									<td>1</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"theThirdLowestMissingShiftCount\">");
		out.println("									<td>1</td>");
		out.println("									<td>1</td>");
		out.println("								</tr>");			
		out.println("							</table>");
		out.println("						</div>");
		out.println("					</td>");
		out.println("					<td colspan=\"11\" rowspan=\"13\">");
		out.println("						<div id=\"yearlyStatistic\">");
		out.println("							<table style=\"width:500px;borderCollapse:collapse\">");
		out.println("								<tr>");
		out.println("									<td class=\"borderCell alignCenter\">ITO</td>");
		out.println("									<td class=\"borderCell alignCenter\">a</td>");
		out.println("									<td class=\"borderCell alignCenter\">bx</td>");
		out.println("									<td class=\"borderCell alignCenter\">c</td>");
		out.println("									<td class=\"borderCell alignCenter\">dx</td>");
		out.println("									<td class=\"borderCell alignCenter\">O</td>");
		out.println("									<td class=\"borderCell alignCenter\">total</td>");
		out.println("								</tr>");
		String[] itoIdList = itoList.keySet().toArray(new String[0]);
		Arrays.sort(itoIdList);
		MonthlyStatistic monthlyStatistic; 
		String statisticBodyHTML="";
		ITOYearlyStatistic iTOYearlyStatistic;
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
				statisticBodyHTML+="								<tr>\n";
				statisticBodyHTML+="									<td class=\"borderCell alignCenter\">"+(month++)+"</td>\n";
				statisticBodyHTML+="									<td class=\"borderCell alignCenter\">"+monthlyStatistic.getAShiftTotal()+"</td>\n";
				statisticBodyHTML+="									<td class=\"borderCell alignCenter\">"+monthlyStatistic.getBxShiftTotal()+"</td>\n";
				statisticBodyHTML+="									<td class=\"borderCell alignCenter\">"+monthlyStatistic.getCShiftTotal()+"</td>\n";
				statisticBodyHTML+="									<td class=\"borderCell alignCenter\">"+monthlyStatistic.getDxShiftTotal()+"</td>\n";
				statisticBodyHTML+="									<td class=\"borderCell alignCenter\">"+monthlyStatistic.getOShiftTotal()+"</td>\n";
				statisticBodyHTML+="									<td class=\"borderCell alignCenter\">"+monthlyStatistic.getMonthlyTotal()+"</td>\n";
				statisticBodyHTML+="								</tr>\n";
				
				aShiftTotal+=monthlyStatistic.getAShiftTotal();
				bxShiftTotal+=monthlyStatistic.getBxShiftTotal();
				cShiftTotal+=monthlyStatistic.getCShiftTotal();
				dxShiftTotal+=monthlyStatistic.getDxShiftTotal();
				oShiftTotal+=monthlyStatistic.getOShiftTotal();

				allShiftTotal+=monthlyStatistic.getMonthlyTotal();
			}
			out.println("								<tr>");
			out.println("									<td class=\"borderCell alignCenter\">"+iTOYearlyStatistic.getItoPostName()+"</td>");
			out.println("									<td class=\"borderCell alignCenter\">"+aShiftTotal+"</td>");
			out.println("									<td class=\"borderCell alignCenter\">"+bxShiftTotal+"</td>");
			out.println("									<td class=\"borderCell alignCenter\">"+cShiftTotal+"</td>");
			out.println("									<td class=\"borderCell alignCenter\">"+dxShiftTotal+"</td>");
			out.println("									<td class=\"borderCell alignCenter\">"+oShiftTotal+"</td>");
			out.println("									<td class=\"borderCell alignCenter\">"+allShiftTotal+"</td>");
			out.println("								</tr>");
			out.println(statisticBodyHTML);
		}
		out.println("							</table>");
		out.println("						</div>");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"bShiftColor\">");	
		out.println("						b : 1630H - 2215H");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"bShiftColor\">");
		out.println("						b1: 1500H - 2215H");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"cShiftColor\">");
		out.println("						c : 2145H - 0830H (the next day)");
		out.println("					</td>");			
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"dxShiftColor\">");
		out.println("						d : 0800H - 1800H (on weekdays)");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"dxShiftColor\">");
		out.println("						d1 : 0800H - 1700H (on weekdays)");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"dxShiftColor\">");
		out.println("						d2 : 0900H - 1800H (on weekdays)");
		out.println("					</td>");				
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"dxShiftColor\">");
		out.println("						d3 : 0800H - 1648H (on weekdays)");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"sickLeaveColor\">");
		out.println("						s : sick leave standby");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=13 class=\"oShiftColor\">");
		out.println("						O : dayoff");
		out.println("					</td>");
		out.println("				</tr>");							
		out.println("				<tr>");
		out.println("					<td colspan=\"33\">");
		out.println("						<br>");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=33 style=\"text-align:center\">");
		out.println("						<a class=\"findMissingShiftButton\">Find Missing Shift</a>");
		out.println("						<a class=\"findDuplicateShiftButton\">Find Duplicate Shift</a>");
		out.println("						<a class=\"checkAllButton\">is it a valid roster?</a>");
		out.println("						<a class=\"clearAllButton\">Clear All Shift Data</a>");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=33 style=\"text-align:center\">");
		out.println("						<a class=\"exportButton\">Export to Excel File</a>");
		out.println("						<a class=\"saveRosterToDBButton\">Save all data to DB</a>");
		out.println("					</td>");
		out.println("				</tr>");		
		out.println("			</tfoot>");
		out.println("		</table>");
		out.println("	</body>");
		out.println("</html>");			
	}
	private void printHeader(HttpServletRequest request,PrintWriter out)
	{
		out.println("<html>");
		out.println("	<head>");
		out.println("		<meta charset=\"UTF-8\">");
		out.println("		<title>Roster Scheduling</title>");
		out.println("		<link rel=\"stylesheet\" type=\"text/css\" href=\"css/style.css\">");
		out.println("		<script type=\"text/javascript\" src=\""+request.getContextPath()+"/webjars/jquery/3.3.1/jquery.min.js\"></script>");
		
		out.println("		<script src=\""+request.getContextPath()+"/js/ITO.js\"></script>");
		out.println("		<script src=\""+request.getContextPath()+"/js/RosterRule.js\"></script>");
		out.println("		<script src=\""+request.getContextPath()+"/js/RosterViewer.js\"></script>");
		out.println("		<script src=\""+request.getContextPath()+"/js/util/ShiftCellEventHandler.js\"></script>");
		out.println("		<script src=\""+request.getContextPath()+"/js/util/Utility.js\"></script>");

		out.println("		<script src=\"admin/js/util/MyModal.js\"></script>");
		out.println("		<script src=\"admin/js/util/MyLoadingScreen.js\"></script>");
		out.println("		<script src=\"admin/js/RosterTable.js\"></script>");
		out.println("		<script src=\"admin/js/RosterScheduler.js\"></script>");		
		                                  
		out.println("		<script>");
		out.println("			var utility=new Utility(\""+request.getContextPath()+"/middleware/\");");
		out.println("			$( document ).ready(function() {");
		out.println("				var rosterScheduler=new RosterScheduler(utility);");
		out.println("			});");
		out.println("		</script>");
		out.println("	</head>");
		out.println("	<body>");
		out.println("		<table border=\"0\" id=\"rosterTable\">");
		out.println("			<thead id=\"rosterHeader\">");
		out.println("				<tr>");
		out.println("					<td class=\"nameCell\"></td>");
		out.println("					<td colspan=\"2\"></td>");
		out.println("					<td class=\"alignCenter titleCell underlineText\" colspan=\"31\">");
		out.println("						EMSTF Resident Support &amp; Computer Operation Support Services Team Roster");
		out.println("					</td>");
		out.println("					<td class=\"totalHourCell\"><br></td>");
		out.println("					<td class=\"actualHourCell\"><br></td>");
		out.println("					<td class=\"lastMonthCell\"><br></td>");
		out.println("					<td class=\"thisMonthCell\"><br></td>");
		out.println("					<td class=\"totalCell\"><br></td>");
		out.println("					<td class=\"totalNoOfCell\"><br></td>");
		out.println("					<td class=\"totalNoOfCell\"><br></td>");
		out.println("					<td class=\"totalNoOfCell\"><br></td>");
		out.println("					<td class=\"totalNoOfCell\"><br></td><td class=\"noOfWorkingDay\"><br></td>");
		out.println("				</tr>");
		out.println("				<tr id=\"rosterMonthRow\">");
		out.println("					<td class=\"nameCell\">");
		out.println("					</td><td colspan=\"2\"></td>");
		out.println("					<td colspan=\"31\" class=\"underlineText alignCenter rosterMonthSelectCell\">");
		out.println("						<select id=\"selectRosterMonth\" class=\"underlineText rosterMonthSelect\">");
		out.println("							<option "+((month==Calendar.JANUARY)?"selected":"")+" value=\""+Calendar.JANUARY+"\">January</option>");
		out.println("							<option "+((month==Calendar.FEBRUARY)?"selected":"")+" value=\""+Calendar.FEBRUARY+"\">February</option>");
		out.println("							<option "+((month==Calendar.MARCH)?"selected":"")+" value=\""+Calendar.MARCH+"\">March</option>");
		out.println("							<option "+((month==Calendar.APRIL)?"selected":"")+" value=\""+Calendar.APRIL+"\">April</option>");
		out.println("							<option "+((month==Calendar.MAY)?"selected":"")+" value=\""+Calendar.MAY+"\">May</option>");
		out.println("							<option "+((month==Calendar.JUNE)?"selected":"")+" value=\""+Calendar.JUNE+"\">June</option>");
		out.println("							<option "+((month==Calendar.JULY)?"selected":"")+" value=\""+Calendar.JULY+"\">July</option>");
		out.println("							<option "+((month==Calendar.AUGUST)?"selected":"")+" value=\""+Calendar.AUGUST+"\">August</option>");
		out.println("							<option "+((month==Calendar.SEPTEMBER)?"selected":"")+" value=\""+Calendar.SEPTEMBER+"\">September</option>");
		out.println("							<option "+((month==Calendar.OCTOBER)?"selected":"")+" value=\""+Calendar.OCTOBER+"\">October</option>");
		out.println("							<option "+((month==Calendar.NOVEMBER)?"selected":"")+" value=\""+Calendar.NOVEMBER+"\">November</option>");
		out.println("							<option "+((month==Calendar.DECEMBER)?"selected":"")+" value=\""+Calendar.DECEMBER+"\">December</option>");
		out.println("						</select>2018");
		out.println("					</td>");
		out.println("					<td colspan=\"10\"></td>");
		out.println("				</tr>");
		out.println("				<tr>");
		out.println("					<td colspan=\"44\">");
		out.println("						<br>");
		out.println("					</td>");
		out.println("				</tr>");
		out.println("				<tr id=\"holidayRow\">");
		out.println("					<td class=\"nameCell borderCell\">Holiday</td>");
		printPrevDateHeaderCell(out);
		for (i=0;i<31;i++)
		{
				if (i< myCalendarList.size())
			{
				myCalendar= myCalendarList.get(i+1);
				if (myCalendar.isPublicHoliday())
				{
					out.println("					<td class=\"dataCell alignCenter borderCell phCell\">PH</td>");	
				}
				else
				{
					out.println("					<td class=\"dataCell alignCenter borderCell phCell\"></td>");
				}
			}
			else
			{
				out.println("					<td class=\"dataCell alignCenter borderCell phCell\"></td>");
			}
		}
		out.println("					<td class=\"borderCell\" colspan=\"10\"></td>");				
		out.println("				</tr>");
		out.println("				<tr id=\"weekdayRow\">");
		out.println("					<td class=\"nameCell borderCell\">Days</td>");
		printPrevDateHeaderCell(out);
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
					case Calendar.FRIDAY:out.println("					<td class=\""+className+"\">F</td>");
										break;
					case Calendar.MONDAY:out.println("					<td class=\""+className+"\">M</td>");
											break;
					case Calendar.SATURDAY:out.println("					<td class=\""+className+"\">S</td>");
											break;
					case Calendar.SUNDAY:out.println("					<td class=\""+className+"\">Su</td>");
										 break;
					case Calendar.TUESDAY:out.println("					<td class=\""+className+"\">T</td>");
										break;
					case Calendar.THURSDAY:out.println("					<td class=\""+className+"\">Th</td>");
										break;
					case Calendar.WEDNESDAY:out.println("					<td class=\""+className+"\">W</td>");
										break;
										 
				}
			}
			else
				out.println("					<td class=\""+className+"\"></td>");
		}
		out.println("					<td class=\"alignCenter borderCell\" rowspan=\"2\">Total<br>Hour</td>");
		out.println("					<td class=\"alignCenter borderCell\" rowspan=\"2\">Actual<br>Hour</td>");
		out.println("					<td class=\"alignCenter borderCell\" colspan=\"8\">Hour Off Due</td>");					
		out.println("				</tr>");
		out.println("				<tr id=\"dateRow\">");
		out.println("					<td class=\"nameCell borderCell\">Resident Support<br>Team Members</td>");
		printPrevDateHeaderCell(out);
		for (i=0;i<31;i++)
		{
			if (i< myCalendarList.size())
			{
				out.println("					<td class=\"dataCell alignCenter borderCell\">"+(i+1)+"</td>");
			}
			else
				out.println("					<td class=\"dataCell alignCenter borderCell\"></td>");	
		}
		out.println("					<td class=\"alignCenter borderCell\">Last<br>Month</td>");
		out.println("					<td class=\"alignCenter borderCell\">This<br>Month</td>");
		out.println("					<td class=\"alignCenter borderCell\">Total</td>");
		out.println("					<td class=\"alignCenter borderCell\">Total No. of<br>A shift</td>");
		out.println("					<td class=\"alignCenter borderCell\">Total No. of<br>Bx shift</td>");
		out.println("					<td class=\"alignCenter borderCell\">Total No. of<br>C shift</td>");
		out.println("					<td class=\"alignCenter borderCell\">Total No. of<br>Dx shift</td>");
		out.println("					<td class=\"alignCenter borderCell\">No. of<br>working<br>day</td>");
		out.println("				</tr>");
		out.println("			</thead>");
	}
	private void printPrevDateHeaderCell(PrintWriter out)
	{
		for (int i=0;i<showNoOfPrevDate;i++)
		{
			out.println("					<td class=\"dataCell alignCenter borderCell\"></td>");
		}
	}
	private void printShiftRow(PrintWriter out,String itoId)
	{
		float actualWorkingHour, thisMonthBalance,thisMonthHourTotal,totalHour;
		int startIndex,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount;
		ITO ito;
		ITORoster itoRoster=null;
		String shiftType;
		ito=itoList.get(itoId);
		itoRoster=itoRosterList.get(itoId);
		totalHour=(noOfWorkingDay*ito.getWorkingHourPerDay());

		out.println("				<tr id=\"shift_"+itoId+"\">");
		out.println("					<td class=\"borderCell alignLeft\">"+ito.getItoName()+"<br>"+ito.getPostName()+" Extn. 2458</td>");
		if (itoRoster==null)
		{
			printEmptyRow(out,itoId);
		}
		else
		{
			startIndex=itoRoster.getPreviousMonthShiftList().size()-showNoOfPrevDate;
			for (i=startIndex;i<itoRoster.getPreviousMonthShiftList().size();i++)
			{
				out.println("<script>utility.printPreviousMonthShiftCell(\""+itoRoster.getPreviousMonthShiftList().get(i).getShift()+"\");</script>");
			}
			if (itoRoster.getShiftList().isEmpty())
			{
				printEmptyShiftRow(out, itoId);
			}
			else
			{
				aShiftCount=0;
				bxShiftCount=0;
				cShiftCount=0;
				dxShiftCount=0;
				actualWorkingHour=0.0f;
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
						out.println("					<td class=\"alignCenter borderCell\"></td>");
					}
				}
				thisMonthHourTotal=actualWorkingHour-totalHour;
				thisMonthBalance=thisMonthHourTotal+itoRoster.getBalance();
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_totalHour\">"+totalHour+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_actualHour\">"+(actualWorkingHour)+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_lastMonthBalance\">"+itoRoster.getBalance()+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_thisMonthHourTotal\"><script>document.write(utility.roundTo("+thisMonthHourTotal+",2));</script></td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_thisMonthBalance\"><script>document.write(utility.roundTo("+thisMonthBalance+",2));</script></td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_aShiftCount\">"+aShiftCount+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_bxShiftCount\">"+bxShiftCount+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_cShiftCount\">"+cShiftCount+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_dxShiftCount\">"+dxShiftCount+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_noOfWoringDay\">"+(aShiftCount+bxShiftCount+cShiftCount+dxShiftCount)+"</td>");
			}
		}
		out.println("				</tr>");
	}
	private void printPreferredShiftRow(PrintWriter out,String itoId)
	{
		ITORoster itoRoster=null;
		itoRoster=itoRosterList.get(itoId);
		String shiftType;
		out.println("				<tr id=\"preferredShift_"+itoId+"\">");
		out.println("					<td class=\"borderCell alignLeft\">Preferred Shift</td>");
		printPrevDateHeaderCell(out);
		if (itoRoster.getPreferredShiftList().isEmpty())
		{
			for (i=0;i<31;i++)
			{
				out.println("					<td class=\"shiftCell alignCenter borderCell\"></td>");
			}
			
		}
		else
		{
			for (i=0;i<31;i++)
			{
				shiftType=itoRoster.getPreferredShiftList().get(i+1);
				if (shiftType==null)
				{
					out.println("					<td class=\"alignCenter borderCell shiftCell\"></td>");
				}
				else
				{
					out.println("					<td class=\"alignCenter borderCell shiftCell\">"+shiftType+"</td>");
				}
			}
		}
		out.println("					<td class=\"borderCell alignCenter\" colspan=\"10\"></td>");
		out.println("				</tr>");
	}
	private void printVacantShiftRow(PrintWriter out)
	{
		out.println("				<tr id=\"vancantShift\">");
		out.println("					<td class=\"vancantShift borderCell\">Vancant Shifts</td>");
		for (i=0;i<33;i++)
		{
			out.println("					<td class=\"alignCenter borderCell\"></td>");
		}
		out.println("					<td class=\"alignCenter borderCell\" colspan=\"10\"></td>");
		out.println("				</tr>");
	}
}
