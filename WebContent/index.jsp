<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.time.LocalDate"%>
<%@ taglib prefix = "rosterTable" uri = "WEB-INF/rosterTable.tld"%>

<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Roster Viewer</title>
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/style.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/MonthPick.css">
		<script type="text/javascript" src="<%=request.getContextPath()%>/webjars/jquery/3.3.1/jquery.min.js"></script>
	</head>
	<body>
<% 
	int rosterMonth,rosterYear;
	LocalDate now=LocalDate.now();
	try
	{
		rosterYear=Integer.parseInt(request.getParameter("year"));
		rosterMonth=Integer.parseInt(request.getParameter("month"));
	}
	catch  (NumberFormatException nfe)
	{
		rosterYear=now.getYear();
		rosterMonth=now.getMonthValue();
	}
%>	
		<rosterTable:RosterTableTag rosterYear="<%=rosterYear%>" rosterMonth="<%=rosterMonth%>"/>
	</body>
</html>