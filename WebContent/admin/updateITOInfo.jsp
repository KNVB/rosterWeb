<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rosterWeb.ITO"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="com.fasterxml.jackson.datatype.jsr310.JavaTimeModule"%>

<%@ page import="java.io.*"%> 
<%
ObjectMapper objectMapper = new ObjectMapper();
objectMapper.registerModule(new JavaTimeModule());
BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
ITO ito=objectMapper.readValue(br.readLine(),ITO.class);
ito.update();
%>
