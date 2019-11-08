package com.rosterWeb.dataServices;
import java.time.LocalDate;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.rosterWeb.util.calendar.*;

@Path("/Calendar")
public class Calendar {

	public Calendar() {
		// TODO Auto-generated constructor stub
	}
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	public Response get(@FormParam("year") String yearStr, @FormParam("month") String monthStr) {
		int rosterMonth=0,rosterYear=0;
		LocalDate now=LocalDate.now();
		try
		{
			rosterYear=Integer.parseInt(yearStr);
			rosterMonth=Integer.parseInt(monthStr);
		}
		catch  (NumberFormatException nfe)
		{
			rosterYear=now.getYear();
			rosterMonth=now.getMonthValue();
		}
/*
		MyCalendarUtility myDateUtility=new MyCalendarUtility();
		MonthlyCalendar mc=myDateUtility.getMonthlyCalendar(rosterYear,rosterMonth);
		return Response.ok(mc).build();*/
		
	}
}
