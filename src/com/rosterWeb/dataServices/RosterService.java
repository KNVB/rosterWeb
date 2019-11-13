package com.rosterWeb.dataServices;

import java.time.LocalDate;
import java.util.Map;
import java.util.TreeMap;

import javax.ws.rs.FormParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.rosterWeb.*;
import com.rosterWeb.util.ITORosterSerializer;

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
    @Produces(MediaType.TEXT_PLAIN)
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
		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		module.addSerializer(ITORoster.class, new ITORosterSerializer());
		mapper.registerModule(module);
		logger.debug("year="+rosterYear+",month="+rosterMonth);
		ITORoster[] rosterTable=roster.getRosterTable(rosterYear, rosterMonth);
		return Response.ok(mapper.writeValueAsString(rosterTable)).build();
	}
	@Path("/getRosterRule")
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	public Response getRosterRule()throws Exception {
		Map<String,Object> rosterRule=new TreeMap<String,Object>();
		rosterRule.put("essentialShiftList", RosterRule.getEssentialShiftList());
		rosterRule.put("maxConsecutiveWorkingDay", RosterRule.getMaxConsecutiveWorkingDay());
		rosterRule.put("shiftHourCount",RosterRule.getShiftHourCount());
		rosterRule.put("shiftCssClassName",RosterRule.getShiftCssClassName());
		rosterRule.put("shiftTimeSlot",RosterRule.getShiftTimeSlot());
		return Response.ok(rosterRule).build();
	}
}
