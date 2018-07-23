package com;

import java.io.InputStream;
import java.util.PropertyResourceBundle;

import util.DataStore;

public class Utility 
{
	private static Utility instance;
	private static String configFile = "META-INF/config.properties";
	private static PropertyResourceBundle bundle ; ;
	// Singleton initialiser
    static 
    {
        try 
        {
			instance = new Utility(configFile);
		} 
        catch (Exception e) 
        {
			// TODO Auto-generated catch block
        	throw new ExceptionInInitializerError(e);
		}
    }
    /**
     * Constructor
     *
     * @param fileName Configuration file name.
     * @throws Exception 
     */
    private Utility(String fileName) throws Exception {
        init(fileName);
    }
    /**
     * Initialize the class.
     *
     * @param fileName Configuration file name.
     * @throws Exception 
     */
    private void init(String fileName) throws Exception 
    {
    	ClassLoader loader = Thread.currentThread().getContextClassLoader();
		InputStream resourceStream = loader.getResourceAsStream(fileName);
		if (resourceStream==null)
			throw new Exception("config.properties file not found");
		else
		{
			bundle=new PropertyResourceBundle(resourceStream);
		}
    }
	/**
     * Singleton access method.
     *
     * @return Singleton
     */
    public static Utility getInstance() {
        return instance;
    }
    public static DataStore getDataStore() throws InstantiationException, IllegalAccessException, ClassNotFoundException
    {
    	DataStore dataStore= (DataStore)Class.forName(bundle.getString("DataStoreImplementationClassName")).newInstance();
    	return dataStore;
    }
    public static String getParameterValue(String parameterName)
    {
    	return bundle.getString(parameterName);
    }
}
