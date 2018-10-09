package com;
import com.rosterStatistic.ITOYearlyStatistic;

import java.util.ArrayList;
import java.util.Hashtable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import util.DataStore;
import util.ExcelExporter;

public class Roster 
{
	private DataStore dataStore;
	private int rosterYear,rosterMonth;
	private ArrayList<String> vacantShiftData;
	private Hashtable<String,ITORoster> iTORosterList;
	private Hashtable<String,Hashtable<Integer,String>> iTOPreferredShiftList;
	
	private static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	
	public Roster()
	{
		
	}
	/**
	 * Export roster data to an excel file.
	 */
	public void exportToExcel(String inputFilePath,String outputFilePath)
	{
		logger.info("Roster.exportToExcel("+this.rosterYear+","+ this.rosterMonth+") is called");
		try {
			
			ITO ito=new ITO();
			Hashtable<String,ITO> itoList=ito.getITOList(this.rosterYear, this.rosterMonth);
	        ExcelExporter excelExporter=new ExcelExporter(this.rosterYear, this.rosterMonth);
	        excelExporter.setSampleExcelFilePath(inputFilePath);
	        excelExporter.setTempOutputExcelFilePath(outputFilePath);
	        excelExporter.setITOList(itoList);
	        excelExporter.setITORosterList(this.iTORosterList);
	        excelExporter.setVacantShiftData(this.vacantShiftData);
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
	public Hashtable<String, ITORoster> getRoster(int year, int month, String[] itoIdList) throws Exception
	{
		logger.info("Roster.getRoster("+year+","+ month+") is called");
		dataStore=Utility.getDataStore();
		Hashtable<String,ITORoster>iTORosterList=dataStore.getRoster(year, month, itoIdList);
		dataStore.close();
		return iTORosterList;
	}
	public Hashtable<String,ITOYearlyStatistic> getYearlyStatistic(int year,int month)throws Exception
	{
		Hashtable<String,ITOYearlyStatistic> result;
		dataStore=Utility.getDataStore();
		result=dataStore.getYearlyRosterStatistic(year,month);
		dataStore.close();
		return result;
	}
	/**
	 * It update roster data by DataStore object
	 * @throws Exception
	 */
	public boolean update() throws Exception
	{
		boolean result;
		dataStore=Utility.getDataStore();
		result=dataStore.updateRoster(this.rosterYear, this.rosterMonth,this) ;
		dataStore.close();
		dataStore=null;
		if (result)
			logger.info("Roster is updated successfully.");
		else
			logger.info("Roster updated failure.");
		return result;
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
	public Hashtable<String,Hashtable<Integer,String>> getITOPreferredShiftList()
	{
		return iTOPreferredShiftList;
	}
	public void setITOPreferredShiftList(Hashtable<String,Hashtable<Integer,String>> iTOPreferredShiftList)
	{
		this.iTOPreferredShiftList=iTOPreferredShiftList;
	}
	/**
	 * It returns vacant shift row.
	 * @return vacancyShiftData
	 */
	public ArrayList<String> getVacantShiftData() {
		return vacantShiftData;
	}
	/**
	 * It set vacant shift row
	 * @param vacancyShiftData
	 */
	public void setVacantShiftData(ArrayList<String> vacancyShiftData) {
		this.vacantShiftData = vacancyShiftData;
	}
}
