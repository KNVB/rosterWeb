package util.ui;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Hashtable;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.ITO;
import com.ITORoster;
import com.Roster;
import com.RosterRule;
import com.fasterxml.jackson.databind.ObjectMapper;


import util.calendar.CalendarUtility;
import util.calendar.MonthlyCalendar;
import util.calendar.MyCalendar;

/**
 * Servlet implementation class RosterViewer
 */
@WebServlet("/RosterViewer")
public class RosterViewer extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected int showNoOfPrevDate=2,noOfWorkingDay;
	protected int rosterMonth,rosterYear,htmlIndentation=0;
	protected MyCalendar myCalendar;
	protected Roster roster;
	protected String[] itoIdList ;
	protected Hashtable<String,ITO> itoList;
	protected Hashtable<String,ITORoster> itoRosterList;
	protected Hashtable<Integer,MyCalendar> myCalendarList;
	
	protected static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	protected ObjectMapper objectMapper = new ObjectMapper();
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RosterViewer() {
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
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out=response.getWriter();
		GregorianCalendar now=new GregorianCalendar();
		noOfWorkingDay=0;
		response.setContentType("text/html; charset=UTF-8");
		try
		{
			rosterYear=Integer.parseInt(request.getParameter("year"));
			rosterMonth=Integer.parseInt(request.getParameter("month"));
		}
		catch  (NumberFormatException nfe)
		{
			rosterYear=now.get(Calendar.YEAR);
			rosterMonth=now.get(Calendar.MONTH);
		}
		getData();
		printHTMLHeader(out,request);
		printHTMLBody(out);
	}
	protected String getIndentation()
	{
		String result="";
		for (int i=0;i<htmlIndentation;i++)
		{
			result+="\t";
		}
		return result;
	}
	
	protected void getData() 
	{
		ITO ito;
		roster=new Roster();
		CalendarUtility calendarUtility=new CalendarUtility();
		MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(rosterYear,rosterMonth);
		
		myCalendarList=mc.getMonthlyCalendar();
		try
		{
			ito=new ITO();
			itoList=ito.getITOList(rosterYear,rosterMonth);
			itoIdList = itoList.keySet().toArray(new String[0]);
			Arrays.sort(itoIdList);
			itoRosterList=roster.getRoster(rosterYear,rosterMonth, itoIdList);
		}
		catch (Exception err)
		{
			err.printStackTrace();
		}
	}
	private void printHTMLBody(PrintWriter out) 
	{
		out.println(getIndentation()+"<body>");
		htmlIndentation++;
		out.println(getIndentation()+"<table border=\"0\" id=\"rosterTable\">");
		printRosterTableHeader(out);
		printRosterTableBody(out);
		printRosterTableFooter(out);
		htmlIndentation--;
		out.println(getIndentation()+"</table>");
		htmlIndentation--;
		printOnDomReadyFunction(out);
		out.println(getIndentation()+"</body>");
		out.println("</html>");
	}
	protected void printHTMLHeader(PrintWriter out,HttpServletRequest request)
	{
		out.println("<html>");
		htmlIndentation++;
		out.println(getIndentation()+"<head>");
		htmlIndentation++;
		out.println(getIndentation()+"<meta charset=\"UTF-8\">");
		printHTMLTitle(out);
		printIncludedCSS(out,request);
		printIncludedJavascript(out,request);
		out.println(getIndentation()+"</head>");
	}
	protected void printHTMLTitle(PrintWriter out)
	{
		out.println(getIndentation()+"<title>RosterViewer</title>");
	}
	protected void printIncludedCSS(PrintWriter out,HttpServletRequest request)
	{
		out.println(getIndentation()+"<link rel=\"stylesheet\" type=\"text/css\" href=\""+request.getContextPath()+"/css/style.css\">");
	}
	protected void printIncludedJavascript(PrintWriter out,HttpServletRequest request)
	{
		out.println(getIndentation()+"<script type=\"text/javascript\" src=\""+request.getContextPath()+"/webjars/jquery/3.3.1/jquery.min.js\"></script>");
		out.println(getIndentation()+"<script src=\""+request.getContextPath()+"/js/RosterTable.js\"></script>");
		out.println(getIndentation()+"<script src=\""+request.getContextPath()+"/js/util/ShiftCellEventHandler.js\"></script>");
		out.println(getIndentation()+"<script src=\""+request.getContextPath()+"/js/util/Utility.js\"></script>");
	}
	protected void printOnDomReadyFunction(PrintWriter out)
	{
		try
		{
			out.println(getIndentation()+"<script>");
			htmlIndentation++;
			
			out.println(getIndentation()+"$( document ).ready(function() {");
			htmlIndentation++;
			out.println(getIndentation()+"var rosterTable=new RosterTable();");
			out.println(getIndentation()+"rosterTable.itoIdList="+objectMapper.writeValueAsString(itoIdList)+";");
			out.println(getIndentation()+"rosterTable.noOfWorkingDay="+noOfWorkingDay+";");
			out.println(getIndentation()+"rosterTable.itoRosterList="+objectMapper.writeValueAsString(itoRosterList)+";");
			out.println(getIndentation()+"rosterTable.shiftHourCount="+objectMapper.writeValueAsString(RosterRule.getShiftHourCount())+";");
			out.println(getIndentation()+"rosterTable.showRosterData();");
			out.println(getIndentation()+"var shiftCellEventHandler=new ShiftCellEventHandler(rosterTable,\"cursorCell\");");
			htmlIndentation--;
			out.println(getIndentation()+"});");
			htmlIndentation--;
			out.println(getIndentation()+"</script>");

		}
		catch (Exception err)
		{
			err.printStackTrace();
		}
	}
	protected void printPrevDateHeaderCell(PrintWriter out)
	{
		for (int i=0;i<showNoOfPrevDate;i++)
		{
			out.println(getIndentation()+"<td class=\"dataCell alignCenter borderCell\"></td>");
		}
	}
	private void printRosterTableHeader(PrintWriter out)
	{
		int i;
		htmlIndentation++;
		out.println(getIndentation()+"<thead id=\"rosterHeader\">");
		htmlIndentation++;
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"nameCell\"></td>");
		out.println(getIndentation()+"<td colspan=\"2\"></td>");
		out.println(getIndentation()+"<td class=\"alignCenter titleCell underlineText\" colspan=\"31\">");
		htmlIndentation++;
		out.println(getIndentation()+"	EMSTF Resident Support &amp; Computer Operation Support Services Team Roster");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td class=\"totalHourCell\"><br></td>");
		out.println(getIndentation()+"<td class=\"actualHourCell\"><br></td>");
		out.println(getIndentation()+"<td class=\"lastMonthCell\"><br></td>");
		out.println(getIndentation()+"<td class=\"thisMonthCell\"><br></td>");
		out.println(getIndentation()+"<td class=\"totalCell\"><br></td>");
		out.println(getIndentation()+"<td class=\"totalNoOfCell\"><br></td>");
		out.println(getIndentation()+"<td class=\"totalNoOfCell\"><br></td>");
		out.println(getIndentation()+"<td class=\"totalNoOfCell\"><br></td>");
		out.println(getIndentation()+"<td class=\"totalNoOfCell\"><br></td><td class=\"noOfWorkingDay\"><br></td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr id=\"rosterMonthRow\">");
		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"nameCell\">");
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td colspan=\"2\"></td>");
		out.println(getIndentation()+"<td colspan=\"31\" class=\"underlineText alignCenter rosterMonthSelectCell\">");
		htmlIndentation++;
		out.println(getIndentation()+"<form method=\"post\">");
		htmlIndentation++;
		out.println(getIndentation()+"<select id=\"selectRosterMonth\" name=\"month\" class=\"underlineText rosterMonthSelect\" onchange=\"this.form.submit()\">");
		htmlIndentation++;
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.JANUARY)?"selected":"")+"value=\""+Calendar.JANUARY+"\">January</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.FEBRUARY)?"selected":"")+"value=\""+Calendar.FEBRUARY+"\">February</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.MARCH)?"selected":"")+"value=\""+Calendar.MARCH+"\">March</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.APRIL)?"selected":"")+"value=\""+Calendar.APRIL+"\">April</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.MAY)?"selected":"")+"value=\""+Calendar.MAY+"\">May</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.JUNE)?"selected":"")+"value=\""+Calendar.JUNE+"\">June</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.JULY)?"selected":"")+"value=\""+Calendar.JULY+"\">July</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.AUGUST)?"selected":"")+"value=\""+Calendar.AUGUST+"\">August</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.SEPTEMBER)?"selected ":"")+"value=\""+Calendar.SEPTEMBER+"\">September</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.OCTOBER)?"selected ":"")+"value=\""+Calendar.OCTOBER+"\">October</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.NOVEMBER)?"selected ":"")+"value=\""+Calendar.NOVEMBER+"\">November</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Calendar.DECEMBER)?"selected ":"")+"value=\""+Calendar.DECEMBER+"\">December</option>");
		htmlIndentation--;
		out.println(getIndentation()+"</select>"+rosterYear);
		out.println(getIndentation()+"<input type=\"hidden\" name=\"year\" value=\""+rosterYear+"\">");
		htmlIndentation--;
		out.println(getIndentation()+"</form>");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td colspan=\"10\"></td>");		
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr id=\"holidayRow\">");
		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"nameCell borderCell\">Holiday</td>");
		printPrevDateHeaderCell(out);
		for (i=0;i<31;i++)
		{
			if (i< myCalendarList.size())
			{
				myCalendar= myCalendarList.get(i+1);
				if (myCalendar.isPublicHoliday())
				{
					out.println(getIndentation()+"<td class=\"dataCell alignCenter borderCell phCell\">PH</td>");	
				}
				else
				{
					out.println(getIndentation()+"<td class=\"dataCell alignCenter borderCell phCell\"></td>");
				}
			}
			else
			{
				out.println(getIndentation()+"<td class=\"dataCell alignCenter borderCell phCell\"></td>");
			}
		}
		out.println(getIndentation()+"<td class=\"borderCell\" colspan=\"10\"></td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr id=\"dayRow\">");
		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"nameCell borderCell\">Days</td>");
		printPrevDateHeaderCell(out);
		for (i=0;i<31;i++)
		{
			String className="dataCell alignCenter borderCell";
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
					case Calendar.FRIDAY:out.println(getIndentation()+"<td class=\""+className+"\">F</td>");
										break;
					case Calendar.MONDAY:out.println(getIndentation()+"<td class=\""+className+"\">M</td>");
											break;
					case Calendar.SATURDAY:out.println(getIndentation()+"<td class=\""+className+"\">S</td>");
											break;
					case Calendar.SUNDAY:out.println(getIndentation()+"<td class=\""+className+"\">Su</td>");
										 break;
					case Calendar.TUESDAY:out.println(getIndentation()+"<td class=\""+className+"\">T</td>");
										break;
					case Calendar.THURSDAY:out.println(getIndentation()+"<td class=\""+className+"\">Th</td>");
										break;
					case Calendar.WEDNESDAY:out.println(getIndentation()+"<td class=\""+className+"\">W</td>");
										break;
										 
				}
			}
			else
				out.println(getIndentation()+"<td class=\""+className+"\"></td>");
		}
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\" rowspan=\"2\">Total<br>Hour</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\" rowspan=\"2\">Actual<br>Hour</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\" colspan=\"8\">Hour Off Due</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr id=\"dateRow\">");
		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"nameCell borderCell\">Resident Support<br>Team Members</td>");
		printPrevDateHeaderCell(out);
		for (i=0;i<31;i++)
		{
			if (i< myCalendarList.size())
			{
				out.println(getIndentation()+"<td class=\"dataCell alignCenter borderCell\">"+(i+1)+"</td>");
			}
			else
				out.println(getIndentation()+"<td class=\"dataCell alignCenter borderCell\"></td>");	
		}
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\">Last<br>Month</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\">This<br>Month</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\">Total</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\">Total No. of<br>A shift</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\">Total No. of<br>Bx shift</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\">Total No. of<br>C shift</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\">Total No. of<br>Dx shift</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\">No. of<br>working<br>day</td>");				
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		htmlIndentation--;
		out.println(getIndentation()+"</thead>");
	}
	private void printRosterTableBody(PrintWriter out)
	{
		out.println(getIndentation()+"<tbody id=\"rosterBody\">");
		out.println(getIndentation()+"</tbody>");
	}
	protected void printRosterTableFooter(PrintWriter out)
	{
		out.println(getIndentation()+"<tfoot id=\"rosterFooter\">");
		htmlIndentation++;
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\"44\"><br></td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"aShiftColor\">");	
		htmlIndentation++;
		out.println(getIndentation()+"a : 0800H - 1700H");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td colspan=\"20\" rowspan=10 id=\"autoScheduler\">");
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td colspan=\"11\" rowspan=10 id=\"yearlyStat\">");
		out.println(getIndentation()+"</td>");
	
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"bShiftColor\">");	
		htmlIndentation++;
		out.println(getIndentation()+"b : 1630H - 2215H");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"bShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"b1: 1500H - 2215H");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"cShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"c : 2145H - 0830H (the next day)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"dxShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"d : 0800H - 1800H (on weekdays)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"dxShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"d1 : 0800H - 1700H (on weekdays)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"dxShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"d2 : 0900H - 1800H (on weekdays)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");				
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"dxShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"d3 : 0800H - 1648H (on weekdays)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"sickLeaveColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"s : sick leave standby");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=13 class=\"oShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"O : dayoff");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		htmlIndentation--;
		out.println(getIndentation()+"</tfoot>");
	}
}
