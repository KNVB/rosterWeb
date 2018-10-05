package com;

import java.util.Hashtable;

public class ITORoster 
{
	float balance;
	Hashtable<Integer,String>shiftList;
	Hashtable<Integer,String>previousMonthShiftList;
	
	String itoName,itoPostName;
	
	public float getBalance() {
		return balance;
	}
	public void setBalance(float balance) {
		this.balance = balance;
	}
	public Hashtable<Integer, String> getShiftList() {
		return shiftList;
	}
	public void setShiftList(Hashtable<Integer, String> shiftList) {
		this.shiftList = shiftList;
	}
	public String getITOName() {
		return itoName;
	}
	public void setITOName(String itoName) {
		this.itoName = itoName;
	}
	public String getITOPostName() {
		return itoPostName;
	}
	public void setITOPostName(String itoPostName) {
		this.itoPostName = itoPostName;
	}
	public Hashtable<Integer, String> getPreviousMonthShiftList() {
		return previousMonthShiftList;
	}
	public void setPreviousMonthShiftList(Hashtable<Integer, String> previousMonthShiftList) {
		this.previousMonthShiftList = previousMonthShiftList;
	}
	
}
