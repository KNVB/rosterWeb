package com.rosterWeb.customtags;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.util.Arrays;
import java.util.Hashtable;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.SimpleTagSupport;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.rosterWeb.ITO;
import com.rosterWeb.ITORoster;
import com.rosterWeb.Roster;
import com.rosterWeb.RosterRule;

import util.Utility;
import util.calendar.MonthlyCalendar;
import util.calendar.MyCalendarUtility;
import util.calendar.MyDate;

public class RosterTableTag extends SimpleTagSupport 
{
	private int rosterMonth,rosterYear;
	protected int htmlIndentation=2;
	protected int noOfWorkingDay,showNoOfPrevDate=0;
	
	protected LocalDate now;
	protected MyDate myDate;
	protected Roster roster;
	protected String[] itoIdList ;
	protected Hashtable<String,ITO> itoList;
	protected Hashtable<String,ITORoster> itoRosterList;
	protected Hashtable<Integer,MyDate> myDateList;
	protected Hashtable<String,Float>shiftHourCount;
	protected RosterRule rosterRule;
	protected static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	public RosterTableTag() 
	{
		shiftHourCount=RosterRule.getShiftHourCount(); 
	}
	public void setRosterMonth(int rosterMonth) {
		this.rosterMonth = rosterMonth;
	}
	public void setRosterYear(int rosterYear) {
		this.rosterYear = rosterYear;
	}
	public void doTag() throws JspException, IOException
	{
		noOfWorkingDay=0;
		genTable();
	}
	protected void genButton(JspWriter out) throws JspException, IOException
	{
		
	}
	protected void genStatistic(JspWriter out) throws JspException, IOException
	{
		
	}
	private void genRosterRows(JspWriter out) throws JspException, IOException
	{
		ITO ito;
		for (int i=0;i<itoIdList.length;i++)
		{
			ito=itoList.get(itoIdList[i]);
			genITORow(out,ito);
		}
	}
	private void genTable() throws JspException, IOException 
	{
		JspWriter out = getJspContext().getOut();
		now=LocalDate.now();
		getData();
		out.println("<table border=\"1\" id=\"rosterTable\">");
		genTableHeader(out);
		genTableBody(out);
		genTableFooter(out);
		htmlIndentation--;
		out.println(getIndentation()+"</table>");
	}
	private void genTableBody(JspWriter out) throws JspException, IOException 
	{
		out.println(getIndentation()+"<tbody id=\"rosterBody\">");
		htmlIndentation++;
		genRosterRows(out);
		htmlIndentation--;
		out.println(getIndentation()+"</tbody>");
	}
	private void genTableHeader(JspWriter out) throws JspException, IOException
	{
		int i;
		htmlIndentation++;
		out.println(getIndentation()+"<thead id=\"rosterHeader\">");
		htmlIndentation++;
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"nameCell\"></td>");
		printPrevDateEmptyHeaderCell(out);
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
		printPrevDateEmptyHeaderCell(out);
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
		printPrevDateHeaderBorderedCell(out);
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
		printPrevDateHeaderBorderedCell(out);
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
		printPrevDateHeaderBorderedCell(out);
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
	private void genTableFooter(JspWriter out) throws JspException, IOException 
	{
		int shiftCellColSpan=11+this.showNoOfPrevDate;
		out.println(getIndentation()+"<tfoot id=\"rosterFooter\">");
		htmlIndentation++;
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		if (this.showNoOfPrevDate>0)
			out.println(getIndentation()+"<td colspan=\"44\"><br></td>");
		else
			out.println(getIndentation()+"<td colspan=\"42\"><br></td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"aShiftColor\">");	
		htmlIndentation++;
		out.println(getIndentation()+"a : 0800H - 1700H");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td colspan=\"21\" rowspan=10 id=\"autoScheduler\" style=\"vertical-align:top\">");
		genButton(out);
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td colspan=\"10\" rowspan=20 id=\"yearlyStat\" style=\"vertical-align:top\">");
		genStatistic(out);
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"bShiftColor\">");	
		htmlIndentation++;
		out.println(getIndentation()+"b : 1630H - 2215H");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"bShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"b1: 1500H - 2215H");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"cShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"c : 2145H - 0830H (the next day)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"dxShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"d : 0800H - 1800H (on weekdays)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"dxShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"d1 : 0800H - 1700H (on weekdays)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"dxShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"d2 : 0900H - 1800H (on weekdays)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");				
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"dxShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"d3 : 0800H - 1648H (on weekdays)");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"sickLeaveColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"s : sick leave standby");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		out.println(getIndentation()+"<tr>");
		htmlIndentation++;
		out.println(getIndentation()+"<td colspan=\""+shiftCellColSpan+"\" class=\"oShiftColor\">");
		htmlIndentation++;
		out.println(getIndentation()+"O : dayoff");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
		htmlIndentation--;
		out.println(getIndentation()+"</tfoot>");
	}	
	private void printPrevDateEmptyHeaderCell(JspWriter out)throws JspException, IOException 
	{
		for (int i=0;i<showNoOfPrevDate;i++)
		{
			out.println(getIndentation()+"<td></td>");
		}
	}
	protected void printPrevDateHeaderBorderedCell(JspWriter out)throws JspException, IOException 
	{
		for (int i=0;i<showNoOfPrevDate;i++)
		{
			out.println(getIndentation()+"<td class=\"dataCell alignCenter borderCell\"></td>");
		}
	}
	protected void genITORow(JspWriter out,ITO ito)throws JspException, IOException
	{
		int aShiftCount=0, bxShiftCount=0,cShiftCount=0, dxShiftCount=0,totalWorkingDayCount=0;
		float actualWorkingHour=0.0f,thisMonthBalance=0.0f,thisMonthHourTotal=0.0f ,totalHour=(float)noOfWorkingDay*ito.getWorkingHourPerDay();
		String shiftClassName,shiftType;
		ITORoster itoRoster=itoRosterList.get(ito.getITOId());
		Hashtable<Integer,String>previousMonthShiftList=itoRoster.getPreviousMonthShiftList();
		Hashtable<Integer, String> shiftList=itoRoster.getShiftList();
		out.println(getIndentation()+"<tr id=\"shift_"+ito.getITOId()+"\">");
		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"borderCell alignLeft\">");
		htmlIndentation++;
		out.println(getIndentation()+ito.getITOName()+"<br>"+ito.getPostName()+" Extn. 2458");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		logger.debug(itoRoster.getPreviousMonthShiftList().size());
		logger.debug(previousMonthShiftList.toString());
		
		for (int i=previousMonthShiftList.size()-this.showNoOfPrevDate;i<previousMonthShiftList.size();i++)
		{
			logger.debug("i="+i);
			shiftType=previousMonthShiftList.get(i+1);
			out.println(getIndentation()+"<td class=\"alignCenter borderCell "+getShiftClassName(shiftType)+"\">");
			htmlIndentation++;
			out.println(getIndentation()+shiftType);
			htmlIndentation--;
			out.println(getIndentation()+"</td>");
		}
		for (int i=1;i<32;i++)
		{
			if (shiftList.containsKey(i))
			{
				shiftType=shiftList.get(i).toString();
				shiftClassName=getShiftClassName(shiftType);
				switch (shiftType)
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
					case "d":
					case "d1":
					case "d2":
					case "d3":
							dxShiftCount++;
							break;
				}
				logger.debug("shiftType="+shiftType);
				actualWorkingHour+=shiftHourCount.get(shiftType);
				logger.debug("shiftType="+shiftType+",actualWorkingHour="+actualWorkingHour);
				out.println(getIndentation()+"<td class=\"alignCenter borderCell cursorCell shiftCell "+shiftClassName+"\">");
				htmlIndentation++;
				out.println(getIndentation()+shiftType);
				htmlIndentation--;
			}
			else
			{
				out.println(getIndentation()+"<td class=\"alignCenter borderCell\">");
			}
			out.println(getIndentation()+"</td>");	
		}
		totalWorkingDayCount=aShiftCount+cShiftCount+bxShiftCount+dxShiftCount;
		thisMonthHourTotal=(float)Utility.roundTo((double)(actualWorkingHour-totalHour), 2);
		thisMonthBalance=(float)Utility.roundTo((double)thisMonthHourTotal+itoRoster.getBalance(),2);
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_totalHour\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+totalHour);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_actualHour\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		actualWorkingHour=(float)Utility.roundTo((double)actualWorkingHour,2);
		out.println(getIndentation()+actualWorkingHour);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_lastMonthBalance\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+itoRoster.getBalance());
		htmlIndentation--;
		out.println(getIndentation()+"</td>");

		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_thisMonthHourTotal\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+thisMonthHourTotal);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_thisMonthBalance\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+thisMonthBalance);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_aShiftCount\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+aShiftCount);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");		
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_bxShiftCount\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+bxShiftCount);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_cShiftCount\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+cShiftCount);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_dxShiftCount\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+dxShiftCount);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		
		out.println(getIndentation()+"<td id=\""+ito.getITOId()+"_noOfWoringDay\" class=\"alignCenter borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+totalWorkingDayCount);
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");

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
	protected String getIndentation()
	{
		String result="";
		for (int i=0;i<htmlIndentation;i++)
		{
			result+="\t";
		}
		return result;
	}
	protected String getShiftClassName(String shiftType)
	{
		String shiftClassName;
		switch (shiftType)
		{
			case "b":
			case "b1":shiftClassName="b";
					
					break;
			case "d":
			case "d1":
			case "d2":
			case "d3":shiftClassName="dx";
					
					break;
			default:				
				shiftClassName=shiftType;
					break;
		}
		shiftClassName=shiftClassName+"ShiftColor";
		return shiftClassName;
	}
}
