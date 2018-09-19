<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json;charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.*"%>    
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<% 
out.println(Utility.getRosterRuleJSON());
%>    