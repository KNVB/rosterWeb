package com.rosterWeb;

import java.io.InputStream;
//import java.util.Arrays;
//import java.util.Hashtable;
import java.util.PropertyResourceBundle;

import com.rosterWeb.util.DataStore;

public class Utility 
{
	private static Utility instance;
	private static String configFile = "META-INF/config.properties";
	private static PropertyResourceBundle bundle ;
	// Singleton initialiser
    static 
    {
        try 
        {
			instance = new Utility(configFile);
		} 
        catch (Exception e) 
        {
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
     * @return Utility Object
     */
    public static Utility getInstance() {
        return instance;
    }
    /**
     * Get DataStore implementation class.
     * @return DataStore object
     * @throws InstantiationException the exception that was raised while instantiating the class
     * @throws IllegalAccessException the exception that was raised while reflecting the class
     * @throws ClassNotFoundException Class not found
     */
    public static DataStore getDataStore() throws InstantiationException, IllegalAccessException, ClassNotFoundException
    {
    	DataStore dataStore= (DataStore)Class.forName(bundle.getString("DataStoreImplementationClassName")).newInstance();
    	return dataStore;
    }
    /**
     * Get Parameter value from the configuration file.
     * @param parameterName parameter name/key
     * @return value
     */
    public static String getParameterValue(String parameterName)
    {
    	return bundle.getString(parameterName);
    }
  }
