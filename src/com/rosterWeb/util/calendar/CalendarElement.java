package com.rosterWeb.util.calendar;

public class CalendarElement {
	private boolean publicHoliday=false;
	private boolean today=false;
	private int dateOfMonth=-1;
	private String dayOfWeek="";
	private String festivalInfo="";
	public boolean isPublicHoliday() {
		return publicHoliday;
	}
	public void setPublicHoliday(boolean publicHoliday) {
		this.publicHoliday = publicHoliday;
	}
	public boolean isToday() {
		return today;
	}
	public void setToday(boolean today) {
		this.today = today;
	}
	public int getDateOfMonth() {
		return dateOfMonth;
	}
	public void setDateOfMonth(int dateOfMonth) {
		this.dateOfMonth = dateOfMonth;
	}
	public String getDayOfWeek() {
		return dayOfWeek;
	}
	public void setDayOfWeek(String dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}
	public String getFestivalInfo() {
		return festivalInfo;
	}
	public void setFestivalInfo(String festivalInfo) {
		this.festivalInfo = festivalInfo;
	}	
}
