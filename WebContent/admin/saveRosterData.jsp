<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.rosterWeb.Roster"%>
<%@ page import="com.rosterWeb.ITORoster"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>    
<%
	ObjectMapper objectMapper = new ObjectMapper();
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	Roster roster=objectMapper.readValue(br.readLine(),Roster.class);
	if (!roster.update())
		response.sendError(500,"Update Roster Data Failure.");
%>