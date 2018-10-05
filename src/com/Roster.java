package com;
import java.util.Hashtable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import util.DataStore;

public class Roster 
{
	private DataStore dataStore;
	private static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	
	public Roster()
	{
		
	}
	public Hashtable<String, ITORoster> getRoster(int year, int month, String[] itoIdList) throws Exception
	{
		logger.info("Roster.getRoster("+year+","+ month+") is called");
		dataStore=Utility.getDataStore();
		Hashtable<String,ITORoster>iTORosterList=dataStore.getRoster(year, month, itoIdList);
		dataStore.close();
		return iTORosterList;
	}
}
