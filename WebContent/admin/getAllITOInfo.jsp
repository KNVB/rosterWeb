<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="com.fasterxml.jackson.datatype.jsr310.JavaTimeModule"%>
<%@ page import="com.rosterWeb.ITO"%>
<%@ page import="com.rosterWeb.ITORoster"%>
<%@ page import="com.rosterWeb.Roster"%>

<%@ page import="java.util.Map"%>
<%
ObjectMapper objectMapper = new ObjectMapper();
ITO ito=new ITO();
Map<String,ITO> itoList=ito.getAllITOInfo();
objectMapper.registerModule(new JavaTimeModule());
out.println(objectMapper.writeValueAsString(itoList));
%>