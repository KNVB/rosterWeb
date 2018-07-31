<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*"%>
<%@ page import="com.RosterRule"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Hashtable"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<%
char escapChar=(char)27;
ArrayList <String>valueList=null;
String ruleKey=new String();
String ruleType=new String();
String dbUserName="operator";
String dbUserPwd="f5P@ssword";
String jdbcURL ="jdbc:mysql://f5vm9/operator_roster?useUnicode=true&characterEncoding=UTF-8";
String sqlString ="select * from roster_rule order by rule_type,rule_key,rule_value";
Hashtable<String,ArrayList<String>> result=new Hashtable<String,ArrayList<String>>();
Class.forName("com.mysql.jdbc.Driver");
Connection dbConn = DriverManager.getConnection(jdbcURL,dbUserName,dbUserPwd);
Statement stmt = dbConn.createStatement();
ResultSet rs = stmt.executeQuery(sqlString);
while (rs.next())
{
	//out.println(rs.getString("rule_type")+","+rs.getString("rule_key")+","+rs.getString("rule_value")+"<br>");
	if (rs.getString("rule_type").equals(ruleType))
	{
		valueList.add(rs.getString("rule_key")+escapChar+rs.getString("rule_value"));
	}
	else
	{
		if (valueList!=null)
		{
			result.put(ruleType,valueList);
			ruleType=rs.getString("rule_type");
		}
		ruleType=rs.getString("rule_type");
		valueList=new ArrayList<String>();
		valueList.add(rs.getString("rule_key")+escapChar+rs.getString("rule_value"));
	}
}
result.put(ruleType,valueList);
rs.close();
stmt.close();
dbConn.close();
for (String rT :result.keySet())
{
	out.println(rT+","+result.get(rT)+"<br>");
}
out.println("===============================================<br>");
out.println(RosterRule.getMaxConsecutiveWorkingDay()+"<bR>");
out.println(RosterRule.getShiftHourCount()+"<br>");
for (String shift:RosterRule.getEssentialShiftList())
	out.println(shift+"<br>"); 
%>
</body>
</html>