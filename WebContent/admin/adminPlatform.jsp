<%@ page trimDirectiveWhitespaces="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.time.LocalDate"%>
<%@ taglib prefix = "rosterTable" uri = "/WEB-INF/rosterScheduler.tld"%>
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
<html>
	<head>
		<meta charset="UTF-8">
		<title>Roster Admin. Page</title>
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/style.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/MonthPick.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/admin/css/style.css">
		<script type="text/javascript" src="<%=request.getContextPath()%>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script src="<%=request.getContextPath()%>/js/util/MonthPicker.js"></script>
		<script>
			/* Set the width of the side navigation to 250px */
			function openNav() {
			    document.getElementById("mySidenav").style.width = "250px";
			}
	
			/* Set the width of the side navigation to 0 */
			function closeNav() {
			    document.getElementById("mySidenav").style.width = "0";
			}
			$( document ).ready(function() {
				var mP=new MonthPicker({elements:$("#rosterMonth"),initYear:"<%=rosterYear%>",minValue: "01/2017"});
				mP.onPick(function (year,month){
								var form=document.getElementById("rosterMonthForm");
								form.month.value=month;
								form.year.value=year;
								console.log(year,month);
								form.submit();
				});				
			});			
		</script>
	</head>
	<body>
		<div id="mySidenav" class="sidenav">
		  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
		  <a href="#">Roster Scheduler</a>
		  <a href="#">Staff Info. management</a>
		  <a href="logout.jsp">Logout</a>
		</div>
		<!-- Use any element to open the sidenav -->
		<span onclick="openNav()" class="burger">&#9776;</span>
		<!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page -->
		<div id="main">
			<rosterTable:RosterSchedulerTag rosterYear="<%=rosterYear%>" rosterMonth="<%=rosterMonth%>"/>
		</div>
	</body>
</html>	