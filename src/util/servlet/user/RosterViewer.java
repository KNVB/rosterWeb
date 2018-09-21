package util.servlet.user;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
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

import util.calendar.CalendarUtility;
import util.calendar.MonthlyCalendar;
import util.calendar.MyCalendar;
/**
 * Servlet implementation class RosterViewer
 */
public class RosterViewer extends HttpServlet
{
	private static final long serialVersionUID = 1L;
	protected int showNoOfPrevDate=2;
	protected ArrayList<Integer>aShiftData; 
	protected ArrayList<Integer>bShiftData;
	protected ArrayList<Integer>cShiftData;
	public RosterViewer()
	{
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
		out.println("<html>");
		printHTMLHeader(request,out);
		printHTMLBody(request,out);
		out.println("</html>");
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
	protected void printEmptyShiftRow(PrintWriter out,String itoId)
	{
		for (int i=0;i<31;i++)
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
	protected void printAutoScheduler(PrintWriter out,Hashtable<Integer,MyCalendar> myCalendarList)
	{
		
	}
	protected void printAutoSchedulerResult(PrintWriter out)
	{
		
	}
	protected void printHTMLBody(HttpServletRequest request,PrintWriter out)
	{
		out.println("\t<body>");
		printRosterTable(request,out);
		out.println("\t</body>");
	}
	protected void printHTMLHeader(HttpServletRequest request,PrintWriter out)
	{
		out.println("\t<head>");
		out.println("\t\t<meta charset=\"UTF-8\">");
		printHTMLTitle(out);
		printIncludedCSS(request,out);
		printIncludedJavascript(request,out);
		printOnDomReadyFunction(request,out);
		out.println("\t</head>");
	}
	protected void printHTMLTitle(PrintWriter out)
	{
		out.println("\t\t<title>RosterViewer</title>");
	}
	protected void printIncludedCSS(HttpServletRequest request,PrintWriter out)
	{
		out.println("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"css/style.css\">");
	}
	protected void printIncludedJavascript(HttpServletRequest request,PrintWriter out)
	{
		out.println("\t\t<script type=\"text/javascript\" src=\""+request.getContextPath()+"/webjars/jquery/3.3.1/jquery.min.js\"></script>");
		out.println("\t\t<script src=\"js/ITO.js\"></script>");
		out.println("\t\t<script src=\"js/RosterRule.js\"></script>");
		out.println("\t\t<script src=\"js/RosterTable.js\"></script>");
		out.println("\t\t<script src=\"js/RosterViewer.js\"></script>");
		out.println("\t\t<script src=\"js/util/ShiftCellEventHandler.js\"></script>");
		out.println("\t\t<script src=\"js/util/Utility.js\"></script>");
	}
	protected void printITORoster(PrintWriter out,Hashtable<Integer, MyCalendar> myCalendarList, Hashtable<String, ITORoster> itoRosterList, Hashtable<String, ITO> itoList, String[] itoIdList, int noOfWorkingDay)
	{
		try
		{
			aShiftData=new ArrayList<Integer>(); 
			bShiftData=new ArrayList<Integer>(); 
			cShiftData=new ArrayList<Integer>(); 
			for (String itoId:itoIdList)
			{
				printShiftRow(out,myCalendarList,itoRosterList.get(itoId),itoList.get(itoId), noOfWorkingDay);
				printPreferredShiftRow(out,itoRosterList.get(itoId),itoList.get(itoId));
			}
			printVacantShiftRow(out);
		}
		catch (Exception err)
		{
			err.printStackTrace();
		}		
	}
	protected void printOnDomReadyFunction(HttpServletRequest request,PrintWriter out) 
	{
		out.println("\t\t<script>");
		out.println("\t\t\tvar utility=new Utility(\""+request.getContextPath()+"/middleware/\");");
		out.println("\t\t\t$( document ).ready(function() {");
		out.println("\t\t\t\tvar rosterViewer=new RosterViewer(utility);");
		out.println("\t\t\t});");

		out.println("\t\t</script>");
	}
	protected void printPrevDateHeaderCell(PrintWriter out)
	{
		for (int i=0;i<showNoOfPrevDate;i++)
		{
			out.println("					<td class=\"dataCell alignCenter borderCell\"></td>");
		}
	}
	protected void printPreferredShiftRow(PrintWriter out, ITORoster itoRoster,ITO ito)
	{
	}
	protected void printRosterBody(HttpServletRequest request, PrintWriter out,
			Hashtable<Integer, MyCalendar> myCalendarList,Hashtable<String,ITO> itoList, Hashtable<String,ITORoster> itoRosterList,String[] itoIdList, int noOfWorkingDay) 
	{
			
			
				out.println("\t\t\t<tbody id=\"rosterBody\">");
				printITORoster(out,myCalendarList,itoRosterList,itoList,itoIdList,noOfWorkingDay);
				out.println("\t\t\t</tbody>");
						
	}
	protected void printRosterFooter(PrintWriter out,Hashtable<Integer,MyCalendar> myCalendarList,Roster roster,String[] itoIdList,int year,int month)
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
		printAutoScheduler(out, myCalendarList);
		printAutoSchedulerResult(out);
		out.println("					</td>");
		out.println("					<td colspan=\"11\" rowspan=\"23\">");
		printYearlyStatistic(out,roster,itoIdList,year,month);
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
		printRosterSchedulerButton(out);
		out.println("			</tfoot>");
	}
	protected int printRosterHeader(HttpServletRequest request,PrintWriter out,Hashtable<Integer,MyCalendar> myCalendarList,int year,int month)
	{
		int i,noOfWorkingDay=0;
		MyCalendar myCalendar;
		String className;
		out.println("\t\t\t<thead id=\"rosterHeader\">");
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
		out.println("						</select>"+year);
		out.println("					</td>");
		out.println("					<td colspan=\"10\"></td>");
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
		out.println("\t\t\t</thead>");
		return noOfWorkingDay;
	}
	protected void printRosterSchedulerButton(PrintWriter out)
	{
		
	}
	protected void printRosterTable(HttpServletRequest request,PrintWriter out)
	{
		CalendarUtility calendarUtility=new CalendarUtility();
		GregorianCalendar now=new GregorianCalendar();
		int month=now.get(Calendar.MONTH);
		int noOfWorkingDay;
		int year=now.get(Calendar.YEAR);
		MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(year,month);
		Hashtable<Integer,MyCalendar> myCalendarList=mc.getMonthlyCalendar();
		Hashtable<String,ITORoster> itoRosterList;
		Hashtable<String,ITO> itoList;
		
		ITO ito;
					
		Roster roster=new Roster();
		try
		{
			ito=new ITO();
			itoList=ito.getITOList(year,month);
			roster.setRosterYear(year);
			roster.setRosterMonth(month);
			
			String[] itoIdList ;
	
			itoIdList = itoList.keySet().toArray(new String[0]);
			Arrays.sort(itoIdList);
	
			roster.load();
			itoRosterList=roster.getITORosterList();
	
			
			out.println("\t\t<table border=\"0\" id=\"rosterTable\">");
			noOfWorkingDay=printRosterHeader(request,out,myCalendarList,year,month);
			printRosterBody(request,out,myCalendarList,itoList,itoRosterList,itoIdList,noOfWorkingDay);
			printRosterFooter(out,myCalendarList,roster,itoIdList,year,month);
			out.println("\t\t</table>");
			roster=null;
		}
		catch (Exception err)
		{
			err.printStackTrace();
		}
	}
	protected void printVacantShiftRow(PrintWriter out)
	{
		
	}
	protected void printShiftRow(PrintWriter out, Hashtable<Integer,MyCalendar> myCalendarList, ITORoster itoRoster,ITO ito,int noOfWorkingDay) 
	{
		float actualWorkingHour, thisMonthBalance,thisMonthHourTotal,totalHour;
		int startIndex,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount,i;

		String shiftType;

		totalHour=(noOfWorkingDay*ito.getWorkingHourPerDay());

		out.println("				<tr id=\"shift_"+ito.getItoId()+"\">");
		out.println("					<td class=\"borderCell alignLeft\">"+ito.getItoName()+"<br>"+ito.getPostName()+" Extn. 2458</td>");
		if (itoRoster==null)
		{
			printEmptyRow(out,ito.getItoId());
		}
		else
		{
			startIndex=itoRoster.getPreviousMonthShiftList().size()-showNoOfPrevDate;
			for (i=startIndex;i<itoRoster.getPreviousMonthShiftList().size();i++)
			{
				out.println("					\t<script>utility.printPreviousMonthShiftCell(\""+itoRoster.getPreviousMonthShiftList().get(i).getShift()+"\");</script>");
			}
			if (itoRoster.getShiftList().isEmpty())
			{
				printEmptyShiftRow(out, ito.getItoId());
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
						out.println("					\t<script>utility.printShiftCell(\""+shiftType+"\");</script>");
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
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_totalHour\">"+totalHour+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_actualHour\">"+(actualWorkingHour)+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_lastMonthBalance\">"+itoRoster.getBalance()+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_thisMonthHourTotal\"><script>document.write(utility.roundTo("+thisMonthHourTotal+",2));</script></td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_thisMonthBalance\"><script>document.write(utility.roundTo("+thisMonthBalance+",2));</script></td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_aShiftCount\">"+aShiftCount+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_bxShiftCount\">"+bxShiftCount+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_cShiftCount\">"+cShiftCount+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_dxShiftCount\">"+dxShiftCount+"</td>");
				out.println("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_noOfWoringDay\">"+(aShiftCount+bxShiftCount+cShiftCount+dxShiftCount)+"</td>");
				aShiftData.add(aShiftCount); 
				bShiftData.add(bxShiftCount); 
				cShiftData.add(cShiftCount); 
			}
		}
		out.println("				</tr>");		
		
	}
	protected void printYearlyStatistic(PrintWriter out,Roster roster,String[]itoIdList,int year,int month)
	{
		
	}
}
