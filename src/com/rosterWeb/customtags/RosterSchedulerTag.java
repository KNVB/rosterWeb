package com.rosterWeb.customtags;

import java.io.IOException;
import java.util.Hashtable;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;

import com.rosterWeb.ITORoster;
import com.rosterWeb.RosterRule;


public class RosterSchedulerTag extends RosterTableTag 
{
	Hashtable<String,Hashtable<Integer,String>> iTOPreferredShiftList=null;
	public RosterSchedulerTag() 
	{
		super();
		this.showNoOfPrevDate=2;
	}
	protected void genITORow(JspWriter out,String itoId)throws JspException, IOException
	{
		super.genITORow(out, itoId);
		String preferredShiftType;
		Hashtable<Integer,String>iTOPreferredShift=iTOPreferredShiftList.get(itoId);
		out.println(getIndentation()+"<tr id=\"preferredShift_"+itoId+"\">");

		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"alignLeft borderCell\">");
		htmlIndentation++;
		out.println(getIndentation()+"Preferred Shift");
		htmlIndentation--;
		out.println(getIndentation()+"</td>");
		
		for (int i=0;i<this.showNoOfPrevDate;i++)
		{
			out.println(getIndentation()+"<td class=\"alignCenter borderCell\">");
			out.println(getIndentation()+"</td>");
		}
		for (int i=1;i<32;i++)
		{
			if(myDateList.size()>=i)
			{
				preferredShiftType=iTOPreferredShift.get(i);
				out.println(getIndentation()+"<td class=\"alignCenter borderCell  cursorCell\">");
				if (preferredShiftType!=null)
				{
					htmlIndentation++;
					out.println(getIndentation()+preferredShiftType);
					htmlIndentation--;
				}
				out.println(getIndentation()+"</td>");
			}
			else
			{
				out.println(getIndentation()+"<td class=\"alignCenter borderCell\">");
				out.println(getIndentation()+"</td>");
			}
		}
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\" colSpan=\"5\"></td>");
		for (int i=0;i<5;i++)
		{
			out.println(getIndentation()+"<td class=\"alignCenter borderCell\"></td>");
		}	
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
	}
	protected void genButton(JspWriter out) throws JspException, IOException
	{
		out.println("button");
	}
	protected void genStatistic(JspWriter out) throws JspException, IOException
	{
		out.println("statistic");
	}
	protected void getData() 
	{
		super.getData();
		try {
			iTOPreferredShiftList=roster.getITOPreferredShiftList(itoIdList);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	protected void genRosterRows(JspWriter out) throws JspException, IOException
	{
		super.genRosterRows(out);
		ITORoster itoRoster;
		String essentialShift=new String(),template,shiftType;
		for (String shift:RosterRule.getEssentialShiftList())
		{
			essentialShift+=shift.replaceAll("\"", "");
		}
		out.println(getIndentation()+"<tr id=\"vacantShiftRow\">");
		htmlIndentation++;
		out.println(getIndentation()+"<td class=\"vacantShiftLabel borderCell\">Vacant Shifts</td>");
		for (int i=0;i<this.showNoOfPrevDate;i++)
		{
			out.println(getIndentation()+"<td class=\"alignCenter borderCell\">");
			out.println(getIndentation()+"</td>");
		}
		for (int i=1;i<32;i++)
		{
			template=essentialShift;
			out.println(getIndentation()+"<td class=\"alignCenter borderCell vacantShift\">");
			if(myDateList.size()>=i)
			{
				htmlIndentation++;
				for (String itoId:itoIdList)
				{
					itoRoster=itoRosterList.get(itoId);
					shiftType=itoRoster.getShiftList().get(i);
					if (shiftType!=null)
					{
						if (shiftType.equals("b1"))
							template=template.replaceAll("b","");
						else	
							template=template.replaceAll(shiftType,"");
					}
				}
				out.println(getIndentation()+template);
				htmlIndentation--;
			}
			out.println(getIndentation()+"</td>");
		}
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\" colSpan=\"5\"></td>");
		out.println(getIndentation()+"<td id=\"shiftAStdDev\" class=\"alignCenter borderCell\">");
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td id=\"shiftBStdDev\" class=\"alignCenter borderCell\">");
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td id=\"shiftCStdDev\" class=\"alignCenter borderCell\">");
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td id=\"avgStdDev\" class=\"alignCenter borderCell\">");
		out.println(getIndentation()+"</td>");
		out.println(getIndentation()+"<td class=\"alignCenter borderCell\"></td>");
		htmlIndentation--;
		out.println(getIndentation()+"</tr>");
	}
}
