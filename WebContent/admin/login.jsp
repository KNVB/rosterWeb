<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String loginName=((request.getParameter("loginName")==null)?"":request.getParameter("loginName"));
String password=((request.getParameter("adminPwd")==null)?"":request.getParameter("adminPwd"));
System.out.println("loginName="+loginName+",adminPassword="+password);
System.out.println(config.getInitParameter("adminUserName")+","+config.getInitParameter("adminPassword"));
if (loginName.equals(config.getInitParameter("adminUserName"))&& (password.equals(config.getInitParameter("adminPassword"))))
{
	session.setAttribute("isAuthenicated",true);
	response.sendRedirect("rosterScheduler");
}
else
{%>
	<script>
		alert("Login failured");
		location.href="index.jsp";
	</script>	
<%}%>
