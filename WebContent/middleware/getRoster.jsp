<%@ page trimDirectiveWhitespaces="true"%>
<%@ page language="java" contentType="application/json;charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.*"%>    
<%@ page import="java.util.*"%>
<%@ page import="util.calendar.*" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%
int month=Integer.parseInt(request.getParameter("month"));
int year=Integer.parseInt(request.getParameter("year"));
String resultString=Utility.getRosterListJSON(year, month);
out.println(resultString);
%>    
