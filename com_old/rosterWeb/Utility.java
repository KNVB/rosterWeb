package com_old.rosterWeb;

import java.io.InputStream;
//import java.util.Arrays;
//import java.util.Hashtable;
import java.util.PropertyResourceBundle;

import com_old.rosterWeb.util.DataStore;

public class Utility 
{
	private static Utility instance;
	private static String configFile = "META-INF/config.properties";
	private static PropertyResourceBundle bundle ;
	// Singleton initialiser
    static 
    {
        try 
        {
			instance = new Utility(configFile);
		} 
        catch (Exception e) 
        {
        	throw new ExceptionInInitializerError(e);
		}
    }
    /**
     * Constructor
     *
     * @param fileName Configuration file name.
     * @throws Exception 
     */
    private Utility(String fileName) throws Exception {
        init(fileName);
    }
    /**
     * Initialize the class.
     *
     * @param fileName Configuration file name.
     * @throws Exception 
     */
    private void init(String fileName) throws Exception 
    {
    	ClassLoader loader = Thread.currentThread().getContextClassLoader();
		InputStream resourceStream = loader.getResourceAsStream(fileName);
		if (resourceStream==null)
			throw new Exception("config.properties file not found");
		else
		{
			bundle=new PropertyResourceBundle(resourceStream);
		}
    }
	/**
     * Singleton access method.
     *
     * @return Singleton
     */
    public static Utility getInstance() {
        return instance;
    }
    /**
     * Get DataStore implementation class.
     * @return DataStore object
     * @throws InstantiationException the exception that was raised while instantiating the class
     * @throws IllegalAccessException the exception that was raised while reflecting the class
     * @throws ClassNotFoundException Class not found
     */
    public static DataStore getDataStore() throws InstantiationException, IllegalAccessException, ClassNotFoundException
    {
    	DataStore dataStore= (DataStore)Class.forName(bundle.getString("DataStoreImplementationClassName")).newInstance();
    	return dataStore;
    }
    /**
     * Get Parameter value from the configuration file.
     * @param parameterName parameter name/key
     * @return value
     */
    public static String getParameterValue(String parameterName)
    {
    	return bundle.getString(parameterName);
    }
  /*  public static String getRosterListJSON(int year,int month)throws Exception
    {
    	String resultString=new String();
    	ITO ito=new ITO();
    	Roster roster=new Roster();
    	roster.setRosterYear(year);
    	roster.setRosterMonth(month);
    	roster.load();
    	
    	CalendarUtility calendarUtility=new CalendarUtility();
    	MonthlyCalendar mc=calendarUtility.getMonthlyCalendar(year,month);
    	Hashtable<Integer,MyCalendar> myCalendarList=mc.getMonthlyCalendar();
    	Hashtable<String,ITORoster> itoRosterList=roster.getITORosterList();
    	Hashtable<String,ITO> itoList=ito.getITOList(year,month);
    	MyCalendar myCalendar;
    	ObjectMapper objectMapper = new ObjectMapper();
    	
    	String calendarString="[";
    	for (int i=1;i<myCalendarList.size()+1;i++)
    	{
    		myCalendar=myCalendarList.get(i);
    		
    		calendarString+="{\"weekday\":\""+calendarUtility.weekDayNames.get(myCalendar.getDayOfWeek())+"\",";
    		calendarString+="\"isHoliday\":"+myCalendar.isPublicHoliday()+"},";
    	}
    	calendarString=calendarString.substring(0,calendarString.length()-1);
    	calendarString+="]";
    	resultString="{\"calendarList\":"+calendarString+",";
    	
    	String[] itoIdList = itoList.keySet().toArray(new String[0]);
    	String itoString=new String();
    	Arrays.sort(itoIdList);
    	for (String itoId:itoIdList)
    	{
    		ito=itoList.get(itoId);
    		itoString+="\""+ito.getItoId()+"\":{";
    		itoString+="\"itoName\":\""+ito.getItoName()+"\","; 
    		itoString+="\"postName\":\""+ito.getPostName()+"\",";
    		
    		itoString+="\"workingHourPerDay\":"+ito.getWorkingHourPerDay()+",";
    				
    		itoString+="\"joinDate\":"+objectMapper.writeValueAsString(ito.getJoinDate())+",";
    		itoString+="\"leaveDate\":"+objectMapper.writeValueAsString(ito.getLeaveDate())+",";
    		itoString+="\"availableShiftList\":"+objectMapper.writeValueAsString(ito.getAvailableShiftList())+",";
    		itoString+="\"blackListedShiftPatternList\":"+objectMapper.writeValueAsString(ito.getBlackListedShiftPatternList())+"},";
    	}
    	itoString=itoString.substring(0,itoString.length()-1);	
    	resultString+="\"itoList\":{"+itoString+"},";
    	
    	String rosterString=new String();
    	if(itoRosterList.size()>0)
    	{	
    		for (String itoId:itoIdList)
    		{
    			rosterString+="\""+itoId+"\":{";
    			rosterString+="\"lastMonthBalance\":"+itoRosterList.get(itoId).getBalance()+",";
    			rosterString+="\"shiftList\":";
    			rosterString+=objectMapper.writeValueAsString(itoRosterList.get(itoId).getShiftList())+",";
    			rosterString+="\"previousMonthShiftList\":";
    			rosterString+=objectMapper.writeValueAsString(itoRosterList.get(itoId).getPreviousMonthShiftList())+",";
    			rosterString+="\"preferredShiftList\":";
    			rosterString+=objectMapper.writeValueAsString(itoRosterList.get(itoId).getPreferredShiftList());
    			rosterString+="},";
    		}
    	}
    	else
    	{
    		for (String itoId:itoIdList)
    		{
    			ito=itoList.get(itoId);
    			rosterString+="\""+ito.getItoId()+"\":{";
    			rosterString+="\"lastMonthBalance\":\"N.A.\",";
    			rosterString+="\"preferredShiftList\":[],";
    			rosterString+="\"previousMonthShiftList\":[],";
    			rosterString+="\"shiftList\":[]";
    			rosterString+="},";
    		}	
    	}
    	rosterString=rosterString.substring(0,rosterString.length()-1);
    	resultString+="\"rosterList\":{"+rosterString+"}";
    	resultString+="}";

    	return resultString;
    } 
    public static String getRosterRuleJSON() throws Exception
    {
    	ObjectMapper objectMapper = new ObjectMapper();
    	String resultJSON="{\"essentialShiftList\":",tempString=objectMapper.writeValueAsString(RosterRule.getEssentialShiftList());
    	tempString=tempString.replaceAll("\\\\","").replaceAll("\"\"","\"");
    	resultJSON+=tempString;
    	resultJSON+=",";
    	resultJSON+="\"shiftHourCount\":";
    	resultJSON+=objectMapper.writeValueAsString(RosterRule.getShiftHourCount());
    	resultJSON+=",";
    	resultJSON+="\"maxConsecutiveWorkingDay\":"+RosterRule.getMaxConsecutiveWorkingDay()+"}";
    	return resultJSON;
    }*/
    public static double roundTo(double value,int decPlace)
    {
    	double result;
    	result=value*Math.pow(10, decPlace);
    	result=Math.round(result);
    	result/=Math.pow(10, decPlace);
    	return result;
    }
}
