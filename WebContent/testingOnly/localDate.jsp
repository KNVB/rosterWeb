<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.time.format.DateTimeFormatter"%>  
<%@ page import="java.time.temporal.TemporalAdjusters"%>  
<%@ page import="java.time.LocalDate"%>    
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Local Date Demo</title>
</head>
<body>
<%
int year=2018,month=12,date=1;
LocalDate theMonthShiftStartDate=LocalDate.of(year,month,date);
LocalDate theMonthShiftEndDate=theMonthShiftStartDate.with(TemporalAdjusters.lastDayOfMonth());	
LocalDate previousMonthShiftStartDate=theMonthShiftStartDate.plusMonths(-1);
LocalDate previousMonthShiftEndDate=previousMonthShiftStartDate.with(TemporalAdjusters.lastDayOfMonth());

%>
theMonthShiftStartDate=<%=theMonthShiftStartDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))%><br>
theMonthShiftEndDate=<%=theMonthShiftEndDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))%><br>
previousMonthShiftStartDate=<%=previousMonthShiftStartDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))%><br>
previousMonthShiftEndDate=<%=previousMonthShiftEndDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))%><br>

</body>
</html>