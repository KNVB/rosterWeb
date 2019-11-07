package com_old.rosterWeb.rosterStatistic;

import java.util.ArrayList;

public class ITOYearlyStatistic 
{
	private String itoPostName=new String();
	private ArrayList<MonthlyStatistic> iTOMonthlyStatisticList=new  ArrayList<MonthlyStatistic>();
	public String getItoPostName() {
		return itoPostName;
	}
	public void setItoPostName(String itoPostName) {
		this.itoPostName = itoPostName;
	}
	public ArrayList<MonthlyStatistic> getITOMonthlyStatisticList() {
		return iTOMonthlyStatisticList;
	}
	public void addITOMonthlyStatistic(MonthlyStatistic monthlyStatistic) {
		this.iTOMonthlyStatisticList.add(monthlyStatistic);
	}	
}
