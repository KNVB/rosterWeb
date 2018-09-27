<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json;charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.*"%>    
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@ page import="java.util.*"%>
<%
int month=Integer.parseInt(request.getParameter("month"));
int year=Integer.parseInt(request.getParameter("year"));
ITO ito=new ITO();
Hashtable<String,ITO>itoList=ito.getITOList(year, month);
ObjectMapper objectMapper = new ObjectMapper();
String[] itoIdList = itoList.keySet().toArray(new String[0]);
String itoString=new String();
Arrays.sort(itoIdList);
for (String itoId:itoIdList)
{
	ito=itoList.get(itoId);
	itoString+="\""+ito.getItoId()+"\":{";
	itoString+="\"name\":\""+ito.getItoName()+"\","; 
	itoString+="\"postName\":\""+ito.getPostName()+"\",";
	itoString+="\"workingHourPerDay\":"+ito.getWorkingHourPerDay()+",";
	itoString+="\"availableShiftList\":"+objectMapper.writeValueAsString(ito.getAvailableShiftList())+",";
	itoString+="\"blackListedShiftPatternList\":"+objectMapper.writeValueAsString(ito.getBlackListedShiftPatternList())+"},";
}
itoString=itoString.substring(0,itoString.length()-1);	
out.println("{"+itoString+"}");
%>