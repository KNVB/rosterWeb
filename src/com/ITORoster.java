package com;
import java.util.Hashtable;
import java.util.ArrayList;

public class ITORoster 
{
	private Hashtable<Integer,String> shiftList;
	private Hashtable<Integer,String> preferredShiftList;
	private ArrayList<Shift> previousMonthShiftList;

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
	public Hashtable<Integer,String> getPreferredShiftList() {
		return preferredShiftList;
	}
	/**
	 * Set Preferred shift list
	 * @param preferedShiftList Preferred shift list
	 */
	public void setPreferredShiftList(Hashtable<Integer,String> preferedShiftList) {
		this.preferredShiftList = preferedShiftList;
	}
	/**
	 * Get Shift list
	 * @return Shift list
	 */
	public Hashtable<Integer,String> getShiftList() {
		return shiftList;
	}
	/**
	 * Set Shift list
	 * @param shiftList Shift list
	 */
	public void setShiftList(Hashtable<Integer,String> shiftList) {
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
}
