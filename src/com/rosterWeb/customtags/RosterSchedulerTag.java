package com.rosterWeb.customtags;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;

public class RosterSchedulerTag extends RosterTableTag 
{
	public RosterSchedulerTag() 
	{
		super();
		this.showNoOfPrevDate=2;
	}
	protected void genButton(JspWriter out) throws JspException, IOException
	{
		out.println("button");
	}
	protected void genStatistic(JspWriter out) throws JspException, IOException
	{
		out.println("statistic");
	}
}
