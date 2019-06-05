<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.rosterWeb.ITO"%>
<%@ page import="com.rosterWeb.Roster"%>
<%
ObjectMapper objectMapper = new ObjectMapper();
int rosterYear=Integer.parseInt(request.getParameter("year"));
int rosterMonth=Integer.parseInt(request.getParameter("month"));
ITO ito=new ITO();
Map<String,ITO> itoList=ito.getITOList(rosterYear,rosterMonth);
String[] itoIdList = itoList.keySet().toArray(new String[0]);
Roster roster=new Roster(rosterYear,rosterMonth);
Map<String,Map<Integer,String>>preferredShiftList=roster.getITOPreferredShiftList(itoIdList);
out.println(objectMapper.writeValueAsString(preferredShiftList));
%>