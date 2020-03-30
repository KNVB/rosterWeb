<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="com.rosterWeb.util.calendar.CalendarUtility"%>
<%@ page import="com.rosterWeb.util.calendar.CalendarElement"%>
<%@ page import="java.util.Hashtable"%>
<%
int rosterYear=Integer.parseInt(request.getParameter("year"));
int rosterMonth=Integer.parseInt(request.getParameter("month"));
ObjectMapper objectMapper = new ObjectMapper();
CalendarUtility calendarUtility=new CalendarUtility();
CalendarElement calendarElementList[]=calendarUtility.getMonthlyCalendar(rosterYear,rosterMonth);
out.println(objectMapper.writeValueAsString(calendarElementList));
%>