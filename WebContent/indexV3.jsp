<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="util.*"%>
<%@ page import="util.calendar.*" %>
<%@ page import="java.util.Calendar"%>
<%@ page import="java.util.GregorianCalendar" %>
<%
int i=0;
GregorianCalendar now=new GregorianCalendar();
%>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Roster Scheduling</title>
		<link rel="stylesheet" type="text/css" href="css/v3.css">
		<link rel="stylesheet" type="text/css" href="css/MyModal.css">
		<script type="text/javascript" src="<%=request.getContextPath() %>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script src="js/ITO.js"></script>
		<script src="js/RosterRule.js"></script>
		<script src="js/RosterTableV3.js"></script>
		<script src="js/util/Utility.js"></script>
		<script src="js/util/MyModal.js"></script>
		<script src="js/util/MyLoadingScreen.js"></script>
		<script src="js/util/ShiftCellEventHandler.js"></script>
		<script src="js/Roster.js"></script>
		<script src="js/RosterScheduler.js"></script>
		<script>
			$( document ).ready(function() {
				var rosterScheduler=new RosterScheduler();
				rosterScheduler.init(<%=now.get(Calendar.YEAR)%>,<%=now.get(Calendar.MONTH)%>);
				//roster.init(2017,5);
			});
		</script>
	</head>
	<body>
		<table border="0" id="rosterTable">
			<thead id="rosterHeader">
			</thead>
			<tbody id="rosterBody">
			</tbody>
			<tfoot id="footer">
				<tr>
					<td colspan="44">
						<br>
					</td>
				</tr>
				<tr>
					<td colspan=13 class="aShiftColor">	
						a : 0800H - 1700H
					</td>
					<td colspan="20" rowspan=10>
						<div style="text-align:center">
							Auto Planning Start From:
							<select id="autoPlannStartDate"></select>
							to
							<select id="autoPlanEndDate"></select>
							<a class="autoPlannerButton">Auto Planner</a>
						</div>
						<div style="padding-left:10px;display:none" id="genResult">
							<table border=0 >
								<tr>
									<td>Standard Deviation:</td>
								</tr>
								<tr id="theLowestSD">
									<td>1</td>
									<td>1</td>
								</tr>
								<tr id="secondLowestSD">
									<td>1</td>
									<td>1</td>
								</tr>
								<tr id="thirdLowestSD">
									<td >1</td>
									<td>1</td>
								</tr>
								<tr>
									<td><br></td>
								</tr>
								<tr>
									<td>Missing shift Count:</td>
								</tr>
								<tr id="theLowestMissingShiftCount">
									<td>1</td>
									<td>1</td>
								</tr>
								<tr id="theSecondLowestMissingShiftCount">
									<td>1</td>
									<td>1</td>
								</tr>
								<tr id="theThirdLowestMissingShiftCount">
									<td>1</td>
									<td>1</td>
								</tr>						
							</table>
						</div>	
					</td>
					<td colspan="11" rowspan="13">
						<div id="yearlyStatistic">
						</div>
					</td>
				</tr>	
				<tr>
					<td colspan=13 class="bShiftColor">	
						b : 1630H - 2215H
					</td>
				</tr>
				<tr>
					<td colspan=13 class="bShiftColor">	
						b1: 1500H - 2215H
					</td>															
				</tr>
				<tr>
					<td colspan=13 class="cShiftColor">
						c : 2145H - 0830H (the next day)
					</td>				
				</tr>
				<tr>
					<td colspan=13 class="dxShiftColor">
						d : 0800H - 1800H (on weekdays)
					</td>
				</tr>
				<tr>
					<td colspan=13 class="dxShiftColor">
						d1 : 0800H - 1700H (on weekdays)
					</td>								
				</tr>
				<tr>
					<td colspan=13 class="dxShiftColor">
						d2 : 0900H - 1800H (on weekdays)
					</td>				
				</tr>
				<tr>
					<td colspan=13 class="dxShiftColor">
						d3 : 0800H - 1648H (on weekdays)
					</td>
				</tr>
				<tr>
					<td colspan=13 class="sickLeaveColor">
						s : sick leave standby
					</td>
				</tr>
				<tr>
					<td colspan=13 class="oShiftColor">
						O : dayoff
					</td>
				</tr>								
				<tr>
					<td colspan="33">
						<br>
					</td>
				</tr>													
				<tr>
					<td colspan=33 style="text-align:center">
						<a class="findMissingShiftButton">Find Missing Shift</a>
						<a class="findDuplicateShiftButton">Find Duplicate Shift</a>
						<a class="checkAllButton">is it a valid roster?</a>
						<a class="clearAllButton">Clear All Shift Data</a>
					</td>
				</tr>
				<tr>	
					<td colspan=33 style="text-align:center">	
						<a class="exportButton">Export to Excel File</a>
						<a class="saveRosterToDBButton">Save all data to DB</a>
					</td>
				</tr>									
			</tfoot>			
		</table>			
	</body>
</html>	