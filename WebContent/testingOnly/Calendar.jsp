<%@ page trimDirectiveWhitespaces="true"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.time.*"%>
<%@ page import="java.time.format.*"%>
<%@ page import="java.util.Locale"%>
<%@ page import="util.calendar.*"%>
<html>
<head>
<meta charset="UTF-8">
<title>Calendar</title>
</head>
<body>
<%		
int thisMonth,thisYear;
LocalDate now=LocalDate.now();
Locale locale = request.getLocale(); 
try
{
	thisYear=Integer.parseInt(request.getParameter("year"));
	thisMonth=Integer.parseInt(request.getParameter("month"));
}
catch  (NumberFormatException nfe)
{
	thisYear=now.getYear();
	thisMonth=now.getMonthValue();
}
%>
<table style="width:100%" border=1>
	<thead>
		<tr>
			<td style="text-align: center;" colSpan="7">
				<form method="post">
					<select name="year">
<%					for (int i=thisYear-20;i<thisYear+20;i++)
					{
						out.println("<option value=\""+i+"\""+((i==thisYear)?" selected":"")+">"+i+"</option>");
					}%>						
					</select>
					/
					<select name="month">
<%						for (Month c : Month.values())
						{  
							out.println("<option value=\""+c.getValue()+"\""+((c.getValue()==thisMonth)?" selected":"")+">"+c.getDisplayName(TextStyle.FULL, locale)+"</option>");
						}%>
					</select>
				</form>
			</td>	
		</tr>
	</thead>
	<tbody>
		<tr>
<%  int i;
	MyCalendarUtility myCalendarUtility=new MyCalendarUtility();
	MonthlyCalendar mc=myCalendarUtility.getMonthlyCalendar(thisYear, thisMonth);
	DayOfWeek dow=DayOfWeek.of(DayOfWeek.SUNDAY.getValue());
	out.println("<td style=\"text-align: center;color:red;font-weight: bold;\">"+dow.getDisplayName(TextStyle.SHORT, locale)+"</td>");
	for (DayOfWeek dow1:DayOfWeek.values())
	{	
		if (!dow1.equals(DayOfWeek.SUNDAY))
		{
			out.println("<td style=\"text-align: center;\">"+dow1.getDisplayName(TextStyle.SHORT, locale)+"</td>");
		}
	}	
%>		
		</tr>
		<tr>
<%
	for (i=)	
%>		
		</tr>
	</tbody>
</table>
</body>
</html>