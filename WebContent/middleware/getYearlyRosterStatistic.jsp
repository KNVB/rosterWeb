<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json;charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.*"%>    
<%@ page import="com.rosterStatistic.ITOYearlyStatistic"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="java.util.*"%>
<%
	int month=Integer.parseInt(request.getParameter("month"));	
	int year=Integer.parseInt(request.getParameter("year"));
	Roster roster=new Roster();
	ITOYearlyStatistic iTOYearlyStatistic;
	ObjectMapper objectMapper = new ObjectMapper();
	Hashtable<String,ITOYearlyStatistic> yearlyRosterStatistic=roster.getYearlyStatistic(year, month);
	String[] itoIdList = yearlyRosterStatistic.keySet().toArray(new String[0]);
	Arrays.sort(itoIdList);
	String resultString="{";
	for (String itoId:itoIdList)
	{
		iTOYearlyStatistic= yearlyRosterStatistic.get(itoId);
		resultString+="\""+itoId+"\":{";
		resultString+="\"itoPostName\":\""+iTOYearlyStatistic.getItoPostName()+"\",";
		resultString+="\"itoMonthlyStatisticList\":"+objectMapper.writeValueAsString(iTOYearlyStatistic.getITOMonthlyStatisticList())+"},";
	}
	resultString=resultString.substring(0,resultString.length()-1);
	resultString+="}";
	out.println(resultString);
%>