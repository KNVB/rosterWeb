<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="com.rosterWeb.util.calendar.MyCalendarUtility"%>
<%@ page import="com.rosterWeb.util.calendar.MyDate"%>
<%@ page import="com.rosterWeb.util.calendar.MonthlyCalendar"%>
<%@ page import="java.util.Hashtable"%>
<%
int rosterYear=Integer.parseInt(request.getParameter("year"));
int rosterMonth=Integer.parseInt(request.getParameter("month"));
ObjectMapper objectMapper = new ObjectMapper();
MyCalendarUtility myDateUtility=new MyCalendarUtility();
MonthlyCalendar mc=myDateUtility.getMonthlyCalendar(rosterYear,rosterMonth);
Hashtable<Integer,MyDate> myDateList=mc.getMonthlyCalendar();
out.println(objectMapper.writeValueAsString(myDateList));
%>