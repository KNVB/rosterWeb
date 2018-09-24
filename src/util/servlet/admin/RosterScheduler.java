package util.servlet.admin;

import java.io.PrintWriter;
import java.util.Hashtable;
import javax.servlet.http.HttpServletRequest;

import com.ITO;
import com.ITORoster;
import com.Roster;

import com.rosterStatistic.ITOYearlyStatistic;
import com.rosterStatistic.MonthlyStatistic;

import util.calendar.MyCalendar;
import util.servlet.user.RosterViewer;

/**
 * Servlet implementation class RosterScheduler
 */
public class RosterScheduler extends RosterViewer {
	private static final long serialVersionUID = 1L;
	
	protected void printAutoScheduler(PrintWriter out,Hashtable<Integer,MyCalendar> myCalendarList)
	{
		int i;
		out.println("						<div style=\"text-align:center\">");
		out.println("							Auto Planning Start From:"); 
		out.println("							<select id=\"autoPlannStartDate\">Auto Planning Start From:");
		for (i=1 ;i<=myCalendarList.size();i++)
		{
			out.println("								<option value="+i+">"+i+"</option>");									
		}
		out.println("							</select>to");
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
	}
	protected void printAutoSchedulerResult(PrintWriter out)
	{
		out.println("						<div style=\"padding-left:10px;display:none\" id=\"genResult\">");
		out.println("							<table border=0>");
		out.println("								<tr>");
		out.println("									<td>Standard Deviation:</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"theLowestSD\">");
		out.println("									<td>1</td>>");
		out.println("									<td>1</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"secondLowestSD\">");
		out.println("									<td>1</td>");
		out.println("									<td>1</td>");
		out.println("								</tr>");
		out.println("								<tr id=\"thirdLowestSD\">");
		out.println("									<td>1</td>");
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

	}
	protected void printHTMLTitle(PrintWriter out)
	{
		out.println("\t\t<title>RosterScheduler</title>");
	}
	protected void printIncludedJavascript(HttpServletRequest request,PrintWriter out)
	{
		super.printIncludedJavascript(request, out);
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/util/MyModal.js\"></script>");
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/util/MyLoadingScreen.js\"></script>");
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/RosterSchedulerTable.js\"></script>");
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/RosterScheduler.js\"></script>");
	}
	protected void printOnDomReadyFunction(HttpServletRequest request,PrintWriter out) 
	{
		out.println("\t\t<script>");
		out.println("\t\t\tvar utility=new Utility(\""+request.getContextPath()+"/middleware/\");");
		out.println("\t\t\tvar aShiftStdDev,bShiftStdDev,cShiftStdDev;");
		out.println("\t\t\t$( document ).ready(function() {");
		out.println("\t\t\t\tvar rosterScheduler=new RosterScheduler(utility);");
		out.println("\t\t\t});");
		out.println("\t\t</script>");
	}
	protected void printPreferredShiftRow(PrintWriter out, ITORoster itoRoster,ITO ito) 
	{
		String shiftType;
		out.println("				<tr id=\"preferredShift_"+ito.getItoId()+"\">");
		out.println("					<td class=\"borderCell alignLeft\">Preferred Shift</td>");
		super.printPrevDateHeaderCell(out);
		if (itoRoster.getPreferredShiftList().isEmpty())
		{
			super.printEmptyShiftRow(out,ito.getItoId());	
		}
		else
		{
			int i;
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
			out.println("					<td class=\"borderCell alignCenter\" colspan=\"5\"></td>");
			out.println("					<td class=\"alignCenter borderCell\" ></td>");
			out.println("					<td class=\"alignCenter borderCell\" ></td>");
			out.println("					<td class=\"alignCenter borderCell\" ></td>");
			out.println("					<td class=\"alignCenter borderCell\" ></td>");
			out.println("					<td class=\"alignCenter borderCell\" ></td>");		
			out.println("				</tr>");
		}
	}	
	protected void printRosterSchedulerButton(PrintWriter out)
	{
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

	}
	protected void printVacantShiftRow(PrintWriter out)
	{
		int i;
		out.println("				<tr id=\"vancantShift\">");
		out.println("					<td class=\"vancantShift borderCell\">Vancant Shifts</td>");
		out.println("					<td class=\"alignCenter borderCell\"></td>");
		out.println("					<td class=\"alignCenter borderCell\"></td>");
		for (i=0;i<31;i++)
		{
			out.println("					<td class=\"alignCenter borderCell\"></td>");
		}
		out.println("					<td class=\"borderCell alignCenter\" colspan=\"5\"></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\"shiftAStdDev\"><script>aShiftStdDev=utility.getSD("+aShiftData+");document.write(utility.roundTo(aShiftStdDev,2));</script></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\"shiftBStdDev\"><script>bShiftStdDev=utility.getSD("+bShiftData+");document.write(utility.roundTo(bShiftStdDev,2));</script></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\"shiftCStdDev\"><script>cShiftStdDev=utility.getSD("+cShiftData+");document.write(utility.roundTo(cShiftStdDev,2));</script></td>");
		out.println("					<td class=\"alignCenter borderCell\" id=\"avgStdDev\"><script>var avgStdDev=cShiftStdDev+bShiftStdDev+aShiftStdDev;document.write(utility.roundTo(avgStdDev/3,2));</script></td>");
		out.println("					<td class=\"alignCenter borderCell\" ></td>");		
		out.println("				</tr>");
	}
	protected void printYearlyStatistic(PrintWriter out, Roster roster, String[] itoIdList,int year,int month) 
	{
		MonthlyStatistic monthlyStatistic; 
		String statisticBodyHTML="";
		Hashtable<String,ITOYearlyStatistic> yearlyRosterStatistic;
		ITOYearlyStatistic iTOYearlyStatistic;
		int aShiftTotal,bxShiftTotal,cShiftTotal,dxShiftTotal,oShiftTotal,allShiftTotal,i;
		out.println("						<div id=\"yearlyStatistic\" style=\"height:450px;overflow-y:scroll\">");
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
		try
		{
			yearlyRosterStatistic=roster.getYearlyStatistic(year, month);
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
			}

		}
		catch (Exception err)
		{
			err.printStackTrace();
		}
		out.println("							</table>");
		out.println("						</div>");
	}
}
