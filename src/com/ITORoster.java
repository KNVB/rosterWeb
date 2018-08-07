package com;

import java.util.ArrayList;

public class ITORoster 
{
	private ArrayList<Shift> shiftList;
	private ArrayList<Shift> preferredShiftList;
	private ArrayList<Shift> previousMonthShiftList;
	
	/**
	/*
	 * For retrieving data from database variable balance is referred to last month balance.
	 * For update data to database variable balance is referred to this month balance
	 **/	
	private float balance;
	public ArrayList<Shift> getPreviousMonthShiftList() {
		return previousMonthShiftList;
	}
	public void setPreviousMonthShiftList(ArrayList<Shift> previousMonthShiftList) {
		this.previousMonthShiftList = previousMonthShiftList;
	}
	public ArrayList<Shift> getPreferredShiftList() {
		return preferredShiftList;
	}
	public void setPreferredShiftList(ArrayList<Shift> preferedShiftList) {
		this.preferredShiftList = preferedShiftList;
	}
	public ArrayList<Shift> getShiftList() {
		return shiftList;
	}
	public void setShiftList(ArrayList<Shift> shiftList) {
		this.shiftList = shiftList;
	}
	public float getBalance() {
		return balance;
	}
	public void setBalance(float balance) {
		this.balance = balance;
	}
}
