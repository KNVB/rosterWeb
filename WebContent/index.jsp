<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.time.LocalDate"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	int rosterMonth=0,rosterYear=0;
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
<html>
	<head>
		<title>Roster Viewer</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/style.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/MonthPick.css">
		<script type="text/javascript" src="<%=request.getContextPath()%>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script src="<%=request.getContextPath()%>/js/RosterTable.js"></script>
		<script src="<%=request.getContextPath()%>/js/RosterRule.jsp"></script>
		<script src="<%=request.getContextPath()%>/js/util/Utility.jsp"></script>
		<script src="<%=request.getContextPath()%>/js/util/MonthPicker.js"></script>
		<script src="<%=request.getContextPath()%>/js/util/ShiftCellHighLighter.js"></script>
		<script>
			$( document ).ready(function() {
				var rosterTable=new RosterTable($("body"));
				rosterTable.build(<%=rosterYear%>,<%=rosterMonth%>);
			});
		</script>
	</head>
	<body>
	</body>
</html>