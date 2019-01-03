<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.rosterWeb.ITO"%>
<%@ page import="com.rosterWeb.Roster"%>
<%@ page import="com.rosterWeb.rosterStatistic.ITOYearlyStatistic"%>
<%
ObjectMapper objectMapper = new ObjectMapper();
int rosterYear=Integer.parseInt(request.getParameter("year"));
int rosterMonth=Integer.parseInt(request.getParameter("month"));
Roster roster=new Roster(rosterYear,rosterMonth);
Map<String,ITOYearlyStatistic> yearlyRosterStatistic=roster.getYearlyStatistic();
out.println(objectMapper.writeValueAsString(yearlyRosterStatistic));
%>