package com.rosterWeb.util;

import java.util.TreeMap;
import com.rosterWeb.ITO;
import com.rosterWeb.ITORoster;

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
	public TreeMap<String,ITORoster> getITORosterList(int year,int month,String[] itoIdList);
	/**
	 * Close the DataStore
	 * @throws Exception if a data store access error occurs
	 */
	public void close()throws Exception;
}
