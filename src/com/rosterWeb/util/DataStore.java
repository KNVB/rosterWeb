package com.rosterWeb.util;
import com.rosterWeb.ITO;
import com.rosterWeb.ITORoster;
import com.rosterWeb.Roster;
import com.rosterWeb.rosterStatistic.ITOYearlyStatistic;

import java.util.ArrayList;
import java.util.Map;



/**
 * It is an interface for retrieving/saving all data.
 * @author SITO3
 * created on 11-7-2018 09:32:32
 * @version 1.0
 * 
 */
public interface DataStore {

	public Map<String,ITO>getAllITOInfo();
	public void updateITOInfo(ITO ito);
	/**
	 * Get a list of valid ITO Object in the specified year and month value.
	 * @param year the specified year
	 * @param month the specified month
	 * @return List of ITO object
	 */
	public Map<String,ITO>getITOList(int year,int month);
	/**
	 * Get the roster data for the specified ITO Ids,month and year
	 * @param year the specified year
	 * @param month the specified month
	 * @param itoIdList ito id list
	 * @return roster data
	 */
	public Map<String,ITORoster> getITORosterList(int year,int month,String[] itoIdList);
	/**
	 * Get the Preferred Shift List for the specified ITO Ids,year and month
	 * @param year the specified year
	 * @param month the specified month
	 * @param itoIdList ito id list
	 * @return Preferred Shift List
	 */
	public Map<String, Map<Integer, String>> getPreferredShiftList(int year, int month, String[] itoIdList);
	/**
	 * Reading roster rules from data store
	 * @return roster rules
	 */
	public Map<String,ArrayList<String>> getRosterRule();
	/**
	 * Get yearly roster statistic for the specified year and month
	 * @param year the specified year
	 * @param month  the specified month
	 * @return result
	 */
	public Map<String,ITOYearlyStatistic>getYearlyRosterStatistic(int year,int month);
	/**
	 * Update roster data to data store
	 * @param rosterYear the specified year
	 * @param rosterMonth the specified month
	 * @param roster the rost object
	 * @return boolean
	 */
	public boolean updateRoster(int rosterYear, int rosterMonth, Roster roster);
	/**
	 * Close the DataStore
	 * @throws Exception if a data store access error occurs
	 */
	public void close()throws Exception;
	

}