package com.rosterWeb.util.calendar;

import java.time.DayOfWeek;

public class CalendarObj {

	public DayOfWeek dayOfWeek;
	public String dayOfWeekName=new String();
	public String festivalInfo=new String();
	public boolean isPublicHoliday=false;
	public boolean isLeap=false;
	public int lunarDate,lunarMonth,lunarYear;
	public int solarDate,solarMonth,solarYear; 
	public CalendarObj() {

	}
}
