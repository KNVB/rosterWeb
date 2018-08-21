<%@ page trimDirectiveWhitespaces="true" %>
<%@ page contentType="applicaton/octet-stream" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.Roster"%>
<%@ page import="com.ITORoster"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>    
<%
	ObjectMapper objectMapper = new ObjectMapper();
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	Roster roster=objectMapper.readValue(br.readLine(),Roster.class);
	roster.exportToExcel();
%>	