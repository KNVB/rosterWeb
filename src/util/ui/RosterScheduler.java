package util.ui;

import com.PreferredShift;
import com.RosterRule;
import com.rosterStatistic.ITOYearlyStatistic;

import java.io.PrintWriter;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;
public class RosterScheduler extends RosterViewer 
{
	private static final long serialVersionUID = -3458743823976451986L;
	protected Hashtable<String,Hashtable<Integer,String>>preferredShiftList;
	private Hashtable<String,ITOYearlyStatistic> yearlyRosterStatistic;
	
	protected void getData() 
	{
		super.getData();
		PreferredShift preferredShift=new PreferredShift();
		try 
		{
			yearlyRosterStatistic=roster.getYearlyStatistic(rosterYear, rosterMonth);
			preferredShiftList=preferredShift.getPreferredShiftList(rosterYear, rosterMonth, itoIdList);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	
	}
	protected void printHTMLTitle(PrintWriter out)
	{
		out.println(getIndentation()+"<title>Roster Scheduler</title>");
	}
	protected void printIncludedJavascript(PrintWriter out,HttpServletRequest request)
	{
		super.printIncludedJavascript(out, request);
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/util/LoadingScreen.js\"></script>");
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/util/SchedulerShiftCellEventHandler.js\"></script>");
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/util/RosterSchedulerUtility.js\"></script>");
	//	out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/ITO.js\"></script>");
	//	out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/Roster.js\"></script>");
	//	out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/RosterRule.js\"></script>");
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/RosterScheduler.js\"></script>");
		out.println("\t\t<script src=\""+request.getContextPath()+"/admin/js/RosterSchedulerTable.js\"></script>");
	}
	@Override
	protected void printOnDomReadyFunction(PrintWriter out)
	{
		try
		{
			out.println(getIndentation()+"<script>");
			htmlIndentation++;
			
			out.println(getIndentation()+"$( document ).ready(function() {");
			htmlIndentation++;
			out.println(getIndentation()+"var rosterScheduler=new RosterScheduler();");
			out.println(getIndentation()+"rosterScheduler.essentialShiftList="+objectMapper.writeValueAsString(RosterRule.getEssentialShiftList())+";");
			out.println(getIndentation()+"rosterScheduler.itoList="+objectMapper.writeValueAsString(itoList)+";");
			out.println(getIndentation()+"rosterScheduler.itoIdList="+objectMapper.writeValueAsString(itoIdList)+";");
			out.println(getIndentation()+"rosterScheduler.itoRosterList="+objectMapper.writeValueAsString(itoRosterList)+";");
			out.println(getIndentation()+"rosterScheduler.maxConsecutiveWorkingDay="+objectMapper.writeValueAsString(RosterRule.getMaxConsecutiveWorkingDay())+";");
			out.println(getIndentation()+"rosterScheduler.noOfWorkingDay="+noOfWorkingDay+";");
			out.println(getIndentation()+"rosterScheduler.preferredShiftList="+objectMapper.writeValueAsString(preferredShiftList)+";");
			out.println(getIndentation()+"rosterScheduler.shiftHourCount="+objectMapper.writeValueAsString(RosterRule.getShiftHourCount())+";");
			out.println(getIndentation()+"rosterScheduler.yearlyStatistic="+objectMapper.writeValueAsString(yearlyRosterStatistic)+";");
			out.println(getIndentation()+"rosterScheduler.show();");
			//out.println(getIndentation()+"var schedulerShiftCellEventHandler=new SchedulerShiftCellEventHandler(rosterSchedulerTable,\"cursorCell\");");
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
}
