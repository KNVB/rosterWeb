<%@ page language="java" contentType="application/json;charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.*"%>    
<%@ page import="java.util.*"%>
<%@ page import="util.calendar.*" %>
<%//@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%
int month=Integer.parseInt(request.getParameter("month"));
int year=Integer.parseInt(request.getParameter("year"));
ITO ito=new ITO();
ITORoster iTORoster;
Roster roster=new Roster();
roster.setRosterYear(year);
roster.setRosterMonth(month);
roster.load();
Hashtable<Integer,String>weekDayNames=new Hashtable<Integer,String>();
CalendarUtility calendarUtility=new CalendarUtility();
MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(year, month);
Hashtable<Integer,MyCalendar> myCalendarList=mc.getMonthlyCalendar();
MyCalendar myCalendar;

String calendarString=new String(),rosterString=new String(),itoString=new String(),resultString;
calendarString="[";
for (int i=1;i<myCalendarList.size()+1;i++)
{
	myCalendar=myCalendarList.get(i);
	
	calendarString+="{\"weekday\":\""+calendarUtility.weekDayNames.get(myCalendar.getDayOfWeek())+"\",";
	calendarString+="\"isHoliday\":"+myCalendar.isPublicHoliday()+"},";
}
calendarString=calendarString.substring(0,calendarString.length()-1);
calendarString+="]";
resultString="{\"calendarList\":"+calendarString+",";

Hashtable<String,ITO> itoList=ito.getITOList(year, month);
String[] itoPostNameList = itoList.keySet().toArray(new String[0]);

Arrays.sort(itoPostNameList);
for (String itoPostName:itoPostNameList)
{
	ito=itoList.get(itoPostName);
	itoString+="\""+ito.getItoId()+"\":{";
	itoString+="\"itoId\":\""+ito.getItoId()+"\",";
	itoString+="\"name\":\""+ito.getItoName()+"\",";
	itoString+="\"postName\":\""+ito.getPostName()+"\",";
	itoString+="\"availableShift\":[";
	for (String shift:ito.getAvailableShift())
	{
		itoString+="\""+shift+"\",";
	}
	itoString=itoString.substring(0,itoString.length()-1);
	itoString+="],";
	itoString+="\"blackListShiftPatternList\":[";
	for (String blackListedShiftPattern:ito.getBlackListedShiftPattern())
	{
		itoString+="\""+blackListedShiftPattern+"\",";
	}
	itoString=itoString.substring(0,itoString.length()-1);
	itoString+="],";
	itoString+="\"workingHourPerDay\":"+ito.getWorkingHourPerDay()+"},";
	
}
itoString=itoString.substring(0,itoString.length()-1);	
resultString+="\"itoList\":{"+itoString+"},";

Hashtable<String,ITORoster> itoRosterList=roster.getITORosterList();
if(itoRosterList.size()>0)
{	
	for (String itoId:itoRosterList.keySet())
	{
		rosterString+="\""+itoId+"\":{";
		rosterString+="\"lastMonthBalance\":"+itoRosterList.get(itoId).getLastMonthBalance()+",";
		rosterString+="\"shiftList\":[";
		for (Shift shift:itoRosterList.get(itoId).getShiftList())
		{
			rosterString+="\""+shift.getShift()+"\",";
		}
		rosterString=rosterString.substring(0,rosterString.length()-1);
		rosterString+="]},";
	}
	rosterString=rosterString.substring(0,rosterString.length()-1);
	resultString+="\"rosterList\":{"+rosterString+"}";
}
else
{

	for (String itoPostName:itoPostNameList)
	{
		ito=itoList.get(itoPostName);
		rosterString+="\""+ito.getItoId()+"\":{";
		rosterString+="\"lastMonthBalance\":\"N.A.\",";
		rosterString+="\"shiftList\":[]";
		rosterString+="},";
	}
	rosterString=rosterString.substring(0,rosterString.length()-1);
	resultString+="\"rosterList\":{"+rosterString+"}";	
}
resultString+="}";
out.println(resultString);
%>    
