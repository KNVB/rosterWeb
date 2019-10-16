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
	
	/**
	 * It stores the list of active Shift object
	 */
	private static Shift activeShiftList[];
	/**
	 * It stores the shift to hour count mapping
	 */
	private static Map<String,Float>shiftHourCount=new TreeMap<String,Float>(String.CASE_INSENSITIVE_ORDER);
	
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
		String []temp;
		String tempString;
		String escapChar=String.valueOf((char)27);
		ArrayList <String>tempShiftList=new ArrayList<String>(); 
		DataStore dataStore=Utility.getDataStore();
		
		Map<String,ArrayList<String>>rosterRule=dataStore.getRosterRule();
		dataStore.close();
		dataStore=null;
		
		tempString=rosterRule.get("ConsecutiveWorkingDay").get(0);
		temp=tempString.split(escapChar);
		maxConsecutiveWorkingDay=Integer.valueOf(temp[1]);
		
		Shift shift=new Shift();
		activeShiftList=shift.getActiveShiftList();
		shiftHourCount.clear();
		activeShiftList.forEach((tempShift) -> {
			shiftHourCount.put(tempShift.getShiftType(), tempShift.getShiftLength());
			if (tempShift.isEssential()) {
				tempShiftList.add(tempShift.getShiftType());
			}
		});
		essentialShiftList=tempShiftList.toArray(new String[0]);
	}
	/**
	 * Get the list of active Shift object
	 * @return the list of active Shift object
	 */
	public static ArrayList <Shift>getActiveShiftList()
	{
		return activeShiftList;
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
	 * Get the shift to hour count mapping
	 * @return the shift to hour count mapping
	 */
	public static Map<String, Float> getShiftHourCount() 
	{
		return shiftHourCount;
	}
	/**
	 * Get the Essential Shift List
	 * @return the Essential Shift List
	 */
	public static String[] getEssentialShiftList() 
	{
		return essentialShiftList;
	}
}
