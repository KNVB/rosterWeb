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
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<script type="text/javascript" src="<%=request.getContextPath() %>/webjars/jquery/3.3.1/jquery.min.js"></script>
	<script src="js/ITO.js"></script>
	<script src="js/RosterRule.js"></script>
	<script src="js/RosterTable.js"></script>
	<script src="js/Utility.js"></script>
	<script src="js/Roster.js"></script>
	<script>
		$( document ).ready(function() {
			var roster=new Roster();
			roster.init(<%=now.get(Calendar.YEAR)%>,<%=now.get(Calendar.MONTH)%>);
			//roster.init(2017,5);
		});
	</script>
</head>
<body>
	<table  border="0" id="rosterTable">
		<thead id="rosterHeader">
		</thead>
		<tbody id="rosterBody">
		</tbody>
		<tfoot id="footer" class="footer">
			<tr>
				<td colspan="45">
					<br>
				</td>
			</tr>
			<tr>
				<td colspan=13 class="aShiftColor">	
					a : 0800H - 1700H
				</td>
				<td colspan="21" rowspan=10 align="center">
					Auto Planning Start From:
					<select id="autoPlannStartDate"></select>
					to
					<select id="autoPlanEndDate"></select>
					<a class="autoPlannerButton">Auto Planner</a>	
				</td>
				<td colspan="11" rowspan="20">
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
				<td colspan="34">
					<br>
				</td>
			</tr>													
			<tr>
				<td colspan=34 style="text-align:center">
					<a class="findMissingShiftButton">Find Missing Shift</a>
					<a class="findDuplicateShiftButton">Find Duplicate Shift</a>
					<a class="checkAllButton">is it a valid roster?</a>
					<a class="clearAllButton">Clear All Shift Data</a>
				</td>
			</tr>
			<tr>	
				<td colspan=34 style="text-align:center">	
					<a class="exportButton">Export to Excel File</a>
					<a class="saveRosterToDBButton">Save all data to DB</a>
				</td>
				
			</tr>									
		</tfoot>
	</table>		
</body>
</html>