<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.RosterData"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>    
<%
	ObjectMapper objectMapper = new ObjectMapper();
	
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	RosterData rosterData=objectMapper.readValue(br.readLine(),RosterData.class);
	System.out.println(rosterData.getYear()+"-"+rosterData.getMonth());
	Hashtable<String,Hashtable<String,String>>shiftList;
	Hashtable<String,Hashtable<String,Hashtable<String,String>>> shiftLists=rosterData.getShiftList();
	for (String date:shiftLists.keySet())
	{
		System.out.println("date:"+date);
		shiftList=shiftLists.get(date);
		for (String itoId:shiftList.keySet())
		{	
			System.out.printf("%S,shift:%S,requested shift:%S\n",itoId,shiftList.get(itoId).get("shift"),shiftList.get(itoId).get("requirementShift"));
		}
		System.out.println("==========================");
	}
%>