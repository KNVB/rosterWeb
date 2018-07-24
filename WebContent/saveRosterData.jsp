<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.ITORoster"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>    
<%
	ObjectMapper objectMapper = new ObjectMapper();
	ITORoster itoRoster;
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	Hashtable<String,ITORoster> itoRosterList=objectMapper.readValue(br.readLine(),Hashtable.class);

	for (String itoId:itoRosterList.keySet())
	{
		System.out.println("itoId="+itoId);
		itoRoster=itoRosterList.get(itoId);
		System.out.println(itoRoster.getShiftList());
		System.out.println("====================================");
	}
%>