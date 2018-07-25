<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*"%>
<%@ page import="com.Shift"%>    
<%@ page import="com.Roster"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%
	ObjectMapper objectMapper = new ObjectMapper();
	Roster roster=new Roster();
	roster.setRosterYear(2018);
	roster.setRosterMonth(6);
	roster.load();
	String jsonInString = objectMapper.writeValueAsString(roster);
	//out.println(jsonInString);
	roster=null;
	
	roster=objectMapper.readValue(jsonInString,Roster.class);
	//out.println(roster.getITORosterList().get("ITO1_1999-01-01").getLastMonthBalance());
	
	
	jsonInString="{\"itoId\":\"ITO1_1999-01-01\",\"shift\":\"b\",\"shiftDate\":1530403200000}";
	Shift shift=objectMapper.readValue(jsonInString,Shift.class);
	out.println(shift.getShiftDate().get(Calendar.DAY_OF_MONTH)+"/"+shift.getShiftDate().get(Calendar.MONTH));
%>
<br>
<script>
	var theDate=new Date();
	theDate.setTime(1530374400000);
	document.write(theDate.getDate()+"/"+theDate.getMonth());
</script>
</body>
</html>