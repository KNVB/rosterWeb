package com.rosterWeb;

import java.util.ArrayList;
import java.time.LocalDate;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.rosterWeb.util.DataStore;
import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * It denote a ITO record
 * @author SITO3 created on 11-7-2018 09:32:32
 * @version 1.0
 */
public class ITO {

	/**
	 * The ITO Id of the specified ITO.
	 */
	private String itoId=new String();
	/**
	 * The name of the specified ITO.
	 */
	private String itoName=new String();
	/**
	 * The post name of the specified ITO
	 */
	private String postName=new String();
	/**
	 * DataStore object for reading/writing data from/to data store
	 */
	private DataStore dataStore;
	/**
	 * The total no. of working hour per day for the specified ITO.
	 */
	private float workingHourPerDay=0.0f;
	/**
	 * The join date of the specified ITO.
	 */
	private LocalDate joinDate;
	/**
	 * The leave date of the specified ITO.
	 */
	private LocalDate leaveDate;
	/**
	 * The available shift list of the specified ITO.	
	 */
	private ArrayList<String> availableShiftList;
	/**
	 * The black listed shift pattern list of the specified ITO.	
	 */
	private ArrayList<String> blackListedShiftPatternList;
	private static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	/**
	 * Instantiate an ITO object
	 */
	public ITO()
	{
		
	}
	
	/**
	 * Get all ITO object from the data store
	 * @return A list of ITO object order by post name.
	 * @throws Exception The exception that was raised when retrieving ito data from data store
	 */
	@JsonBackReference
	public Map<String,ITO>getAllITOInfo()throws Exception
	{
		logger.info("ITO.getAllITOInfo() is called");
		dataStore=Utility.getDataStore();
		Map<String,ITO> result=dataStore.getAllITOInfo();
		dataStore.close();
		return result;
	}	
	/**
	 * Get a list of valid ITO Object in the specified year and month value. 
	 * @param year year
	 * @param month month
	 * @return A list of ITO object order by post name.
	 * @throws Exception The exception that was raised when retrieving ito data from data store
	 */
	public Map<String,ITO> getITOList(int year,int month) throws Exception
	{
		logger.info("ITO.getITOList("+year+","+ month+") is called");
		dataStore=Utility.getDataStore();
		Map<String,ITO> result=dataStore.getITOList(year,month);
		dataStore.close();
		return result;
	}
	/**
	 * Add/Update an ITO record to data store
	 * @throws Exception The exception that was raised when updating ito record to data store
	 */
	public void update() throws Exception
	{
		logger.info("ITO.update() is called");
		dataStore=Utility.getDataStore();
		dataStore.updateITOInfo(this);
		dataStore.close();
	}
	/**
	 * Get ITO Id of the specified ITO.
	 * @return ITO Id
	 */
	public String getITOId() {
		return itoId;
	}
	/**
	 * Set the ITO Id of the specified ITO.
	 * @param itoId the ITO Id of the specified ITO.
	 */
	public void setITOId(String itoId) {
		this.itoId = itoId;
	}
	/**
	 * Get the name of the specified ITO.
	 * @return the name of the specified ITO.
	 */
	public String getITOName() {
		return itoName;
	}
	/**
	 * Set the name of the specified ITO.
	 * @param itoName the name of the specified ITO.
	 */
	public void setITOName(String itoName) {
		this.itoName = itoName;
	}
	/**
	 * Get the join date of the specified ITO.
	 * @return the join date of the specified ITO.
	 */
	public LocalDate getJoinDate() {
		return joinDate;
	}
	/**
	 * Set the join date of the specified ITO.
	 * @param joinDate the join date of the specified ITO.
	 */
	public void setJoinDate(LocalDate joinDate) {
		this.joinDate = joinDate;
	}
	/**
	 * Get the leave date of the specified ITO.
	 * @return the leave date of the specified ITO.
	 */
	public LocalDate getLeaveDate() {
		return leaveDate;
	}
	/**
	 * Set the leave date of the specified ITO.
	 * @param leaveDate the leave date of the specified ITO.
	 */
	public void setLeaveDate(LocalDate leaveDate) {
		this.leaveDate = leaveDate;
	}
	/**
	 * Get the post name of the specified ITO.
	 * @return the post name of the specified ITO.
	 */
	public String getPostName() {
		return postName;
	}
	/**
	 * Set the post name of the specified ITO.
	 * @param postName the post name of the specified ITO.
	 */
	public void setPostName(String postName) {
		this.postName = postName;
	}
	/**
	 * Get the available shift list of the specified ITO.	
	 * @return The available shift list of the specified ITO.	
	 */
	public ArrayList<String> getAvailableShiftList()
	{ 
		return this.availableShiftList;
	}
	/**
	 * Set the available shift list of the specified ITO.	
	 * @param availableShiftList the available shift list of the specified ITO
	 */
	public void setAvailableShiftList(ArrayList<String> availableShiftList)
	{
		this.availableShiftList= availableShiftList;
	}
	/**
	 * Get the total no. of working hour per day for the specified ITO.
	 * @return the no. of working hour per day for the specified ITO.
	 */
	public float getWorkingHourPerDay() {
		return workingHourPerDay;
	}
	/**
	 * Set the total no. of working hour per day for the specified ITO.
	 * @param workingHourPerDay the no. of working hour per day for the specified ITO.
	 */
	public void setWorkingHourPerDay(float workingHourPerDay) {
		this.workingHourPerDay = workingHourPerDay;
	}
	/**
	 * Get the black listed shift pattern list of the specified ITO.	
	 * @return The black listed shift pattern list of the specified ITO.	
	 */
	public ArrayList<String> getBlackListedShiftPatternList() {
		return blackListedShiftPatternList;
	}
	/**
	 * Set the black listed shift pattern list of the specified ITO.	
	 * @param blackListedShiftPattern the black listed shift pattern list of the specified ITO.	
	 */
	public void setBlackListedShiftPatternList(ArrayList<String> blackListedShiftPattern) {
		this.blackListedShiftPatternList = blackListedShiftPattern;
	}
}