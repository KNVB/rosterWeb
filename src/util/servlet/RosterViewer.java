package util.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.util.Arrays;
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


import util.calendar.MyCalendarUtility;
import util.calendar.MonthlyCalendar;
import util.calendar.MyDate;

/**
 * Servlet implementation class RosterViewer
 */
@WebServlet("/RosterViewer")
public class RosterViewer extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected int showNoOfPrevDate=2,noOfWorkingDay;
	protected int rosterMonth,rosterYear,htmlIndentation=0;
	protected MyDate myDate;
	protected Roster roster;
	protected String[] itoIdList ;
	protected Hashtable<String,ITO> itoList;
	protected Hashtable<String,ITORoster> itoRosterList;
	protected Hashtable<Integer,MyDate> myDateList;
	
	protected static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	protected ObjectMapper objectMapper = new ObjectMapper();
	protected LocalDate now;
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
		now=LocalDate.now();
		noOfWorkingDay=0;
		response.setContentType("text/html; charset=UTF-8");
		try
		{
			rosterYear=Integer.parseInt(request.getParameter("year"));
			rosterMonth=Integer.parseInt(request.getParameter("month"));
		}
		catch  (NumberFormatException nfe)
		{
			rosterYear=now.getYear();
			rosterMonth=now.getMonthValue();
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
		roster=new Roster(rosterYear,rosterMonth);
		logger.debug("rosterYear="+rosterYear+",rosterMonth="+rosterMonth);
		MyCalendarUtility myDateUtility=new MyCalendarUtility();
		MonthlyCalendar mc=myDateUtility.getMonthlyCalendar(rosterYear,rosterMonth);
		
		myDateList=mc.getMonthlyCalendar();
		try
		{
			ito=new ITO();
			itoList=ito.getITOList(rosterYear,rosterMonth);
			itoIdList = itoList.keySet().toArray(new String[0]);
			Arrays.sort(itoIdList);
			itoRosterList=roster.getITORosterList(itoIdList);
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
		printRosterTable(out);
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
		htmlIndentation--;
		out.println(getIndentation()+"</head>");
	}
	protected void printHTMLTitle(PrintWriter out)
	{
		out.println(getIndentation()+"<title>Roster Viewer</title>");
	}
	protected void printIncludedCSS(PrintWriter out,HttpServletRequest request)
	{
		out.println(getIndentation()+"<link rel=\"stylesheet\" type=\"text/css\" href=\""+request.getContextPath()+"/css/style.css\">");
		out.println(getIndentation()+"<link rel=\"stylesheet\" type=\"text/css\" href=\""+request.getContextPath()+"/css/MonthPick.css\">");
	}
	protected void printIncludedJavascript(PrintWriter out,HttpServletRequest request)
	{
		out.println(getIndentation()+"<script type=\"text/javascript\" src=\""+request.getContextPath()+"/webjars/jquery/3.3.1/jquery.min.js\"></script>");
		out.println(getIndentation()+"<script src=\""+request.getContextPath()+"/js/RosterRule.js\"></script>");
		out.println(getIndentation()+"<script src=\""+request.getContextPath()+"/js/RosterTable.js\"></script>");
		out.println(getIndentation()+"<script src=\""+request.getContextPath()+"/js/util/ShiftCellEventHandler.js\"></script>");
		out.println(getIndentation()+"<script src=\""+request.getContextPath()+"/js/util/MonthPicker.js\"></script>");
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
			out.println(getIndentation()+"var rosterRule=new RosterRule();");
			out.println(getIndentation()+"rosterRule.shiftHourCount="+objectMapper.writeValueAsString(RosterRule.getShiftHourCount())+";");
			out.println(getIndentation()+"rosterRule.utility=new Utility();");
			out.println(getIndentation()+"var rosterTable=new RosterTable();");
			out.println(getIndentation()+"rosterTable.monthEndDate="+myDateList.size()+";");
			out.println(getIndentation()+"rosterTable.itoIdList="+objectMapper.writeValueAsString(itoIdList)+";");
			out.println(getIndentation()+"rosterTable.noOfWorkingDay="+noOfWorkingDay+";");
			out.println(getIndentation()+"rosterTable.itoRosterList="+objectMapper.writeValueAsString(itoRosterList)+";");
			out.println(getIndentation()+"rosterTable.rosterRule=rosterRule;");
			out.println(getIndentation()+"rosterTable.show();");
			out.println(getIndentation()+"var shiftCellEventHandler=new ShiftCellEventHandler(rosterTable,\"cursorCell\");");
			out.println(getIndentation()+"var mP=new MonthPicker({elements:$(\"#rosterMonth\"),initYear:"+rosterYear+",minValue: \"01/2017\"});");
			out.println(getIndentation()+"mP.onPick(function (year,month){");
			htmlIndentation++;
			out.println(getIndentation()+"var form=document.getElementById(\"rosterMonthForm\");");
			out.println(getIndentation()+"form.month.value=month;");
			out.println(getIndentation()+"form.year.value=year;");
			out.println(getIndentation()+"console.log(year,month);");
			out.println(getIndentation()+"form.submit();");
			htmlIndentation--;
			out.println(getIndentation()+"});");
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
		out.println(getIndentation()+"<td colspan=\"31\" class=\"alignCenter rosterMonthSelectCell\">");
		htmlIndentation++;
		out.println(getIndentation()+"<form method=\"post\" id=\"rosterMonthForm\">");
		htmlIndentation++;
		out.println(getIndentation()+"<input type=hidden id=\"selectRosterMonth\" name=\"month\" value=\""+rosterMonth+"\">");
		out.println(getIndentation()+"<input type=hidden id=\"selectRosterYear\" name=\"year\" value=\""+rosterYear+"\">");
		out.println(getIndentation()+"<span id=\"rosterMonth\" class=\"underlineText clickable\">");
		htmlIndentation++;
		switch (Month.of(rosterMonth))
		{
			case JANUARY:out.print(getIndentation()+"January ");
						break;
			case FEBRUARY:out.print(getIndentation()+"February ");
						break;
			case MARCH:out.print(getIndentation()+"March ");
						break;
			case APRIL:out.print(getIndentation()+"April ");
						break;
			case MAY:out.print(getIndentation()+"May ");
						break;
			case JUNE:out.print(getIndentation()+"June ");
						break;
			case JULY:out.print(getIndentation()+"July ");
						break;
			case AUGUST:out.print(getIndentation()+"August ");
						break;
			case SEPTEMBER:out.print(getIndentation()+"September ");
						break;
			case OCTOBER:out.print(getIndentation()+"October ");
						break;
			case NOVEMBER:out.print(getIndentation()+"November ");
						break;
			case DECEMBER:out.print(getIndentation()+"December ");
						break;
		}
		out.println(rosterYear);
		htmlIndentation--;
		out.println(getIndentation()+"</span>");
	/*	out.println(getIndentation()+"<select id=\"selectRosterMonth\" name=\"month\" class=\"underlineText rosterMonthSelect\" onchange=\"this.form.submit()\">");
		htmlIndentation++;
		out.println(getIndentation()+"<option "+((rosterMonth==Month.JANUARY.getValue())?"selected ":"")+"value=\""+Month.JANUARY.getValue()+"\">January</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.FEBRUARY.getValue())?"selected ":"")+"value=\""+Month.FEBRUARY.getValue()+"\">February</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.MARCH.getValue())?"selected ":"")+"value=\""+Month.MARCH.getValue()+"\">March</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.APRIL.getValue())?"selected ":"")+"value=\""+Month.APRIL.getValue()+"\">April</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.MAY.getValue())?"selected ":"")+"value=\""+Month.MAY.getValue()+"\">May</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.JUNE.getValue())?"selected ":"")+"value=\""+Month.JUNE.getValue()+"\">June</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.JULY.getValue())?"selected ":"")+"value=\""+Month.JULY.getValue()+"\">July</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.AUGUST.getValue())?"selected ":"")+"value=\""+Month.AUGUST.getValue()+"\">August</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.SEPTEMBER.getValue())?"selected ":"")+"value=\""+Month.SEPTEMBER.getValue()+"\">September</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.OCTOBER.getValue())?"selected ":"")+"value=\""+Month.OCTOBER.getValue()+"\">October</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.NOVEMBER.getValue())?"selected ":"")+"value=\""+Month.NOVEMBER.getValue()+"\">November</option>");
		out.println(getIndentation()+"<option "+((rosterMonth==Month.DECEMBER.getValue())?"selected ":"")+"value=\""+Month.DECEMBER.getValue()+"\">December</option>");
		htmlIndentation--;
		out.println(getIndentation()+"</select>");
		out.println(getIndentation()+"<select class=\"underlineText rosterMonthSelect\" id=\"selectRosterYear\" name=\"year\" onchange=\"this.form.submit()\">");
		htmlIndentation++;
		if (rosterYear>2017)
			out.println(getIndentation()+"<option value=\""+(rosterYear-1)+"\">"+(rosterYear-1)+"</option>");		
		out.println(getIndentation()+"<option selected value=\""+rosterYear+"\">"+rosterYear+"</option>");
		out.println(getIndentation()+"<option value=\""+(rosterYear+1)+"\">"+(rosterYear+1)+"</option>");
		htmlIndentation--;
		out.println(getIndentation()+"</select>");*/		
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
			if (i< myDateList.size())
			{
				myDate= myDateList.get(i+1);
				if (myDate.isPublicHoliday())
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
			logger.debug("myDateList.size()="+myDateList.size());
			if (i< myDateList.size())
			{
				myDate= myDateList.get(i+1);
				if (myDate.isPublicHoliday()||
					(myDate.getDayOfWeek()==DayOfWeek.SATURDAY)||
					(myDate.getDayOfWeek()==DayOfWeek.SUNDAY))
				{
					className+=" phCell";	
				}
				else
					noOfWorkingDay++;
				switch (myDate.getDayOfWeek())
				{
					case FRIDAY:out.println(getIndentation()+"<td class=\""+className+"\">F</td>");
								break;
					case MONDAY:out.println(getIndentation()+"<td class=\""+className+"\">M</td>");
											break;
					case SATURDAY:out.println(getIndentation()+"<td class=\""+className+"\">S</td>");
											break;
					case SUNDAY:out.println(getIndentation()+"<td class=\""+className+"\">Su</td>");
										 break;
					case TUESDAY:out.println(getIndentation()+"<td class=\""+className+"\">T</td>");
										break;
					case THURSDAY:out.println(getIndentation()+"<td class=\""+className+"\">Th</td>");
										break;
					case WEDNESDAY:out.println(getIndentation()+"<td class=\""+className+"\">W</td>");
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
			if (i< myDateList.size())
			{
				if (now.equals(LocalDate.of(this.rosterYear, this.rosterMonth, i+1)))
					out.println(getIndentation()+"<td class=\"dataCell alignCenter borderCell highlight\">"+(i+1)+"</td>");
				else	
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
	private void printRosterTable(PrintWriter out)
	{
		out.println(getIndentation()+"<table border=\"0\" id=\"rosterTable\">");
		printRosterTableHeader(out);
		printRosterTableBody(out);
		printRosterTableFooter(out);
		htmlIndentation--;
		out.println(getIndentation()+"</table>");
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
		out.println(getIndentation()+"<td colspan=\"20\" rowspan=10 id=\"autoScheduler\" style=\"vertical-align:top\">");
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td colspan=\"11\" rowspan=20 id=\"yearlyStat\" style=\"vertical-align:top\">");
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
