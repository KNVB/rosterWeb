package com;

import util.DataStore;

public class Testing {

	public static void main(String[] args) throws Exception 
	{
		DataStore dataStore=Utility.getDataStore();
		dataStore.test();
		dataStore.close();
		System.out.println("Done");
	}

}
