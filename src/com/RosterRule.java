package com;

import java.util.ArrayList;
import java.util.Hashtable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import util.DataStore;

public class RosterRule 
{
	private static final Logger logger = LogManager.getLogger("RosterRule");
	private static Hashtable<String,Float>shiftHourCount=new Hashtable<String,Float>();
	
	private static String essentialShiftList[];
	
	private static int maxConsecutiveWorkingDay;
	private static RosterRule instance;
	 static 
	    {
	        try 
	        {
				instance = new RosterRule();
				logger.info("Roster Rule instantiated.");
			} 
	        catch (Exception e) 
	        {
	        	throw new ExceptionInInitializerError(e);
			}
	    }
	 
	private RosterRule() throws Exception
	{
		 init();
	}
	/**
     * Singleton access method.
     *
     * @return Singleton
     */
    public static RosterRule getInstance() {
        return instance;
    }
	private void init() throws Exception
	{
		String []temp;
		String tempString;
		String escapChar=String.valueOf((char)27);
		
		DataStore dataStore=Utility.getDataStore();
		Hashtable<String,ArrayList<String>>rosterRule=dataStore.getRosterRule();
		dataStore.close();
		dataStore=null;
		for (String shift:rosterRule.get("shiftHour"))
		{
			temp=shift.split(escapChar);
			shiftHourCount.put(temp[0],Float.valueOf(temp[1]));
		}
		tempString=rosterRule.get("ConsecutiveWorkingDay").get(0);
		temp=tempString.split(escapChar);
		maxConsecutiveWorkingDay=Integer.valueOf(temp[1]);
		tempString=rosterRule.get("shifList").get(0);
		temp=tempString.split(escapChar);
		tempString=temp[1];
		essentialShiftList=tempString.split(",");
	}
	public static int getMaxConsecutiveWorkingDay()
	{
		return maxConsecutiveWorkingDay;
	}
	public static Hashtable<String, Float> getShiftHourCount() 
	{
		return shiftHourCount;
	}
	public static String[] getEssentialShiftList() 
	{
		return essentialShiftList;
	}
}
