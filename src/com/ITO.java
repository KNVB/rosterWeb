package com;

import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.Hashtable;

import util.DataStore;

/**
 * @author SITO3 created on 11-7-2018 09:32:32
 * @version 1.0
 */
public class ITO {

	
	private String itoId;
	private String itoName;
	private String postName;
	
	private DataStore dataStore;
	private float workingHourPerDay;
	private GregorianCalendar joinDate;
	private GregorianCalendar leaveDate;

	private ArrayList<String> availableShiftList;
	private ArrayList<String> blackListedShiftPatternList;

	
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
		Hashtable<String,ITO> result=dataStore.getITOList(year,month);
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
	public ArrayList<String> getAvailableShiftList()
	{ 
		return this.availableShiftList;
	}
	public void setAvailableShiftList(ArrayList<String> availableShift)
	{
		this.availableShiftList=availableShift;
	
	}
	public float getWorkingHourPerDay() {
		return workingHourPerDay;
	}

	public void setWorkingHourPerDay(float workingHourPerDay) {
		this.workingHourPerDay = workingHourPerDay;
	}
	public ArrayList<String> getBlackListedShiftPatternList() {
		return blackListedShiftPatternList;
	}

	public void setBlackListedShiftPatternList(ArrayList<String> blackListedShiftPattern) {
		this.blackListedShiftPatternList = blackListedShiftPattern;
	}
}