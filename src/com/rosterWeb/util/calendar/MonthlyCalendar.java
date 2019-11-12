package com.rosterWeb.util.calendar;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Stack;
import java.util.TreeMap;

public class MonthlyCalendar {
	public int month;
	public String currentMonthName="";
	public int year;
	public CalendarObj[] calendarObjList=new CalendarObj[31];
	public String[] monthNames; 
	public int noOfWorkingDay=0;
	private CalendarUtility cu=new CalendarUtility();
	private TreeMap<Integer,ArrayList<String>>holidayList=new TreeMap<Integer,ArrayList<String>>();
	private TreeMap <String,String>lunarHolidayList=new TreeMap<String,String>();
	private TreeMap <String,String>solarHolidayList=new TreeMap<String,String>();
	
	public MonthlyCalendar(int year,int month) {
		init(year,month);
		initHolidayList();
		updateCalendarObjList();
		initNoOfWorkingDay();
	}
	private void init(int year,int month) {
		lunarHolidayList.put("0101","大年初一");
		lunarHolidayList.put("0102","年初二");
		lunarHolidayList.put("0103","年初三");
		lunarHolidayList.put("0408","佛誕");
		lunarHolidayList.put("0505","端午節");
		lunarHolidayList.put("0816","中秋節翌日");
		lunarHolidayList.put("0909","重陽節");

		solarHolidayList.put("0101","新曆新年");
		solarHolidayList.put("0501","勞動節");
		solarHolidayList.put("0701","香港特別行政區成立紀念日");
		solarHolidayList.put("1001","國慶日");
		solarHolidayList.put("1225","聖誕節");
		solarHolidayList.put("1226","聖誕節翌日");
       
		CalendarObj calendarObj;
		LocalDateTime sDObj= LocalDateTime.of(year,month,1,0,0,0);
		this.noOfWorkingDay=cu.getMonthLength(year,month);
		this.currentMonthName=cu.monthNames.get(sDObj.getMonth())+ " " +year;
		this.month=month;
		this.year=year;
		
		for (int i=1;i<=noOfWorkingDay;i++) {
			calendarObj=cu.getCalendarObj(LocalDateTime.of(year,month,i,0,0,0));
			calendarObjList[i-1]=calendarObj;	
		}	
		this.monthNames = new String[] {"January", "February", "March", "April", "May", "June", "July", "August",
                "September", "October", "November", "December"};
	}
	private void initNoOfWorkingDay() {
		CalendarObj calendarObj;
		for (int i=0;i<31;i++) {
			calendarObj=calendarObjList[i];
			if (calendarObj==null) {
				break;
			} else {
				if ((calendarObj.isPublicHoliday) ||
					(calendarObj.dayOfWeek.equals(DayOfWeek.SATURDAY))|| 
					(calendarObj.dayOfWeek.equals(DayOfWeek.SUNDAY))) {
					this.noOfWorkingDay--;
				}
			}
		}
	}
	private void initHolidayList() {
		CalendarObj calendarObj;
		String lunarDatePattern=new String(),solarDatePattern=new String();
		for (int i=1;i<=31;i++) {
			calendarObj=calendarObjList[i-1];
			if (calendarObj!=null) {
				lunarDatePattern=String.format("%02d", calendarObj.lunarMonth)+String.format("%02d", calendarObj.lunarDate);
				if (lunarHolidayList.containsKey(lunarDatePattern)) {
					buildHolidayList(i,lunarHolidayList.get(lunarDatePattern)); 
				}
				solarDatePattern=String.format("%02d",calendarObj.solarMonth)+String.format("%02d",calendarObj.solarDate);
				if (solarHolidayList.containsKey(solarDatePattern)) {
					buildHolidayList(i,solarHolidayList.get(solarDatePattern)); 
				}
			}
		}
		switch (this.month)
		{
			case 3: processEasterHoliday();//復活節只出現在3或4月
					break;
			case 4:	processEasterHoliday();//復活節只出現在3或4月
					int tempDate=cu.getChingMingDateByYear(year);//取得清明節日期
					buildHolidayList(tempDate,cu.solarTerm[(month-1)*2]+"節");
					break;
		}
		consolidateHolidayList();
	}
	private void processEasterHoliday() {
		LocalDate goodFriday,holySaturday,easterMonday;
		LocalDate easterDate=cu.getEasterDateByYear(this.year);
		
		goodFriday=easterDate.minusDays(2);
		holySaturday=easterDate.minusDays(1);
		easterMonday=easterDate.plusDays(1);
		
		if (goodFriday.getMonthValue()==this.month)
			buildHolidayList(goodFriday.getDayOfMonth(),"Good Friday");
		if (holySaturday.getMonthValue()==this.month)
			buildHolidayList(holySaturday.getDayOfMonth(),"Holy Saturday");
		/*
		if (easterDate.getMonthValue()==this.month)
			buildHolidayList(easterDate.getDayOfMonth(),"Easter");
		*/	
		if (easterMonday.getMonthValue()==this.month)
			buildHolidayList(easterMonday.getDayOfMonth(),"Easter Monday");
	}
	private void buildHolidayList(int inDate, String festivalInfo) {
				ArrayList<String>holidayInfoList=new ArrayList<String>();
				if (holidayList.containsKey(inDate)) {
					holidayInfoList=holidayList.remove(inDate);
					if (!festivalInfo.endsWith("補假"))
						festivalInfo+="補假";
				}
				holidayInfoList.add(festivalInfo);
				holidayList.put(inDate,holidayInfoList);
	}
	/**
	 * Move All Sunday's holidayInfoList to Monday
	 */
	private void consolidateHolidayList() {
		String temp;
		CalendarObj calendarObj;
		ArrayList<String>thisDateHolidayInfoList,nextDateHolidayInfoList;
		Integer []dates=holidayList.keySet().toArray(new Integer[holidayList.size()]);
		for (Integer date : dates) {
			calendarObj=calendarObjList[date-1];
			if (calendarObj.dayOfWeek.equals(DayOfWeek.SUNDAY) && (date < this.noOfWorkingDay)) {
				thisDateHolidayInfoList= holidayList.remove(date);
				nextDateHolidayInfoList= holidayList.get(date+1);
				if (nextDateHolidayInfoList==null) {
					nextDateHolidayInfoList=new ArrayList<String> (thisDateHolidayInfoList.size());
					for(String holidayInfo:thisDateHolidayInfoList) {
						if (holidayInfo.endsWith("補假"))
							nextDateHolidayInfoList.add(holidayInfo);
						else
							nextDateHolidayInfoList.add(holidayInfo+"補假");
					}
					holidayList.put(date+1,nextDateHolidayInfoList);
				} else {
					for(String holidayInfo:nextDateHolidayInfoList) {
						thisDateHolidayInfoList.add(holidayInfo);
					}
					for (int i=0;i<thisDateHolidayInfoList.size();i++) 
					{
						temp=thisDateHolidayInfoList.get(i);
						if (!temp.endsWith("補假"))
							temp+="補假";
						thisDateHolidayInfoList.set(i,temp);
					}
					holidayList.put(date+1,thisDateHolidayInfoList);
				}
			}
		}
	}
	private void updateCalendarObjList() {
		int vDate;
		
		ArrayList<String>holidayInfoList;
		for (Integer date : holidayList.keySet()) {
			holidayInfoList=holidayList.get(date);
			vDate=date;
			if (!holidayInfoList.isEmpty()) {
				for (String holidayInfo: holidayInfoList) {
					if (vDate<=this.noOfWorkingDay) {
						setHoliday(vDate,holidayInfo);
						vDate++;
					} else {
						break;
					}
				}
			}
		}
	}
	private void setHoliday(int date,String holidayInfo) {
		CalendarObj calendarObj=calendarObjList[date-1];	
		if (calendarObj!=null) {
			if ((!calendarObj.isPublicHoliday) &&
					(calendarObj.festivalInfo.isEmpty())) {
					calendarObj.isPublicHoliday=true;
					calendarObj.festivalInfo=holidayInfo;
					calendarObjList[date-1]=calendarObj;
				} else {
					String temp=calendarObj.festivalInfo;
					if (!temp.endsWith("補假"))
						temp+="補假";
					if (!holidayInfo.endsWith("補假"))
						holidayInfo+="補假";
					if (holidayList.containsKey(date)) { 
						setHoliday(date+1,holidayInfo);
					} else {
						calendarObj.festivalInfo=holidayInfo;
						calendarObjList[date-1]=calendarObj;
						setHoliday(date+1,temp);
					}
				}
		}		
	}
	public void printHolidayList() {
		CalendarObj calendarObj;
		for (Integer date : holidayList.keySet()) {
			calendarObj=calendarObjList[date-1];
			ArrayList<String> holidayInfoList=holidayList.get(date);
			System.out.printf("新曆%s年%s月%s日 %s\n",year,month,date,calendarObj.dayOfWeekName);
			System.out.printf("農曆%s年%s月%s日\n",calendarObj.lunarYear,calendarObj.lunarMonth,calendarObj.lunarDate);
			for (String holidayInfo:holidayInfoList) {
				System.out.println("festival Info="+holidayInfo);
			}
			System.out.println("===================================================");	
		}
	}
	public static void main(String[] args) {

		//int year=2015,month=4; //復活節清明節overlap
		int year=2019,month=4;
		//int year=2018,month=2;
		//int year=2018,month=7;//西曆假期補假
		//int year=2017,month=1;//農曆假期補假
		//int year=2013,month=3;//復活節撗跨3,4月
		//LocalDateTime now=LocalDateTime.now();
		LocalDateTime now=LocalDateTime.of(year,month,1,0,0,0);
		CalendarUtility cu=new CalendarUtility();
		CalendarObj calendarObj=cu.getCalendarObj(now);
		System.out.printf("新曆%s年%s月%s日 \n",calendarObj.solarYear,calendarObj.solarMonth,calendarObj.solarDate);
		System.out.printf("農曆%s年%s月%s日\n",calendarObj.lunarYear,calendarObj.lunarMonth,calendarObj.lunarDate);
		System.out.println("===================================================");
		MonthlyCalendar mc=new MonthlyCalendar(now.getYear(), now.getMonthValue()); 
		System.out.println("Current Month Name="+mc.currentMonthName);
		System.out.println("No. of Working days="+mc.noOfWorkingDay);
		System.out.println("===================================================");
		mc.printHolidayList();
		/*
		for (int i=1;i<=31;i++)
		{
			calendarObj=mc.calendarObjList[i-1];
			if (calendarObj!=null) {
				System.out.println("i="+i+",Solar Date="+calendarObj.solarYear);
				System.out.println("Solar Date="+calendarObj.solarYear+"/"+calendarObj.solarMonth+"/"+calendarObj.solarDate+" "+calendarObj.dayOfWeekName);
				System.out.println("Lunar Date="+calendarObj.lunarYear+"年"+cu.numToChineseNum(calendarObj.lunarMonth)+"月"+cu.numToChineseNum(calendarObj.lunarDate)+"日");
				System.out.println("Festival Info="+calendarObj.festivalInfo);
				System.out.println("is Holiday="+calendarObj.isPublicHoliday);
				System.out.println("===================================================");
			}
		}*/
	}
}
