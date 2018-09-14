<%@ page trimDirectiveWhitespaces="true"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="com.*"%>    
<%@ page import="util.*"%>
<%@ page import="util.calendar.*" %>
<%@ page import="java.util.*"%>
<%@ page import="java.util.Calendar"%>
<%@ page import="java.util.GregorianCalendar" %>
<%
int i=0;
GregorianCalendar now=new GregorianCalendar();
ITO ito=new ITO();
ITORoster iTORoster;
Roster roster=new Roster();
roster.setRosterYear(now.get(Calendar.YEAR));
roster.setRosterMonth(now.get(Calendar.MONTH));
roster.load();
Hashtable<Integer,String>weekDayNames=new Hashtable<Integer,String>();
CalendarUtility calendarUtility=new CalendarUtility();
MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(now.get(Calendar.YEAR),now.get(Calendar.MONTH));
Hashtable<Integer,MyCalendar> myCalendarList=mc.getMonthlyCalendar();
MyCalendar myCalendar;
%>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Roster Scheduling</title>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script type="text/javascript" src="<%=request.getContextPath() %>/webjars/jquery/3.3.1/jquery.min.js"></script>
	</head>
	<body>
	</body>
</html>		