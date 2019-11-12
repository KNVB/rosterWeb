package com.rosterWeb;

import java.util.TreeMap;
import com.rosterWeb.util.DataStore;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Roster {
	/**
	 * DataStore object for reading/writing data from/to data store
	 */
	private DataStore dataStore;
	private static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	public Roster() {
		// TODO Auto-generated constructor stub
	}
	public TreeMap<String,ITORoster>getRosterTable(int year,int month,String[] itoIdList) throws Exception
	{
		logger.info("Roster.getRosterTable("+year+","+ month+") is called");
		dataStore=Utility.getDataStore();
		TreeMap<String,ITORoster> result=dataStore.getITORosterList(year, month, itoIdList);
		dataStore.close();
		return result;
	}
}
