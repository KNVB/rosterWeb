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
	/**
	 * It stores the maximum no. of consecutive working day
	 */
	private static int maxConsecutiveWorkingDay;
	private static final Logger logger = LogManager.getLogger("RosterRule");
	private static Shift[]shiftInfoList;

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

	public static void setShiftInfoList(Shift[] shiftInfoList) {
		RosterRule.shiftInfoList=shiftInfoList;
	}	
	public static Shift[] getShiftInfoList() {
		return shiftInfoList;
	}	
}