package com;
import java.util.Hashtable;
public class RosterData 
{
	private int year,month;
	private Hashtable <String , Hashtable<String,Hashtable<String,String>>> shiftList=new Hashtable();
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public int getMonth() {
		return month;
	}
	public void setMonth(int month) {
		this.month = month;
	}
	public Hashtable<String, Hashtable<String, Hashtable<String, String>>> getShiftList() {
		return shiftList;
	}
	public void setShiftList(
			Hashtable<String, Hashtable<String, Hashtable<String, String>>> shiftList) {
		this.shiftList = shiftList;
	}	
}
