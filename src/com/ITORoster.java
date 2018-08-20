package com;

import java.util.ArrayList;

public class ITORoster 
{
	private ArrayList<Shift> shiftList;
	private ArrayList<Shift> preferredShiftList;
	private ArrayList<Shift> previousMonthShiftList;
	
	
	/**
	 * The name of the specified ITO.
	 */
	private String itoName;
	/**
	 * The post name of the specified ITO
	 */
	private String postName;
	/**
	 * The total no. of working hour per day for the specified ITO.
	 */
	private float workingHourPerDay;
	/**
	 * For retrieving data from database variable balance is referred to last month balance.
	 * For update data to database variable balance is referred to this month balance
	 */	
	private float balance;
	/**
	 * Get Previous Month Shift list(Not whole month shift list, the size of the shift list depends on RosterRule.getMaxConsecutiveWorkingDay() value).
	 * @return the previous month shift list
	 */
	public ArrayList<Shift> getPreviousMonthShiftList() {
		return previousMonthShiftList;
	}
	/**
	 * Set Previous Month Shift list(Not whole month shift list, the length of the shift list depends on RosterRule.getMaxConsecutiveWorkingDay() value).
	 * @param previousMonthShiftList Previous Month Shift list
	 */
	public void setPreviousMonthShiftList(ArrayList<Shift> previousMonthShiftList) {
		this.previousMonthShiftList = previousMonthShiftList;
	}
	/**
	 * Get Preferred shift list
	 * @return Preferred shift list
	 */
	public ArrayList<Shift> getPreferredShiftList() {
		return preferredShiftList;
	}
	/**
	 * Set Preferred shift list
	 * @param preferedShiftList Preferred shift list
	 */
	public void setPreferredShiftList(ArrayList<Shift> preferedShiftList) {
		this.preferredShiftList = preferedShiftList;
	}
	/**
	 * Get Shift list
	 * @return Shift list
	 */
	public ArrayList<Shift> getShiftList() {
		return shiftList;
	}
	/**
	 * Set Shift list
	 * @param shiftList Shift list
	 */
	public void setShiftList(ArrayList<Shift> shiftList) {
		this.shiftList = shiftList;
	}
	/**
	 * Get Balance value(For retrieving data from database variable balance is referred to last month balance.<br>For update data to database variable balance is referred to this month balance)
	 * @return balance value  
	 */
	public float getBalance() {
		return balance;
	}
	/**
	 * Set balance value(For retrieving data from database variable balance is referred to last month balance.<br>For update data to database variable balance is referred to this month balance) 
	 * @param balance 
	 */
	public void setBalance(float balance) {
		this.balance = balance;
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
	 * Get the name of the specified ITO.
	 * @return the name of the specified ITO.
	 */
	public String getItoName() {
		return itoName;
	}
	/**
	 * Set the name of the specified ITO.
	 * @param itoName the name of the specified ITO.
	 */
	public void setItoName(String itoName) {
		this.itoName = itoName;
	}
}
