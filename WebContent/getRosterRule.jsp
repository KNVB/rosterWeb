<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json;charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.*"%>    
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<% 
ObjectMapper objectMapper = new ObjectMapper();
String resultJSON="{\"essentialShiftList\":[";
for (int i=0;i<RosterRule.getEssentialShiftList().length;i++)
{
	resultJSON+=RosterRule.getEssentialShiftList()[i]+",";
}
resultJSON=resultJSON.substring(0,resultJSON.length()-1);
resultJSON+="],";
resultJSON+="\"shiftHourCount\":{";
for(String key:RosterRule.getShiftHourCount().keySet())
{
	resultJSON+="\""+key+"\":"+RosterRule.getShiftHourCount().get(key)+",";
}
resultJSON=resultJSON.substring(0,resultJSON.length()-1);
resultJSON+="},";
resultJSON+="\"maxConsecutiveWorkingDay\":"+RosterRule.getMaxConsecutiveWorkingDay()+"}";
out.println(resultJSON);
/*out.println("\"maxConsecutiveWorkingDay\":"+RosterRule.getMaxConsecutiveWorkingDay()+",");
out.println("\"shiftHourCount\":"+objectMapper.writeValueAsString(RosterRule.getShiftHourCount())+"}");*/
%>    