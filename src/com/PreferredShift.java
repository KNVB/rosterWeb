package com;

import java.util.Hashtable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import util.DataStore;

public class PreferredShift 
{
	private DataStore dataStore;
	private static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	public Hashtable<String,Hashtable<Integer,String>>getPreferredShiftList(int year, int month, String[] itoIdList) throws Exception
	{
		logger.info("PreferredShift.getPreferredShiftList("+year+","+ month+") is called");
		dataStore=Utility.getDataStore();
		Hashtable<String,Hashtable<Integer,String>>preferredShiftList=dataStore.getPreferredShiftList(year, month, itoIdList);
		dataStore.close();
		return preferredShiftList;
	}
}
