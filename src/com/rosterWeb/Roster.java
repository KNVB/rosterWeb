package com.rosterWeb;
import java.util.ArrayList;
import java.util.Hashtable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.rosterWeb.rosterStatistic.ITOYearlyStatistic;
import com.rosterWeb.util.DataStore;
import com.rosterWeb.util.ExcelExporter;

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
	public Roster(int year,int month)
	{
		rosterYear=year;
		rosterMonth=month;
	}
	/**
	 * Export roster data to an excel file.
	 * @param inputFilePath input file path
	 * @param outputFilePath output file path
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
	/**
	 * It return a list of preferred shift for specified ITO ids
	 * @return iTOPreferredShiftList
	 */
	public Hashtable<String,Hashtable<Integer,String>> getITOPreferredShiftList()
	{
		return iTOPreferredShiftList;
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
	 * It generates a list of ITO roster for specified ITO ids
	 * @param itoIdList ITO ids list
	 * @return iTORosterList
	 * @throws Exception the exception that was raised while get ITO roster from data store
	 */
	public Hashtable<String, ITORoster> getITORosterList(String[] itoIdList) throws Exception
	{
		logger.info("Roster.getRoster("+this.rosterYear+","+ this.rosterMonth+") is called");
		dataStore=Utility.getDataStore();
		Hashtable<String,ITORoster>iTORosterList=dataStore.getITORosterList(this.rosterYear,this.rosterMonth, itoIdList);
		dataStore.close();
		return iTORosterList;
	}
	/**
	 * It generates a list of preferred shift for specified ITO ids
	 * @param itoIdList ITO Id list
	 * @return iTOPreferredShiftList
	 * @throws Exception the exception that was raised while get ITO Preferred shift from data store
	 */
	public Hashtable<String,Hashtable<Integer,String>>getITOPreferredShiftList(String[] itoIdList) throws Exception
	{
		logger.info("PreferredShift.getPreferredShiftList("+this.rosterYear+","+ this.rosterMonth+") is called");
		dataStore=Utility.getDataStore();
		iTOPreferredShiftList=dataStore.getPreferredShiftList(this.rosterYear,this.rosterMonth, itoIdList);
		dataStore.close();
		return iTOPreferredShiftList;
	}
	/**
	 * It returns roster month.
	 * @return roster month
	 */
	public int getRosterMonth() {
		return rosterMonth;
	}
	/**
	 * It returns roster year.
	 * @return roster year
	 */
	public int getRosterYear() {
		return rosterYear;
	}
	/**
	 * It returns vacant shift row.
	 * @return vacancyShiftData
	 */
	public ArrayList<String> getVacantShiftData() {
		return vacantShiftData;
	}
	/**
	 * It generate a yearly statistic
	 * @return return the yearly statistic
	 * @throws Exception the exception that was raised while get yearly statistic from data store
	 */
	public Hashtable<String,ITOYearlyStatistic> getYearlyStatistic()throws Exception
	{
		Hashtable<String,ITOYearlyStatistic> result;
		dataStore=Utility.getDataStore();
		result=dataStore.getYearlyRosterStatistic(this.rosterYear,this.rosterMonth);
		dataStore.close();
		return result;
	}
	/**
	 * It sets a list of ITO Preferred shift for the specified roster year and month.
	 * @param iTOPreferredShiftList List of ITO Preferred shift
	 */
	public void setITOPreferredShiftList(Hashtable<String,Hashtable<Integer,String>> iTOPreferredShiftList)
	{
		this.iTOPreferredShiftList=iTOPreferredShiftList;
	}	
	/**
	 * It sets a list of ITORoster object for the specified roster year and month.
	 * @param iTORosterList List of ITORoster object 
	 */
	public void setITORosterList(Hashtable<String,ITORoster>iTORosterList)
	{
		this.iTORosterList=iTORosterList;
	}
	/**
	 * It set roster month.
	 * @param rosterMonth The roster month
	 */
	public void setRosterMonth(int rosterMonth) {
		this.rosterMonth = rosterMonth;
	}
	/**
	 * It set roster year.
	 * @param rosterYear The roster year
	 */
	public void setRosterYear(int rosterYear) {
		this.rosterYear = rosterYear;
	}	
	/**
	 * It set vacant shift row
	 * @param vacantShiftData the vacant shift row data
	 */
	public void setVacantShiftData(ArrayList<String> vacantShiftData) {
		this.vacantShiftData = vacantShiftData;
	}	
	/**
	 *  It update roster data by DataStore object
	 * @return It indicate whether update success or not
	 * @throws Exception the exception that was raised while updating roster data to data store
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
}
