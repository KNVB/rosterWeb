<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="com.rosterWeb.RosterRule"%>
<%@ page import="java.time.LocalDate"%>
<%@ page import="java.util.Map"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	int rosterMonth=0,rosterYear=0;
	LocalDate now=LocalDate.now();
	Map <String,Float>shiftHourCount=RosterRule.getShiftHourCount();
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
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Roster Admin. Page</title>
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/style.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/MonthPick.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/admin/css/style.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/webjars/jquery-ui/1.12.1/jquery-ui.min.css">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
		
		<script type="text/javascript" src="<%=request.getContextPath()%>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/webjars/jquery-ui/1.12.1/jquery-ui.min.js"></script>
		<script src="<%=request.getContextPath()%>/js/util/Css.js"></script>
		<script src="<%=request.getContextPath()%>/js/BasicCellObjects.js"></script>
		<script src="<%=request.getContextPath()%>/js/DerivedCellObjets.js"></script>
		<script src="<%=request.getContextPath()%>/js/RosterRule.jsp"></script>
		<script src="<%=request.getContextPath()%>/js/RosterTable.js"></script>
		<script src="<%=request.getContextPath()%>/js/util/Utility.jsp"></script>
		<script src="<%=request.getContextPath()%>/js/util/MonthPicker.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/AdminObjects.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/ITO.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/ITOManagement.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/Roster.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/RosterSchedulerTable.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/RosterScheduler.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/util/AdminCss.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/util/AdminUtility.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/util/LoadingScreen.js"></script>
		<script src="<%=request.getContextPath()%>/admin/js/util/SelectedRegion.js"></script>
		<script>
			var rosterScheduler=null,itoManagement=null;
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
				if (rosterScheduler!=null)
					rosterScheduler.destroy();
				rosterScheduler=new RosterScheduler();
				rosterScheduler.buildRosterTable(<%=rosterYear%>,<%=rosterMonth%>);
				itoManagement=null;
			}
			function loadITOManagementPanel()
			{
				closeNav();
				var itoManagement=new ITOManagement($("#main")[0]);
				itoManagement.showITOTable();
				if (rosterScheduler!=null)
					rosterScheduler.destroy();
				rosterScheduler=null;
			}
			
			$( document ).ready(function() {
				$( "#datepicker" ).datepicker({dateFormat:"yy-mm-dd","defaultDate":new Date(1999,1,1)});
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
		<div style="width:100%;flex-direction:row;margin:0px;display:flex;">
			<div style="display:flex;flex:1 1 auto;margin:0px;">
				<span onclick="openNav()" class="openbtn" style="padding:0px;margin:0px">&#9776;</span>
			</div>
			<div style="width:100%;margin:0px;display:flex;align-items:center;flex-direction:column">
				<div style="display:flex;flex:1 1 auto;margin:0px;">
					<h1 style="padding:0px;margin:0px;">EMSTF Roster Admin. Page</h1>
				</div>
				<div style="display:flex;flex:1 1 auto;margin:0px;align-items:center;flex-direction:column" id="main">
				</div>
			</div>
		</div>	
		<form id="updateITOInfoFormTemplate" style="display:none" method="post">
			<input type="hidden" name="itoId">
			<table border="1">
				<tr>
					<td>ITO Name</td>
					<td><input type="text" name="itoName" required></td>
				</tr>
				<tr>
					<td>Post Name</td>
					<td><input type="text" name="postName" required></td>
				</tr>
				<tr>
					<td>Avaliable Shift Type</td>
					<td>
					<%
					for (String key : shiftHourCount.keySet()) 
					{
			            out.println(key+"<input type=\"checkbox\" value=\""+key+"\" name=\"availableShiftList\">");
			        }
					%>
					</td>
				</tr>
				<tr>
					<td>Black Listed Shift Type</td>
					<td id="blackListShiftPatterns">
						<div class="blackListShiftDiv">
							<div class="blackListShiftListDiv">
								<div>
									<input name="blackListShiftPatternList" required type="text">
									<span class="fas fa-minus-circle" style="cursor: pointer;"></span>
								</div>
							</div>
							<div class="addBlackListShiftEntryDiv">
								<span class="fas fa-plus-circle" style="cursor:pointer"></span>
							</div>
						</div>
					</td>
				</tr>	
				<tr>
					<td>No. of Working Hour Per Day</td>
					<td><input type="number" step="0.01" name="workingHourPerDay" required></td>
				</tr>
				<tr>
					<td>Join Date</td>
					<td><input type="text" name="joinDate" required readonly></td>
				</tr>
				<tr>
					<td>Leave Date</td>
					<td>
						<input type="text" name="leaveDate" required readonly>
						"2099-12-31" mean active member
					</td>
				</tr>
				<tr>
					<td colspan="2" style="text-align: right;"><input type="submit" name="submitButton" value="Update"></td>
				</tr>
			</table>
		</form>
		
	</body>
</html>	