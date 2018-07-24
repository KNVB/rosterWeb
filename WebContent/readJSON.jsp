<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
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
	Roster roster=new Roster(2018,6);
	String jsonInString = objectMapper.writeValueAsString(roster);
	//out.println(jsonInString);
	roster=null;
	
	roster=objectMapper.readValue(jsonInString,Roster.class);
	out.println(roster.getITORosterList().get("ITO1_1999-01-01").getLastMonthBalance());
%>
</body>
</html>