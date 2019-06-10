<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String loginName=((request.getParameter("loginName")==null)?"":request.getParameter("loginName"));
String password=((request.getParameter("adminPwd")==null)?"":request.getParameter("adminPwd"));
if (loginName.equals(config.getInitParameter("adminUserName"))&& (password.equals(config.getInitParameter("adminPassword"))))
{
	request.changeSessionId();
	session.setAttribute("isAuthenicated",true);
	response.sendRedirect("adminPlatform.jsp");
}
else
{%>
	<script>
		alert("Login failured");
		location.href="index.jsp";
	</script>	
<%}%>
