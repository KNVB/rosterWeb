<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
 ServletContext context = request.getServletContext();
String realPath = context.getRealPath("/template");
out.println(realPath);
%> 