<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.rosterWeb.*"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.util.*"%> 
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%
java.sql.Date myDate;
Calendar now=new GregorianCalendar();
String sqlString="replace into shift_requirement(ito_id,shift_requirement,shift_date) values(?,?,?)";
String jdbcDriver="com.mysql.jdbc.Driver";
String jdbcURL ="jdbc:mysql://server/roster?useUnicode=true&characterEncoding=UTF-8";
String dbUserName="cstsang";
String dbUserPwd="30Dec2010";
Class.forName(jdbcDriver);
Connection dbConn= DriverManager.getConnection(jdbcURL,dbUserName,dbUserPwd);
PreparedStatement stmt=dbConn.prepareStatement(sqlString);
try
{
	stmt.setString(1,"ITO1");
	stmt.setString(2,"na");
	stmt.setDate(3,new java.sql.Date(now.getTime().getTime()));
	stmt.executeUpdate();
}
catch (Exception e) 
{
	e.printStackTrace();
}
finally
{
	stmt.close();
	dbConn.close();
	stmt=null;
	dbConn=null;
}
%>
</body>
</html>