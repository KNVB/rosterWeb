package util.servlet.admin;

import com.ITORoster;
import com.rosterStatistic.ITOYearlyStatistic;
import com.rosterStatistic.MonthlyStatistic;

import java.util.ArrayList;
import java.util.Hashtable;


import util.servlet.user.RosterViewer;

/**
 * Servlet implementation class RosterScheduler
 */
public class RosterScheduler extends RosterViewer {
	private static final long serialVersionUID = 1L;
	
	private Hashtable<String,ITOYearlyStatistic> yearlyRosterStatistic;
	
	protected void getData() 
	{
		super.getData();
		try
		{
			yearlyRosterStatistic=roster.getYearlyStatistic(rosterYear, rosterMonth);
		}
		catch (Exception err)
		{
			err.printStackTrace();
		}
	}
	private void genAutoPlannerResult(ArrayList<String>container)
	{
		container.add("						<div style=\"padding-left:10px;display:none\" id=\"genResult\">");
		container.add("							<table border=0>");
		container.add("								<tr>");
		container.add("									<td>Standard Deviation:</td>");
		container.add("								</tr>");
		container.add("								<tr id=\"theLowestSD\">");
		container.add("									<td>1</td>>");
		container.add("									<td>1</td>");
		container.add("								</tr>");
		container.add("								<tr id=\"secondLowestSD\">");
		container.add("									<td>1</td>");
		container.add("									<td>1</td>");
		container.add("								</tr>");
		container.add("								<tr id=\"thirdLowestSD\">");
		container.add("									<td>1</td>");
		container.add("									<td>1</td>");
		container.add("								</tr>");
		container.add("								<tr>");
		container.add("									<td><br></td>");
		container.add("								</tr>");
		container.add("								<tr>");
		container.add("									<td>Missing shift Count:</td>");
		container.add("								</tr>");
		container.add("								<tr id=\"theLowestMissingShiftCount\">");
		container.add("									<td>1</td>");
		container.add("									<td>1</td>");
		container.add("								</tr>");
		container.add("								<tr id=\"theSecondLowestMissingShiftCount\">");
		container.add("									<td>1</td>");
		container.add("									<td>1</td>");
		container.add("								</tr>");
		container.add("								<tr id=\"theThirdLowestMissingShiftCount\">");
		container.add("									<td>1</td>");
		container.add("									<td>1</td>");
		container.add("								</tr>");						
		container.add("							</table>");
		container.add("						</div>");

	}
	private void genAutoScheduler(ArrayList<String>container)
	{
		int i;
		container.add("						<div style=\"text-align:center\">");
		container.add("							Auto Planning Start From:"); 
		container.add("							<select id=\"autoPlannStartDate\">Auto Planning Start From:");
		for (i=1 ;i<=myCalendarList.size();i++)
		{
			container.add("								<option value="+i+">"+i+"</option>");									
		}
		container.add("							</select>to");
		container.add("							<select id=\"autoPlanEndDate\">");
		for (i=1 ;i<=myCalendarList.size();i++)
		{
				if (i==myCalendarList.size())
					container.add("								<option value="+i+" selected>"+i+"</option>");
				else									
					container.add("								<option value="+i+">"+i+"</option>");									
		}								
		container.add("							</select>");
		container.add("							<a class=\"autoPlannerButton\">Auto Planner</a>");		
		container.add("						</div>");
	}
	protected void genHTMLTitle()
	{
		htmlHeader.add("\t\t<title>RosterScheduler</title>");
	}
	protected void genRosterBody()
	{
		ArrayList<String>shiftList;
		Hashtable<String,ArrayList<String>>iTORosterRowHtml=super.genITORosterRowList();
		Hashtable<String,ArrayList<String>>preferreShiftList= genPreferredShiftList();

		for (String itoId :itoIdList)
		{
			rosterBodyHtml.add("				<tr id=\"shift_"+itoId+"\">");
			shiftList=iTORosterRowHtml.get(itoId);
			rosterBodyHtml.addAll(shiftList);
			rosterBodyHtml.add("				</tr>");
			rosterBodyHtml.add("				<tr id=\"preferredShift_"+itoId+"\">");
			shiftList=preferreShiftList.get(itoId);
			rosterBodyHtml.addAll(shiftList);
			rosterBodyHtml.add("				</tr>");
		}
		genVacantShiftRow();
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
		genAutoScheduler(rosterFooterHtml);
		genAutoPlannerResult(rosterFooterHtml);
		rosterFooterHtml.add("					</td>");
		rosterFooterHtml.add("					<td colspan=\"11\" rowspan=\"23\">");
		genYearlyStatistic(rosterFooterHtml);
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
		genRosterSchedulerButton(rosterFooterHtml);
	}
	private Hashtable<String,ArrayList<String>> genPreferredShiftList()
	{
		ArrayList<String> preferredShiftList;
		Hashtable<String,ArrayList<String>>result=new Hashtable<String,ArrayList<String>>();
		int i;
		ITORoster itoRoster;
		String shiftType;
		for (String itoId :itoIdList)
		{
			preferredShiftList=new ArrayList<String>();
			itoRoster=itoRosterList.get(itoId);
			preferredShiftList.add("					<td class=\"borderCell alignLeft\">Preferred Shift</td>");
			
			if (itoRoster==null)
			{
				super.genEmptyRow(preferredShiftList,itoId);
			}
			else
			{
				for (i=0;i<showNoOfPrevDate;i++)
				{
					preferredShiftList.add("					<td class=\"alignCenter borderCell\"></td>");
				}
				if (itoRoster.getPreferredShiftList().isEmpty())
				{
					super.genEmptyShiftRow(preferredShiftList,itoId);
				}
				else
				{
					for (i=0;i<31;i++)
					{
						if (i< myCalendarList.size())
						{
							shiftType=itoRoster.getPreferredShiftList().get(i+1);
							if (shiftType==null)
							{
								preferredShiftList.add("					<td class=\"alignCenter borderCell shiftCell\"></td>");
							}
							else
							{
								preferredShiftList.add("					<td class=\"alignCenter borderCell shiftCell\">"+shiftType+"</td>");
							}
						}
						else
						{
							preferredShiftList.add("					<td class=\"alignCenter borderCell\"></td>");
						}
					}
					preferredShiftList.add("					<td class=\"borderCell alignCenter\" colspan=\"5\"></td>");
					preferredShiftList.add("					<td class=\"alignCenter borderCell\" ></td>");
					preferredShiftList.add("					<td class=\"alignCenter borderCell\" ></td>");
					preferredShiftList.add("					<td class=\"alignCenter borderCell\" ></td>");
					preferredShiftList.add("					<td class=\"alignCenter borderCell\" ></td>");
					preferredShiftList.add("					<td class=\"alignCenter borderCell\" ></td>");
				}
			}			
			result.put(itoId, preferredShiftList);
		}
		return result;
	}
	private void genRosterSchedulerButton(ArrayList<String>container)
	{
		container.add("				<tr>");
		container.add("					<td colspan=33 style=\"text-align:center\">");
		container.add("						<a class=\"findMissingShiftButton\">Find Missing Shift</a>");
		container.add("						<a class=\"findDuplicateShiftButton\">Find Duplicate Shift</a>");
		container.add("						<a class=\"checkAllButton\">is it a valid roster?</a>");
		container.add("						<a class=\"clearAllButton\">Clear All Shift Data</a>");
		container.add("					</td>");
		container.add("				</tr>");
		container.add("				<tr>");
		container.add("					<td colspan=33 style=\"text-align:center\">");
		container.add("						<a class=\"exportButton\">Export to Excel File</a>");
		container.add("						<a class=\"saveRosterToDBButton\">Save all data to DB</a>");
		container.add("					</td>");
		container.add("				</tr>");	
	}
	private void genVacantShiftRow()
	{
		int i;
		rosterBodyHtml.add("				<tr id=\"vancantShift\">");
		rosterBodyHtml.add("					<td class=\"vancantShift borderCell\">Vancant Shifts</td>");
		rosterBodyHtml.add("					<td class=\"alignCenter borderCell\"></td>");
		rosterBodyHtml.add("					<td class=\"alignCenter borderCell\"></td>");
		for (i=0;i<31;i++)
		{
			rosterBodyHtml.add("					<td class=\"alignCenter borderCell\"></td>");
		}
		rosterBodyHtml.add("					<td class=\"borderCell alignCenter\" colspan=\"5\"></td>");
		rosterBodyHtml.add("					<td class=\"alignCenter borderCell\" id=\"shiftAStdDev\"><script>aShiftStdDev=utility.getSD("+aShiftData+");document.write(utility.roundTo(aShiftStdDev,2));</script></td>");
		rosterBodyHtml.add("					<td class=\"alignCenter borderCell\" id=\"shiftBStdDev\"><script>bShiftStdDev=utility.getSD("+bShiftData+");document.write(utility.roundTo(bShiftStdDev,2));</script></td>");
		rosterBodyHtml.add("					<td class=\"alignCenter borderCell\" id=\"shiftCStdDev\"><script>cShiftStdDev=utility.getSD("+cShiftData+");document.write(utility.roundTo(cShiftStdDev,2));</script></td>");
		rosterBodyHtml.add("					<td class=\"alignCenter borderCell\" id=\"avgStdDev\"><script>var avgStdDev=cShiftStdDev+bShiftStdDev+aShiftStdDev;document.write(utility.roundTo(avgStdDev/3,2));</script></td>");
		rosterBodyHtml.add("					<td class=\"alignCenter borderCell\" ></td>");		
		rosterBodyHtml.add("				</tr>");
	}
	private void genYearlyStatistic(ArrayList<String>container)
	{
		MonthlyStatistic monthlyStatistic; 
		String statisticBodyHTML="";
		ITOYearlyStatistic iTOYearlyStatistic;
		int aShiftTotal,bxShiftTotal,cShiftTotal,dxShiftTotal,oShiftTotal,allShiftTotal,i,month;
		
		container.add("						<div id=\"yearlyStatistic\" style=\"height:450px;overflow-y:scroll\">");
		container.add("							<table style=\"width:500px;borderCollapse:collapse\">");
		container.add("								<tr>");
		container.add("									<td class=\"borderCell alignCenter\">ITO</td>");
		container.add("									<td class=\"borderCell alignCenter\">a</td>");
		container.add("									<td class=\"borderCell alignCenter\">bx</td>");
		container.add("									<td class=\"borderCell alignCenter\">c</td>");
		container.add("									<td class=\"borderCell alignCenter\">dx</td>");
		container.add("									<td class=\"borderCell alignCenter\">O</td>");
		container.add("									<td class=\"borderCell alignCenter\">total</td>");
		container.add("								</tr>");
		
		try
		{
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
				container.add("<tr>");
				container.add("<td class=\"borderCell alignCenter\">"+iTOYearlyStatistic.getItoPostName()+"</td>");
				container.add("<td class=\"borderCell alignCenter\">"+aShiftTotal+"</td>");
				container.add("<td class=\"borderCell alignCenter\">"+bxShiftTotal+"</td>");
				container.add("<td class=\"borderCell alignCenter\">"+cShiftTotal+"</td>");
				container.add("<td class=\"borderCell alignCenter\">"+dxShiftTotal+"</td>");
				container.add("<td class=\"borderCell alignCenter\">"+oShiftTotal+"</td>");
				container.add("<td class=\"borderCell alignCenter\">"+allShiftTotal+"</td>");
				container.add("</tr>");
				container.add(statisticBodyHTML);
			}

		}
		catch (Exception err)
		{
			err.printStackTrace();
		}
		container.add("							</table>");
		container.add("						</div>");
		
	}
}
