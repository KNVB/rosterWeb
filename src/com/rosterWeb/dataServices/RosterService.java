package com.rosterWeb.dataServices;

import java.time.LocalDate;
import java.util.TreeMap;

import javax.ws.rs.FormParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.rosterWeb.*;
import com.rosterWeb.util.calendar.MonthlyCalendar;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
@Path("/Roster")
public class RosterService {
	private static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	private Roster roster; 
	public RosterService() {
		roster=new Roster();
	}
	@Path("/getRosterTable")
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	public Response getRosterTable(@FormParam("year") String yearStr, @FormParam("month") String monthStr) throws Exception {
		int rosterMonth=0,rosterYear=0;
		LocalDate now=LocalDate.now();
		logger.debug("yearStr="+yearStr+",month="+monthStr);
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
		logger.debug("year="+rosterYear+",month="+rosterMonth);
		ITO ito=new ITO();
		TreeMap<String,ITO> itoList=ito.getITOList(rosterYear,rosterMonth);
		return Response.ok(roster.getRosterTable(rosterYear, rosterMonth, itoList.keySet().toArray(new String[0]))).build();
	}
}
