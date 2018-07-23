<%@page contentType="text/html; charset=UTF-8"%>
<%@ page import="java.util.Calendar"%>
<%@ page import="java.util.GregorianCalendar" %>
<%
int i=0;
GregorianCalendar now=new GregorianCalendar();
%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" /> 
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script src="https://code.jquery.com/jquery-3.3.1.js"></script>
		<script src="js/RosterTable.js"></script>
		<script>
			var rosterTable;
			$( document ).ready(function() {
				rosterTable=new RosterTable()
				rosterTable.init(<%=now.get(Calendar.YEAR)%>,<%=now.get(Calendar.MONTH)%>);
			});
		</script>	
	</head>
	<body>
		<table width="100%" border=0 id="rosterTable">
					
		</table>			
	</body>
</html>			