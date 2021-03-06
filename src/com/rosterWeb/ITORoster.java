package com.rosterWeb;

import java.util.Map;

public class ITORoster 
{
	/**
	 * For retrieving data from database variable balance is referred to last month balance.
	 * For update data to database variable balance is referred to this month balance
	 */	
	private float lastMonthBalance,thisMonthBalance;
	private Map<Integer,String>shiftList;
	private Map<Integer,String>previousMonthShiftList;
	
	/**
	 * The name of the specified ITO.
	 */
	private String itoName;
	/**
	 * The post name of the specified ITO
	 */
	private String itoPostName;
	/**
	 * The total no. of working hour per day for the specified ITO.
	 */
	private float workingHourPerDay;
	
	/**
	 * Get the name of the specified ITO.
	 * @return the name of the specified ITO.
	 */
	public String getITOName() {
		return itoName;
	}
	/**
	 * Get the post name of the specified ITO.
	 * @return the post name of the specified ITO.
	 */
	public String getITOPostName() {
		return itoPostName;
	}
	/**
	 * Get the total no. of working hour per day for the specified ITO.
	 * @return the no. of working hour per day for the specified ITO.
	 */
	public float getITOWorkingHourPerDay() {
		return workingHourPerDay;
	}
	/**
	 * Get Previous Month Shift list(Not whole month shift list, the size of the shift list depends on RosterRule.getMaxConsecutiveWorkingDay() value).
	 * @return the previous month shift list
	 */
	public Map<Integer, String> getPreviousMonthShiftList() {
		return previousMonthShiftList;
	}
	/**
	 * Get Shift list
	 * @return Shift list
	 */
	public Map<Integer, String> getShiftList() {
		return shiftList;
	}	
	/**
	 * Get the last month balance of the ITO
	 * @return the last month balance of the ITO
	 */
	public float getLastMonthBalance() {
		return lastMonthBalance;
	}
	/**
	 * Set the last month balance of the ITO
	 * @param lastMonthBalance the last month balance of the ITO
	 */
	public void setLastMonthBalance(float lastMonthBalance) {
		this.lastMonthBalance = lastMonthBalance;
	}
	/**
	 * Get this month balance of the ITO
	 * @return this month balance of the ITO
	 */
	public float getThisMonthBalance() {
		return thisMonthBalance;
	}
	/**
	 * Set this month balance of the ITO
	 * @param thisMonthBalance this month balance of the ITO
	 */
	public void setThisMonthBalance(float thisMonthBalance) {
		this.thisMonthBalance = thisMonthBalance;
	}
	/**
	 * Set Shift list
	 * @param shiftList Shift list
	 */
	public void setShiftList(Map<Integer, String> shiftList) {
		this.shiftList = shiftList;
	}
	
	/**
	 * Set the name of the specified ITO.
	 * @param itoName the name of the specified ITO.
	 */
	public void setITOName(String itoName) {
		this.itoName = itoName;
	}
	
	/**
	 * Set the post name of the specified ITO.
	 * @param itoPostName the post name of the specified ITO.
	 */
	public void setITOPostName(String itoPostName) {
		this.itoPostName = itoPostName;
	}
	
	/**
	 * Set Previous Month Shift list(Not whole month shift list, the length of the shift list depends on RosterRule.getMaxConsecutiveWorkingDay() value).
	 * @param previousMonthShiftList Previous Month Shift list
	 */
	public void setPreviousMonthShiftList(Map<Integer, String> previousMonthShiftList) {
		this.previousMonthShiftList = previousMonthShiftList;
	}
	
	/**
	 * Set the total no. of working hour per day for the specified ITO.
	 * @param workingHourPerDay the no. of working hour per day for the specified ITO.
	 */
	public void setITOWorkingHourPerDay(float workingHourPerDay) {
		this.workingHourPerDay = workingHourPerDay;
	}
}
