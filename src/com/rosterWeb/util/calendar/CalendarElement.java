package com.rosterWeb.util.calendar;
/**
 * 
 * 它表示月曆中每一天的屬性<br> 	
 * It represents the attributes of each day in the monthly calendar.<br> 
 * 
 * 本程式參考自Sean Lin (林洵賢)先生的農曆月曆與世界時間DHTML程式(AD1900至AD2100)<br>
 * http://sean.o4u.com/2008/04/dhtml.html<br><br>
 *
 * The program is inspired by Sean Lin DHTML web page:<br>
 * http://sean.o4u.com/2008/04/dhtml.html
 *
 * @author Roy Tsang
 */
public class CalendarElement {
	/**
	 *  當天是否為公眾假期<br>
	 * is public holiday of the specified date?
	 */
	private boolean publicHoliday=false;
	private boolean today=false;
	private int dateOfMonth=-1;
	private String dayOfWeek="";
	/**
	 * 當日的節//假日資訊
	 * The festival/holiday information the specified date
	 */
	private String festivalInfo="";
	/**
	 * 傳回當天是否為公眾假期<br>
	 * It check if public holiday of the specified date.
	 * @return 當天是否為公眾假期<br>
	 * is public holiday of the specified date?
	 */
	public boolean isPublicHoliday() {
		return publicHoliday;
	}
	protected void setPublicHoliday(boolean publicHoliday) {
		this.publicHoliday = publicHoliday;
	}
	/**
	 * 傳回這個物件是否為今天<br>
	 * It check if today of the given CalendarElement object.
	 * @return 當天是否為公眾假期<br>
	 * is public holiday of the specified date?
	 */
	public boolean isToday() {
		return today;
	}
	protected void setToday(boolean today) {
		this.today = today;
	}
	/**
	 * 傳回當天西曆日子<br>
	 * It returns the date of month of the specified date
	 * @return 當天西曆日子<br>
	 * The date of month of the specified date
	 */
	public int getDateOfMonth() {
		return dateOfMonth;
	}
	protected void setDateOfMonth(int dateOfMonth) {
		this.dateOfMonth = dateOfMonth;
	}
	/**
	 * 傳回當天是星期幾
	 * It returns the day-of-week of the given date
	 * @return the day-of-week of the given date
	 */
	public String getDayOfWeek() {
		return dayOfWeek;
	}
	protected void setDayOfWeek(String dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}
	/**
	 * 傳回當日的節日/假期資訊<br>
	 * It returns the festival/holiday information the specified date
	 * @return 當日的節日/假期資訊<br>
	 * The festival/holiday information the specified date.
	 */
	public String getFestivalInfo() {
		return festivalInfo;
	}
	protected void setFestivalInfo(String festivalInfo) {
		this.festivalInfo = festivalInfo;
	}	
}
