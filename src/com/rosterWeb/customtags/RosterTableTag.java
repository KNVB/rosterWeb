package com.rosterWeb.customtags;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.SimpleTagSupport;

public class RosterTableTag extends SimpleTagSupport 
{
	private int rosterMonth,rosterYear;
	public RosterTableTag() 
	{
		
	}	
	public void setRosterMonth(int rosterMonth) {
		this.rosterMonth = rosterMonth;
	}
	public void setRosterYear(int rosterYear) {
		this.rosterYear = rosterYear;
	}
	public void doTag() throws JspException, IOException
	{
		JspWriter out = getJspContext().getOut();
		out.println("year="+this.rosterYear+",month="+this.rosterMonth);
	}
}
