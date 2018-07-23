package com;

import java.util.ArrayList;

public class ITORoster 
{
	private ArrayList<Shift> shiftList;
	private float lastMonthBalance;
	
	public ArrayList<Shift> getShiftList() {
		return shiftList;
	}
	public float getLastMonthBalance() {
		return lastMonthBalance;
	}

	public void setShiftList(ArrayList<Shift> shiftList) {
		this.shiftList = shiftList;
	}
	public void setLastMonthBalance(float lastMonthBalance) {
		this.lastMonthBalance = lastMonthBalance;
	}
}
