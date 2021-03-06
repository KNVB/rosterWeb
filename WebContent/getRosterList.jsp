<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>

<%@ page import="com.rosterWeb.ITO"%>
<%@ page import="com.rosterWeb.ITORoster"%>
<%@ page import="com.rosterWeb.Roster"%>

<%@ page import="java.util.Map"%>
<%
ObjectMapper objectMapper = new ObjectMapper();
int rosterYear=Integer.parseInt(request.getParameter("year"));
int rosterMonth=Integer.parseInt(request.getParameter("month"));
ITO ito=new ITO();
Map<String,ITO> itoList=ito.getITOList(rosterYear,rosterMonth);
String[] itoIdList = itoList.keySet().toArray(new String[0]);

Roster roster=new Roster(rosterYear,rosterMonth);
Map<String,ITORoster>itoRosterList=roster.getITORosterList(itoIdList);
out.println(objectMapper.writeValueAsString(itoRosterList));
%>