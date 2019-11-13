package com.rosterWeb.util;
import com.rosterWeb.ITO;
import com.rosterWeb.ITORoster;
import com.rosterWeb.RosterRule;

import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;
/**
 * It is an interface for retrieving/saving all data.
 * @author SITO3
 * created on 11-12-2019 14:35
 * @version 1.0
 * 
 */
public interface DataStore {

	/**
	 * Get a list of valid ITO Object in the specified year and month value.
	 * @param year the specified year
	 * @param month the specified month
	 * @return List of ITO object
	 */
	public TreeMap<String, ITO> getITOList(int year, int month);
	/**
	 * Get the roster data for the specified ITO Ids,month and year
	 * @param year the specified year
	 * @param month the specified month
	 * @param itoIdList ito id list
	 * @return roster data
	 */
	public ITORoster[] getITORosterList(int year,int month,String[] itoIdList);
	/**
	 * Reading roster rules from data store
	 * @return roster rules
	 */
	public void initRosterRule();
	
	/**
	 * Reading shift information from data store
	 * @return shift information
	 */
	public void getShiftInfo();

	/**
	 * Close the DataStore
	 * @throws Exception if a data store access error occurs
	 */
	public void close()throws Exception;
}
