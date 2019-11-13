package com.rosterWeb;

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
	public ITORoster[]getRosterTable(int year,int month) throws Exception
	{
		logger.info("Roster.getRosterTable("+year+","+ month+") is called");
		ITO ito=new ITO();
		String[]itoIdList=ito.getITOList(year,month).keySet().toArray(new String[0]);
		dataStore=Utility.getDataStore();
		ITORoster[] result=dataStore.getITORosterList(year, month, itoIdList);
		dataStore.close();
		return result;
	}
}
