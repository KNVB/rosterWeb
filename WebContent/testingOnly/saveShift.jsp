<%@page contentType="text/html; charset=UTF-8"%>
<%@ page import="java.io.*"%>       
<%@ page import="java.util.*"%>    
<%@ page import="com.Shift"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%> 
<%
	ObjectMapper objectMapper = new ObjectMapper();
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	Shift shift=objectMapper.readValue(br.readLine(),Shift.class);
	out.println(shift.getShiftDate().get(Calendar.YEAR)+"/"+shift.getShiftDate().get(Calendar.MONTH)+"/"+shift.getShiftDate().get(Calendar.DAY_OF_MONTH));
%>	