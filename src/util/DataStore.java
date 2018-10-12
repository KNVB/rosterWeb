package util;
import com.ITO;
import com.ITORoster;
import com.Roster;
import com.rosterStatistic.ITOYearlyStatistic;

import java.util.ArrayList;
import java.util.Hashtable;



/**
 * It is an interface for retrieving/saving all data.
 * @author SITO3
 * created on 11-7-2018 09:32:32
 * @version 1.0
 * 
 */
public interface DataStore {

	public void saveITOInfo();
	public void updateITOInfo();
	/**
	 * Get all ITO data for the specified month and year
	 * @param year
	 * @param month
	 * @return List of ITO object
	 */
	public Hashtable<String,ITO>getITOList(int year,int month);
	/**
	 * Get the roster data for the specified ITO Ids,month and year
	 * @param year
	 * @param month
	 * @param itoIdList
	 * @return roster data
	 */
	public Hashtable<String,ITORoster> getITORosterList(int year,int month,String[] itoIdList);
	/**
	 * Get the Preferred Shift List for the specified ITO Ids,year and month
	 * @param year
	 * @param month
	 * @param itoIdList
	 * @return Preferred Shift List
	 */
	public Hashtable<String, Hashtable<Integer, String>> getPreferredShiftList(int year, int month, String[] itoIdList);
	/**
	 * Reading roster rules from data store
	 * @return roster rules
	 */
	public Hashtable<String,ArrayList<String>> getRosterRule();
	/**
	 * Get yearly roster statistic for the specified year and month
	 * @param year
	 * @param month
	 * @return result
	 */
	public Hashtable<String,ITOYearlyStatistic>getYearlyRosterStatistic(int year,int month);
	/**
	 * Update roster data to data store
	 * @param rosterYear
	 * @param rosterMonth
	 * @param roster
	 * @return boolean
	 */
	public boolean updateRoster(int rosterYear, int rosterMonth, Roster roster);
	/**
	 * Close the DataStore
	 * @throws Exception
	 */
	public void close()throws Exception;
	

}