<%@ page trimDirectiveWhitespaces="true"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.*" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>

<%@ page import="java.util.*" %>
<%@ page import="util.calendar.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<%
int rosterMonth,rosterYear;
String[] itoIdList;
GregorianCalendar now=new GregorianCalendar();
CalendarUtility calendarUtility=new CalendarUtility();


try
{
	rosterYear=Integer.parseInt(request.getParameter("year"));
	rosterMonth=Integer.parseInt(request.getParameter("month"));
}
catch  (NumberFormatException nfe)
{
	rosterYear=now.get(Calendar.YEAR);
	rosterMonth=now.get(Calendar.MONTH);
}		

Roster roster=new Roster();
ITO ito=new ITO();
ITORoster itoRoster;
Hashtable<String,Hashtable<Integer,String>>allPreferredShiftList;
Hashtable<String,ITORoster>itoRosterList;

Hashtable<String,ITO> itoList=ito.getITOList(rosterYear,rosterMonth);
MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(rosterYear,rosterMonth);
Hashtable<Integer,MyCalendar>myCalendarList=mc.getMonthlyCalendar();
ObjectMapper objectMapper = new ObjectMapper();
PreferredShift preferredShift=new PreferredShift();

itoIdList = itoList.keySet().toArray(new String[0]);
Arrays.sort(itoIdList);
itoRosterList=roster.getRoster(rosterYear,rosterMonth, itoIdList);
allPreferredShiftList=preferredShift.getPreferredShiftList(rosterYear,rosterMonth, itoIdList);
out.println("<hr>");
out.println(objectMapper.writeValueAsString(myCalendarList)+"<br>");
out.println(objectMapper.writeValueAsString(itoRosterList)+"<br>");

out.println(objectMapper.writeValueAsString(allPreferredShiftList)+"<br>");
out.println("<hr>");
%>
</body>
</html>