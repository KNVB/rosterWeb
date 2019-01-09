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
		<meta charset="UTF-8">
		<title>Roster Admin. Page</title>
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/style.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/MonthPick.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/admin/css/style.css">
		
		<script type="text/javascript" src="<%=request.getContextPath()%>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/webjars/jquery-ui/1.9.2/jquery-ui.js"></script>
		<script src="<%=request.getContextPath()%>/js/RosterRule.jsp"></script>
		<script src="<%=request.getContextPath()%>/js/RosterTable.js"></script>
		<script src="<%=request.getContextPath()%>/js/util/Utility.jsp"></script>
		<script src="<%=request.getContextPath()%>/js/util/MonthPicker.js"></script>
		<script src="<%=request.getContextPath()%>/js/util/ShiftCellHighLighter.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/ITO.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/ITOManagement.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/Roster.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/RosterSchedulerTable.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/RosterScheduler.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/util/AdminUtility.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/util/LoadingScreen.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/util/ShiftCellSelector.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/util/SelectedRegionCoordinate.js"></script>
		<script>
			/* Set the width of the side navigation to 250px */
			function openNav() {
			    document.getElementById("mySidenav").style.width = "250px";
			}
	
			/* Set the width of the side navigation to 0 */
			function closeNav() {
			    document.getElementById("mySidenav").style.width = "0";
			}
			function loadScheduler()
			{
				closeNav();
				$("#main").empty();
				var rosterScheduler=new RosterScheduler();
				rosterScheduler.buildRosterTable(<%=rosterYear%>,<%=rosterMonth%>);
			}
			function loadITOManagementPanel()
			{
				closeNav();
				var itoManagement=new ITOManagement($("#main")[0]);
				itoManagement.loadITOList(<%=rosterYear%>,<%=rosterMonth%>)
				.then(function(){
					itoManagement.showITOTable();
				});
			}
			$( document ).ready(function() {
				loadScheduler();
			});
		</script>
	</head>
	<body>
		<div id="mySidenav" class="sidenav">
		  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
		  <a href="javascript:loadScheduler()" >Roster Scheduler</a>
		  <a href="javascript:loadITOManagementPanel()">ITO management</a>
		  <a href="logout.jsp">Logout</a>
		</div>
		<!-- Use any element to open the sidenav -->
		<span onclick="openNav()" class="openbtn">&#9776;</span>
		<!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page -->
		<div id="main">
			<!-- Main Content -->
		</div>
	</body>
</html>	