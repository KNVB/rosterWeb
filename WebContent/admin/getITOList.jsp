<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>

<%@ page import="com.rosterWeb.ITO"%>
<%@ page import="com.rosterWeb.ITORoster"%>
<%@ page import="com.rosterWeb.Roster"%>

<%@ page import="java.util.Map"%>
<%
int index;
String jsonString="";
ObjectMapper objectMapper = new ObjectMapper();
int rosterYear=Integer.parseInt(request.getParameter("year"));
int rosterMonth=Integer.parseInt(request.getParameter("month"));
ITO ito=new ITO();
Map<String,ITO> itoList=ito.getITOList(rosterYear,rosterMonth);
out.println("{");
for (Map.Entry<String,ITO> entry:itoList.entrySet())
{
	ito=itoList.get(entry.getKey());
	jsonString+="\""+ito.getITOId()+"\":{";
	jsonString+="\"name\":\""+ito.getITOName()+"\",\n";
	jsonString+="\"postName\":\""+ito.getPostName()+"\",\n";
	
	jsonString+="\"workingHourPerDay\":"+ito.getWorkingHourPerDay()+",\n";
	jsonString+="\"availableShiftList\":"+objectMapper.writeValueAsString(ito.getAvailableShiftList())+",\n";
	jsonString+="\"blackListedShiftPatternList\":"+objectMapper.writeValueAsString(ito.getBlackListedShiftPatternList())+",\n";
	jsonString+="\"joinDate\":"+objectMapper.writeValueAsString(ito.getJoinDate())+",\n";
	jsonString+="\"leaveDate\":"+objectMapper.writeValueAsString(ito.getLeaveDate())+"\n";
	jsonString+="},\n";
}
index=jsonString.lastIndexOf(",");
jsonString=jsonString.substring(0,index);
out.println(jsonString);
out.println("}");
%>