package com;

import java.util.Hashtable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import util.DataStore;
import util.ExcelExporter;


/**
 * It denote a roster.
 * @author SITO3 created on 11-7-2018 09:32:32
 * @version 1.0
 */
public class Roster {
	private DataStore dataStore;
	private int rosterYear,rosterMonth;
	private static final Logger logger = LogManager.getLogger("Roster");
	private Hashtable<String,ITORoster> iTORosterList;
	public Roster()
	{
		
	}
	/**
	 * It load roster data from DataStore object
	 * @throws Exception
	 */
	public void load() throws Exception
	{
		logger.info("Roster.load("+this.rosterYear+","+ this.rosterMonth+") is called");
		dataStore=Utility.getDataStore();
		iTORosterList=dataStore.getRoster(this.rosterYear, this.rosterMonth) ;
		dataStore.close();
		dataStore=null;		 
	}
	/**
	 * It returns roster year.
	 * @return roster year
	 */
	public int getRosterYear() {
		return rosterYear;
	}
	/**
	 * It returns roster month.
	 * @return roster month
	 */
	public int getRosterMonth() {
		return rosterMonth;
	}
	/**
	 * It set roster year.
	 * @param rosterYear The roster year
	 */
	public void setRosterYear(int rosterYear) {
		this.rosterYear = rosterYear;
	}
	/**
	 * It set roster month.
	 * @param rosterMonth The roster month
	 */
	public void setRosterMonth(int rosterMonth) {
		this.rosterMonth = rosterMonth;
	}

	/**
	 * It returns ITORoster object for the specified roster year and month.
	 * @return ITORoster 
	 */
	public Hashtable<String,ITORoster>getITORosterList()
	{
		return iTORosterList;
	}
	/**
	 * It sets ITORoster object for the specified roster year and month.
	 * @param iTORosterList List of ITORoster object 
	 */
	public void setITORosterList(Hashtable<String,ITORoster>iTORosterList)
	{
		this.iTORosterList=iTORosterList;
	}

	/**
	 * Export roster data to an excel file.
	 */
	public void exportToExcel()
	{
		logger.info("Roster.exportToExcel("+this.rosterYear+","+ this.rosterMonth+") is called");
		try {
			
			ITO ito=new ITO();
			String inputFilePath=Utility.getParameterValue("inputExcelFilePath");
			String outputFilePath=Utility.getParameterValue("outputExcelFilePath");
			Hashtable<String,ITO> itoList=ito.getITOList(this.rosterYear, this.rosterMonth);
	        ExcelExporter excelExporter=new ExcelExporter(this.rosterYear, this.rosterMonth);
	        excelExporter.setSampleExcelFilePath(inputFilePath);
	        excelExporter.setTempOutputExcelFilePath(outputFilePath);
	        excelExporter.setITOList(itoList);
	        excelExporter.setITORosterList(this.iTORosterList);
	        excelExporter.export();
		} catch (InstantiationException e) {
			
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			
			e.printStackTrace();
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		
	}
	/**
	 * It update roster data by DataStore object
	 * @throws Exception
	 */
	public boolean update() throws Exception
	{
		boolean result;
		dataStore=Utility.getDataStore();
		result=dataStore.updateRoster(this.rosterYear, this.rosterMonth,this.iTORosterList) ;
		dataStore.close();
		dataStore=null;
		if (result)
			logger.info("Roster is updated successfully.");
		else
			logger.info("Roster updated failure.");
		return result;
	}

}