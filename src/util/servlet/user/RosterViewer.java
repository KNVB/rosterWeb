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
	protected int showNoOfPrevDate=2,noOfWorkingDay;
	protected int rosterMonth,rosterYear;

	protected Hashtable<String,ITO> itoList;
	protected Hashtable<String,ITORoster> itoRosterList;
	protected Hashtable<Integer,MyCalendar> myCalendarList;
	
	protected MyCalendar myCalendar;
	protected Roster roster;
	protected String[] itoIdList ;
	
	protected ArrayList<Integer>aShiftData; 
	protected ArrayList<Integer>bShiftData;
	protected ArrayList<Integer>cShiftData;
	protected ArrayList<String> htmlHeader; 
	protected ArrayList<String> rosterBodyHtml;
	protected ArrayList<String> rosterCaptionHtml;
	protected ArrayList<String> rosterDateRowHtml;
	protected ArrayList<String> rosterFooterHtml;
	
	protected ArrayList<String> rosterHolidayRowHtml;
	protected ArrayList<String> rosterMonthRowHtml;
	protected ArrayList<String> rosterWeekdayRowHtml;
	
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
		GregorianCalendar now=new GregorianCalendar();
		htmlHeader=new ArrayList<String>();            
		rosterBodyHtml=new ArrayList<String>();        
		rosterCaptionHtml=new ArrayList<String>();     
		rosterDateRowHtml=new ArrayList<String>();     
		rosterFooterHtml=new ArrayList<String>();      
		                                               
		rosterHolidayRowHtml=new ArrayList<String>();  
		rosterMonthRowHtml=new ArrayList<String>();    
		rosterWeekdayRowHtml=new ArrayList<String>();
		noOfWorkingDay=0;
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
		genHTMLHeader(request);
		genHTMLBody();
		outputResult(out,response);
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
			
			roster.setRosterYear(rosterYear);
			roster.setRosterMonth(rosterMonth);
			roster.load();
			itoRosterList=roster.getITORosterList();
		}
		catch (Exception err)
		{
			err.printStackTrace();
		}
	}
	protected void genEmptyRow(ArrayList<String> container,String itoId)
	{
		int i;
		for (i=0;i<showNoOfPrevDate;i++)
		{
			container.add("					<td class=\"alignCenter borderCell\"></td>");
		}
		genEmptyShiftRow(container, itoId);
	}
	protected void genEmptyShiftRow(ArrayList<String> container,String itoId)
	{
		for (int i=0;i<31;i++)
		{
			if (i< myCalendarList.size())
				container.add("					<td class=\"shiftCell alignCenter borderCell\"></td>");
			else
				container.add("					<td class=\"alignCenter borderCell\"></td>");
		}
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_totalHour\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_actualHour\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_lastMonthBalance\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_thisMonthHourTotal\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_thisMonthBalance\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_aShiftCount\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_bxShiftCount\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_cShiftCount\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_dxShiftCount\"></td>");
		container.add("					<td class=\"alignCenter borderCell\" id=\""+itoId+"_noOfWoringDay\"></td>");
	}	
	protected void genHTMLHeader(HttpServletRequest request)
	{
		htmlHeader.add("\t\t<meta charset=\"UTF-8\">");
		genHTMLTitle();
		genIncludedCSS();
		genIncludedJavascript(request);
		genOnDomReadyFunction(request);
	}
	protected void genHTMLTitle()
	{
		htmlHeader.add("\t\t<title>RosterViewer</title>");
	}
	protected void genIncludedCSS()
	{
		htmlHeader.add("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"css/style.css\">");
	}
	protected void genIncludedJavascript(HttpServletRequest request)
	{
		htmlHeader.add("\t\t<script type=\"text/javascript\" src=\""+request.getContextPath()+"/webjars/jquery/3.3.1/jquery.min.js\"></script>");
		htmlHeader.add("\t\t<script src=\"js/RosterTable.js\"></script>");
		htmlHeader.add("\t\t<script src=\"js/util/ShiftCellEventHandler.js\"></script>");
		htmlHeader.add("\t\t<script src=\"js/util/Utility.js\"></script>");
	}
	protected void genHTMLBody()
	{
		genRosterTable();
	}	
	protected void genOnDomReadyFunction(HttpServletRequest request)
	{
		htmlHeader.add("\t\t<script>");
		htmlHeader.add("\t\t\tvar utility=new Utility(\""+request.getContextPath()+"/middleware/\");");
		htmlHeader.add("\t\t\t$( document ).ready(function() {");
		htmlHeader.add("\t\t\t\tvar rosterTable=new RosterTable(utility);");
		htmlHeader.add("\t\t\t\tvar shiftCellEventHandler=new ShiftCellEventHandler(rosterTable,\"shiftCell\");");
		htmlHeader.add("\t\t\t});");
		htmlHeader.add("\t\t</script>");
	}
	protected Hashtable<String,ArrayList<String>> genITORosterRowList()
	{
		ArrayList<String> shiftList;
		float actualWorkingHour, thisMonthBalance,thisMonthHourTotal,totalHour;
		Hashtable<String,ArrayList<String>>iTORosterRowHtml=new Hashtable<String,ArrayList<String>>();
		int startIndex,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount,i;
		ITO ito;
		ITORoster itoRoster;
		String shiftType;
		aShiftData=new ArrayList<Integer>();
		bShiftData=new ArrayList<Integer>();
		cShiftData=new ArrayList<Integer>();
		for (String itoId :itoIdList)
		{
			ito=itoList.get(itoId);
			itoRoster=itoRosterList.get(itoId);
			shiftList=new ArrayList<String>();
			totalHour=(noOfWorkingDay*ito.getWorkingHourPerDay());
			shiftList.add("					<td class=\"borderCell alignLeft\">"+ito.getItoName()+"<br>"+ito.getPostName()+" Extn. 2458</td>");
			if (itoRoster==null)
			{
				genEmptyRow(shiftList,ito.getItoId());
				aShiftData.add(0);
				bShiftData.add(0);
				cShiftData.add(0);
			}
			else
			{
				startIndex=itoRoster.getPreviousMonthShiftList().size()-showNoOfPrevDate;
				for (i=startIndex;i<itoRoster.getPreviousMonthShiftList().size();i++)
				{
					shiftList.add("					\t<script>utility.printPreviousMonthShiftCell(\""+itoRoster.getPreviousMonthShiftList().get(i).getShift()+"\");</script>");
				}
				if (itoRoster.getShiftList().isEmpty())
				{
					genEmptyShiftRow(shiftList,ito.getItoId());
					aShiftData.add(0);
					bShiftData.add(0);
					cShiftData.add(0);
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
							shiftList.add("					\t<script>utility.printShiftCell(\""+shiftType+"\");</script>");
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
							shiftList.add("					<td class=\"alignCenter borderCell\"></td>");
						}
					}
					thisMonthHourTotal=actualWorkingHour-totalHour;
					thisMonthBalance=thisMonthHourTotal+itoRoster.getBalance();
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_totalHour\">"+totalHour+"</td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_actualHour\">"+(actualWorkingHour)+"</td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_lastMonthBalance\">"+itoRoster.getBalance()+"</td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_thisMonthHourTotal\"><script>document.write(utility.roundTo("+thisMonthHourTotal+",2));</script></td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_thisMonthBalance\"><script>document.write(utility.roundTo("+thisMonthBalance+",2));</script></td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_aShiftCount\">"+aShiftCount+"</td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_bxShiftCount\">"+bxShiftCount+"</td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_cShiftCount\">"+cShiftCount+"</td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_dxShiftCount\">"+dxShiftCount+"</td>");
					shiftList.add("					<td class=\"alignCenter borderCell\" id=\""+ito.getItoId()+"_noOfWoringDay\">"+(aShiftCount+bxShiftCount+cShiftCount+dxShiftCount)+"</td>");
					aShiftData.add(aShiftCount); 
					bShiftData.add(bxShiftCount); 
					cShiftData.add(cShiftCount); 
				}
			}
			iTORosterRowHtml.put(itoId, shiftList);
		}
		return iTORosterRowHtml;
	}
	protected void genRosterHeader()
	{
		genRosterCaptionRow();
		genRosterMonthRow();
		genRosterHolidayRow();
		genRosterWeekdayRow();
		genRosterDateRow();
	}
	protected void genRosterHolidayRow()
	{
		int i;
		rosterHolidayRowHtml.add("					<td class=\"nameCell borderCell\">Holiday</td>");
		genPrevDateHeaderCell(rosterHolidayRowHtml);
		for (i=0;i<31;i++)
		{
			if (i< myCalendarList.size())
			{
				myCalendar= myCalendarList.get(i+1);
				if (myCalendar.isPublicHoliday())
				{
					rosterHolidayRowHtml.add("					<td class=\"dataCell alignCenter borderCell phCell\">PH</td>");	
				}
				else
				{
					rosterHolidayRowHtml.add("					<td class=\"dataCell alignCenter borderCell phCell\"></td>");
				}
			}
			else
			{
				rosterHolidayRowHtml.add("					<td class=\"dataCell alignCenter borderCell phCell\"></td>");
			}
		}
		rosterHolidayRowHtml.add("					<td class=\"borderCell\" colspan=\"10\"></td>");			
	}	
	protected void genRosterBody()
	{
		ArrayList<String>shiftList;
		Hashtable<String,ArrayList<String>>iTORosterRowHtml=genITORosterRowList();
		for (String itoId :itoIdList)
		{
			rosterBodyHtml.add("				<tr id=\"shift_"+itoId+"\">");
			shiftList=iTORosterRowHtml.get(itoId);
			rosterBodyHtml.addAll(shiftList);
			rosterBodyHtml.add("				</tr>");
		}		
	}
	protected void genRosterCaptionRow()
	{
		rosterCaptionHtml.add("					<td class=\"nameCell\"></td>");
		rosterCaptionHtml.add("					<td colspan=\"2\"></td>");
		rosterCaptionHtml.add("					<td class=\"alignCenter titleCell underlineText\" colspan=\"31\">");
		rosterCaptionHtml.add("						EMSTF Resident Support &amp; Computer Operation Support Services Team Roster");
		rosterCaptionHtml.add("					</td>");
		rosterCaptionHtml.add("					<td class=\"totalHourCell\"><br></td>");
		rosterCaptionHtml.add("					<td class=\"actualHourCell\"><br></td>");
		rosterCaptionHtml.add("					<td class=\"lastMonthCell\"><br></td>");
		rosterCaptionHtml.add("					<td class=\"thisMonthCell\"><br></td>");
		rosterCaptionHtml.add("					<td class=\"totalCell\"><br></td>");
		rosterCaptionHtml.add("					<td class=\"totalNoOfCell\"><br></td>");
		rosterCaptionHtml.add("					<td class=\"totalNoOfCell\"><br></td>");
		rosterCaptionHtml.add("					<td class=\"totalNoOfCell\"><br></td>");
		rosterCaptionHtml.add("					<td class=\"totalNoOfCell\"><br></td><td class=\"noOfWorkingDay\"><br></td>");
	}
	protected void genRosterDateRow()
	{
		int i;
		rosterDateRowHtml.add("					<td class=\"nameCell borderCell\">Resident Support<br>Team Members</td>");
		genPrevDateHeaderCell(rosterDateRowHtml);
		for (i=0;i<31;i++)
		{
			if (i< myCalendarList.size())
			{
				rosterDateRowHtml.add("					<td class=\"dataCell alignCenter borderCell\">"+(i+1)+"</td>");
			}
			else
				rosterDateRowHtml.add("					<td class=\"dataCell alignCenter borderCell\"></td>");	
		}
		rosterDateRowHtml.add("					<td class=\"alignCenter borderCell\">Last<br>Month</td>");
		rosterDateRowHtml.add("					<td class=\"alignCenter borderCell\">This<br>Month</td>");
		rosterDateRowHtml.add("					<td class=\"alignCenter borderCell\">Total</td>");
		rosterDateRowHtml.add("					<td class=\"alignCenter borderCell\">Total No. of<br>A shift</td>");
		rosterDateRowHtml.add("					<td class=\"alignCenter borderCell\">Total No. of<br>Bx shift</td>");
		rosterDateRowHtml.add("					<td class=\"alignCenter borderCell\">Total No. of<br>C shift</td>");
		rosterDateRowHtml.add("					<td class=\"alignCenter borderCell\">Total No. of<br>Dx shift</td>");
		rosterDateRowHtml.add("					<td class=\"alignCenter borderCell\">No. of<br>working<br>day</td>");
	}
	protected void genRosterFooter()
	{
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=\"44\">");
		rosterFooterHtml.add("						<br>");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"aShiftColor\">");	
		rosterFooterHtml.add("					a : 0800H - 1700H");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("					<td colspan=\"20\" rowspan=10>");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("					<td colspan=\"11\" rowspan=\"23\">");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"bShiftColor\">");	
		rosterFooterHtml.add("						b : 1630H - 2215H");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"bShiftColor\">");
		rosterFooterHtml.add("						b1: 1500H - 2215H");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"cShiftColor\">");
		rosterFooterHtml.add("						c : 2145H - 0830H (the next day)");
		rosterFooterHtml.add("					</td>");			
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"dxShiftColor\">");
		rosterFooterHtml.add("						d : 0800H - 1800H (on weekdays)");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"dxShiftColor\">");
		rosterFooterHtml.add("						d1 : 0800H - 1700H (on weekdays)");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"dxShiftColor\">");
		rosterFooterHtml.add("						d2 : 0900H - 1800H (on weekdays)");
		rosterFooterHtml.add("					</td>");				
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"dxShiftColor\">");
		rosterFooterHtml.add("						d3 : 0800H - 1648H (on weekdays)");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"sickLeaveColor\">");
		rosterFooterHtml.add("						s : sick leave standby");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");
		rosterFooterHtml.add("				<tr>");
		rosterFooterHtml.add("					<td colspan=13 class=\"oShiftColor\">");
		rosterFooterHtml.add("						O : dayoff");
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("				</tr>");		
	}
	protected void genRosterMonthRow()
	{
		rosterMonthRowHtml.add("					<td class=\"nameCell\">");
		rosterMonthRowHtml.add("					</td>");
		rosterMonthRowHtml.add("					<td colspan=\"2\"></td>");
		rosterMonthRowHtml.add("					<td colspan=\"31\" class=\"underlineText alignCenter rosterMonthSelectCell\">");
		rosterMonthRowHtml.add("						<form method=\"post\">");
		rosterMonthRowHtml.add("						\t<select id=\"selectRosterMonth\" name=\"month\" class=\"underlineText rosterMonthSelect\" onchange=\"this.form.submit()\">");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.JANUARY)?"selected":"")+" value=\""+Calendar.JANUARY+"\">January</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.FEBRUARY)?"selected":"")+" value=\""+Calendar.FEBRUARY+"\">February</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.MARCH)?"selected":"")+" value=\""+Calendar.MARCH+"\">March</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.APRIL)?"selected":"")+" value=\""+Calendar.APRIL+"\">April</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.MAY)?"selected":"")+" value=\""+Calendar.MAY+"\">May</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.JUNE)?"selected":"")+" value=\""+Calendar.JUNE+"\">June</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.JULY)?"selected":"")+" value=\""+Calendar.JULY+"\">July</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.AUGUST)?"selected":"")+" value=\""+Calendar.AUGUST+"\">August</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.SEPTEMBER)?"selected":"")+" value=\""+Calendar.SEPTEMBER+"\">September</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.OCTOBER)?"selected":"")+" value=\""+Calendar.OCTOBER+"\">October</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.NOVEMBER)?"selected":"")+" value=\""+Calendar.NOVEMBER+"\">November</option>");
		rosterMonthRowHtml.add("						\t	<option "+((rosterMonth==Calendar.DECEMBER)?"selected":"")+" value=\""+Calendar.DECEMBER+"\">December</option>");
		rosterMonthRowHtml.add("						\t</select>"+rosterYear);
		rosterMonthRowHtml.add("						\t<input type=\"hidden\" name=\"year\" value=\""+rosterYear+"\">");
		rosterMonthRowHtml.add("						</form>");
		rosterMonthRowHtml.add("					</td>");
		rosterMonthRowHtml.add("					<td colspan=\"10\"></td>");
	}
	private void genRosterTable()
	{
		genRosterHeader();
		genRosterBody();
		genRosterFooter();
	}
	protected void genPrevDateHeaderCell(ArrayList<String> container)
	{
		for (int i=0;i<showNoOfPrevDate;i++)
		{
			container.add("					<td class=\"dataCell alignCenter borderCell\"></td>");
		}
	}
	protected void genRosterWeekdayRow()
	{
		int i;
		String className;
		rosterWeekdayRowHtml.add("					<td class=\"nameCell borderCell\">Days</td>");
		genPrevDateHeaderCell(rosterWeekdayRowHtml);
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
					case Calendar.FRIDAY:rosterWeekdayRowHtml.add("					<td class=\""+className+"\">F</td>");
										break;
					case Calendar.MONDAY:rosterWeekdayRowHtml.add("					<td class=\""+className+"\">M</td>");
											break;
					case Calendar.SATURDAY:rosterWeekdayRowHtml.add("					<td class=\""+className+"\">S</td>");
											break;
					case Calendar.SUNDAY:rosterWeekdayRowHtml.add("					<td class=\""+className+"\">Su</td>");
										 break;
					case Calendar.TUESDAY:rosterWeekdayRowHtml.add("					<td class=\""+className+"\">T</td>");
										break;
					case Calendar.THURSDAY:rosterWeekdayRowHtml.add("					<td class=\""+className+"\">Th</td>");
										break;
					case Calendar.WEDNESDAY:rosterWeekdayRowHtml.add("					<td class=\""+className+"\">W</td>");
										break;
										 
				}
			}
			else
				rosterWeekdayRowHtml.add("					<td class=\""+className+"\"></td>");
		}
		rosterWeekdayRowHtml.add("					<td class=\"alignCenter borderCell\" rowspan=\"2\">Total<br>Hour</td>");
		rosterWeekdayRowHtml.add("					<td class=\"alignCenter borderCell\" rowspan=\"2\">Actual<br>Hour</td>");
		rosterWeekdayRowHtml.add("					<td class=\"alignCenter borderCell\" colspan=\"8\">Hour Off Due</td>");		
		
	}
	protected void outputResult(PrintWriter out,HttpServletResponse response)
	{
		int i;
		response.setContentType("text/html; charset=UTF-8");
		out.println("<html>");
		out.println("\t<head>");
		for (i=0;i<htmlHeader.size();i++)
		{
			out.println(htmlHeader.get(i));
		}
		out.println("\t</head>");
		out.println("\t<body>");
		out.println("\t\t<table border=\"0\" id=\"rosterTable\">");
		out.println("\t\t\t<thead id=\"rosterHeader\">");
		out.println("				<tr>");
		for (i=0;i<rosterCaptionHtml.size();i++)
		{	
			out.println(rosterCaptionHtml.get(i));
		}
		out.println("				</tr>");
		out.println("				<tr id=\"rosterMonthRow\">");
		for (i=0;i<rosterMonthRowHtml.size();i++)
		{	
			out.println(rosterMonthRowHtml.get(i));
		}
		out.println("				</tr>");
		out.println("				<tr id=\"holidayRow\">");
		for (i=0;i<rosterHolidayRowHtml.size();i++)
		{	
			out.println(rosterHolidayRowHtml.get(i));
		}
		out.println("				</tr>");
		out.println("				<tr id=\"weekdayRow\">");
		for (i=0;i<rosterWeekdayRowHtml.size();i++)
		{
			out.println(rosterWeekdayRowHtml.get(i));
		}
		out.println("				</tr>");
		out.println("				<tr id=\"dateRow\">");
		for (i=0;i<rosterDateRowHtml.size();i++)
		{
			out.println(rosterDateRowHtml.get(i));
		}
		out.println("				</tr>");
		out.println("\t\t\t</thead>");
		out.println("\t\t\t<tbody>");
		for (i=0;i<rosterBodyHtml.size();i++)
		{
			out.println(rosterBodyHtml.get(i));
		}
		out.println("\t\t\t</tbody>");
		out.println("			<tfoot>");
		for (i=0;i<rosterFooterHtml.size();i++)
		{
			out.println(rosterFooterHtml.get(i));
		}
		out.println("			</tfoot>");
		out.println("\t\t</table>");
		out.println("\t</body>");
		out.println("</html>");
	}
}
