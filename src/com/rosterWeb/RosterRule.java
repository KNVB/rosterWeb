package com.rosterWeb;

import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.rosterWeb.util.DataStore;
/**
 * It denote a set of roster rules.
 * All parameters are read from DataStore object
 */
public class RosterRule 
{
	private static final Logger logger = LogManager.getLogger("RosterRule");
	private static Map<String, Float>shiftHourCount; 
	private static Map<String, String>shiftCssClassName;
	private static Map<String, String>shiftTimeSlot;
	/**
	 * It stores the essential shift of every day
	 */
	private static String essentialShiftList[];

	/**
	 * It stores the maximum no. of consecutive working day
	 */
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
		DataStore dataStore=Utility.getDataStore();
		dataStore.initRosterRule();
		dataStore.close();
		dataStore=null;
	}
	/**
	 * Get the maximum no.of consecutive working day
	 * @return the maximum no. of consecutive working day
	 */
	public static int getMaxConsecutiveWorkingDay()
	{
		return maxConsecutiveWorkingDay;
	}
	/**
	 * Get the maximum no.of consecutive working day
	 * @return the maximum no. of consecutive working day
	 */
	public static void setMaxConsecutiveWorkingDay(int max)
	{
		maxConsecutiveWorkingDay=max;
	}

	/**
	 * Get the Essential Shift List
	 * @return the Essential Shift List
	 */
	public static String[] getEssentialShiftList() 
	{
		return essentialShiftList;
	}	
	public static void setShiftInfoList(Map<String, Shift> shiftInfoList) {
		Shift shiftInfo;
		ArrayList<String> essentialShift=new ArrayList<String>();
		shiftHourCount=new TreeMap<String, Float>();
		shiftCssClassName=new TreeMap<String, String>();
		shiftTimeSlot=new TreeMap<String, String>();
		for (String shiftType : shiftInfoList.keySet()) {
			shiftInfo=shiftInfoList.get(shiftType);
			if (shiftInfo.isEssential()) {
				essentialShift.add(shiftType);
			}
			RosterRule.shiftHourCount.put(shiftType,shiftInfo.getShiftDuration());
			RosterRule.shiftCssClassName.put(shiftType, shiftInfo.getCssClassName());
			RosterRule.shiftTimeSlot.put(shiftType, shiftInfo.getTimeSlot());
		}
		RosterRule.essentialShiftList=essentialShift.toArray(new String[0]);
	}
	public static Map<String, Float> getShiftHourCount() {
		return shiftHourCount;
	}
	public static Map<String, String> getShiftCssClassName() {
		return shiftCssClassName;
	}
	public static Map<String, String> getShiftTimeSlot() {
		return shiftTimeSlot;
	}
	public static void main(String[] args) {
		System.out.println(RosterRule.getMaxConsecutiveWorkingDay());
		System.out.println(RosterRule.getEssentialShiftList()[0]);
	}
}