package com;

import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.Hashtable;

import util.DataStore;

/**
 * @author SITO3
 * @version 1.0
 * @created 11-7-2018 09:32:32
 */
public class ITO {

	
	private String itoId;
	private String itoName;
	private String postName;
	
	private DataStore dataStore;
	private float workingHourPerDay;
	private GregorianCalendar joinDate;
	private GregorianCalendar leaveDate;

	private ArrayList<String> availableShift;
	private ArrayList<String> blackListedShiftPattern;

	
	public ITO() throws InstantiationException, IllegalAccessException, ClassNotFoundException
	{
		
	}

	/**
	 * 
	 * @exception Throwable
	 */
	public void finalize()
	  throws Throwable{

	}

	public void add(){

	}
	/**
	 * Get ITO Information List
	 * @param year
	 * @param month
	 * @return A list of ITO object order by post name.
	 * @throws Exception
	 */
	public Hashtable<String,ITO> getITOList(int year,int month) throws Exception
	{
		dataStore=Utility.getDataStore();
		Hashtable<String,ITO> result=dataStore.getITOInfo(year,month);
		dataStore.close();
		return result;
	}	
	public void update(){

	}
	
	public String getItoId() {
		return itoId;
	}

	public void setItoId(String itoId) {
		this.itoId = itoId;
	}

	public String getItoName() {
		return itoName;
	}

	public void setItoName(String itoName) {
		this.itoName = itoName;
	}

	public GregorianCalendar getJoinDate() {
		return joinDate;
	}

	public void setJoinDate(GregorianCalendar joinDate) {
		this.joinDate = joinDate;
	}

	public GregorianCalendar getLeaveDate() {
		return leaveDate;
	}

	public void setLeaveDate(GregorianCalendar leaveDate) {
		this.leaveDate = leaveDate;
	}

	public String getPostName() {
		return postName;
	}

	public void setPostName(String postName) {
		this.postName = postName;
	}
	public ArrayList<String> getAvailableShift()
	{ 
		return this.availableShift;
	}
	public void setAvailableShift(ArrayList<String> availableShift)
	{
		this.availableShift=availableShift;
	
	}
	public float getWorkingHourPerDay() {
		return workingHourPerDay;
	}

	public void setWorkingHourPerDay(float workingHourPerDay) {
		this.workingHourPerDay = workingHourPerDay;
	}
	public ArrayList<String> getBlackListedShiftPattern() {
		return blackListedShiftPattern;
	}

	public void setBlackListedShiftPattern(ArrayList<String> blackListedShiftPattern) {
		this.blackListedShiftPattern = blackListedShiftPattern;
	}
}