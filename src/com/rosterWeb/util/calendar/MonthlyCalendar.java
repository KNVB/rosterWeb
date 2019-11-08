package com.rosterWeb.util.calendar;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.TreeMap;

public class MonthlyCalendar {
	public int month;
	public String monthName="";
	public int year;
	public CalendarObj[] calendarObjList=new CalendarObj[31];
	public int noOfWorkingDay=0;
	private CalendarUtility cu=new CalendarUtility();
	private TreeMap <String,String>lunarHolidayList=new TreeMap<String,String>();
	private TreeMap <String,String>solarHolidayList=new TreeMap<String,String>();
	
	public MonthlyCalendar(int year,int month) {
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
		solarHolidayList.put("0408","testing");
		solarHolidayList.put("0409","測試");		
		
		CalendarObj calendarObj;
		LocalDateTime sDObj=null;
		String lunarDatePattern=new String(),solarDatePattern=new String();
		TreeMap<Integer,ArrayList<String>>holidayDateList=new TreeMap<Integer,ArrayList<String>>();
		int i,tempDate;
		this.noOfWorkingDay=cu.getMonthLength(year,month);
		for (i=1;i<=noOfWorkingDay;i++) {
			sDObj = LocalDateTime.of(year,month,i,0,0,0);
			calendarObj=cu.getCalendarObj(sDObj);
			lunarDatePattern=String.format("%02d", calendarObj.lunarMonth)+String.format("%02d", calendarObj.lunarDate);
			if (lunarHolidayList.containsKey(lunarDatePattern)) {
				buildHolidayList(holidayDateList,i,lunarHolidayList.get(lunarDatePattern)); 
			}
			solarDatePattern=String.format("%02d",month)+String.format("%02d",calendarObj.solarDate);
			if (solarHolidayList.containsKey(solarDatePattern)) {
				buildHolidayList(holidayDateList,i,solarHolidayList.get(solarDatePattern)); 
			}
			calendarObjList[i-1]=calendarObj;	
		}
		switch (month)
		{
			case 3: processEasterHoliday(holidayDateList,year,month);//復活節只出現在3或4月
					break;
			case 4:	processEasterHoliday(holidayDateList,year,month);//復活節只出現在3或4月
					tempDate=cu.getChingMingDate(year);//取得清明節日期
					buildHolidayList(holidayDateList,tempDate,cu.solarTerm[(month-1)*2]+"節");
					break;
		}
		holidayCompensation(holidayDateList);
		
		for (Integer date:holidayDateList.keySet()) {
			calendarObj=calendarObjList[date-1];
			ArrayList<String> holidayInfoList=holidayDateList.get(date);
			System.out.printf("新曆%s年%s月%s日 %s\n",year,month,date,calendarObj.dayOfWeekName);
			System.out.printf("農曆%s年%s月%s日\n",calendarObj.lunarYear,calendarObj.lunarMonth,calendarObj.lunarDate);
			for(String holidayInfo:holidayInfoList) {
				System.out.println("festival Info="+holidayInfo);
			}
			System.out.println("===================================================");	
		}
		
		this.monthName=cu.monthNames.get(sDObj.getMonth())+ " " +year;
		this.month=month;
		this.year=year;
		for (i=0;i<31;i++) {
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
	private void holidayCompensation(TreeMap<Integer,ArrayList<String>>holidayDateList) {
		CalendarObj calendarObj;
		ArrayList<String> thisDateHolidayList,nextDateHolidayList;
		String temp=new String();
		for (Integer date : holidayDateList.keySet()) {
			calendarObj=calendarObjList[date-1];
			if (calendarObj.dayOfWeek.equals(DayOfWeek.SUNDAY)) {
				thisDateHolidayList= holidayDateList.get(date);
				nextDateHolidayList= holidayDateList.get(date+1);
				if (nextDateHolidayList==null) {
					nextDateHolidayList=new ArrayList<String> (thisDateHolidayList.size());
					for(String holidayInfo:thisDateHolidayList) {
						if (holidayInfo.endsWith("補假"))
							nextDateHolidayList.add(holidayInfo);
						else
							nextDateHolidayList.add(holidayInfo+"補假");
					}
					holidayDateList.put(date+1,nextDateHolidayList);
					thisDateHolidayList.clear();
					holidayDateList.put(date,thisDateHolidayList);
				} else {
					for(String holidayInfo:nextDateHolidayList) {
						thisDateHolidayList.add(holidayInfo);
					}
					for (int i=0;i<thisDateHolidayList.size();i++) 
					{
						temp=thisDateHolidayList.get(i);
						if (!temp.endsWith("補假"))
							temp+="補假";
						thisDateHolidayList.set(i,temp);
					}
					holidayDateList.put(date+1,thisDateHolidayList);
					nextDateHolidayList.clear();
					holidayDateList.put(date,nextDateHolidayList);
				}
			}
		}
		for (Integer date : holidayDateList.keySet()) {
			
		}
	}
	private void buildHolidayList(TreeMap<Integer,ArrayList<String>>holidayDateList,int inDate,String festivalInfo) {
		ArrayList<String>holidayInfoList;
		if (holidayDateList.containsKey(inDate)) {
			holidayInfoList=holidayDateList.remove(inDate);
			if (!festivalInfo.endsWith("補假"))
				festivalInfo+="補假";
		} else {
			holidayInfoList=new ArrayList<String>();
		}
		holidayInfoList.add(festivalInfo);
		holidayDateList.put(inDate,holidayInfoList);
	}
	
	private void processEasterHoliday(TreeMap<Integer, ArrayList<String>> holidayDateList, int year, int month) {
		LocalDate goodFriday,holySaturday,easterMonday;
		LocalDate easterDate=cu.getEasterDateByYear(year);
		
		goodFriday=easterDate.minusDays(2);
		holySaturday=easterDate.minusDays(1);
		easterMonday=easterDate.plusDays(1);
		
		if (goodFriday.getMonthValue()==month)
			buildHolidayList(holidayDateList,goodFriday.getDayOfMonth(),"Good Friday");
		if (holySaturday.getMonthValue()==month)
			buildHolidayList(holidayDateList,holySaturday.getDayOfMonth(),"Holy Saturday");
		
		if (easterDate.getMonthValue()==month)
			buildHolidayList(holidayDateList,easterDate.getDayOfMonth(),"Easter");
			
		if (easterMonday.getMonthValue()==month)
			buildHolidayList(holidayDateList,easterMonday.getDayOfMonth(),"Easter Monday");
	}
	public static void main(String[] args) {

		int year=2015,month=4; //復活節清明節overlap
		//int year=2018,month=7;
		//int year=2017,month=4;//
		//int year=2013,month=3;//復活節撗跨3,4月
		//LocalDateTime now=LocalDateTime.now();
		LocalDateTime now=LocalDateTime.of(year,month,1,0,0,0);
		CalendarUtility cu=new CalendarUtility();
		CalendarObj calendarObj=cu.getCalendarObj(now);
		System.out.printf("新曆%s年%s月%s日 \n",calendarObj.solarYear,calendarObj.solarMonth,calendarObj.solarDate);
		System.out.printf("農曆%s年%s月%s日\n",calendarObj.lunarYear,calendarObj.lunarMonth,calendarObj.lunarDate);
		System.out.println("===================================================");
		MonthlyCalendar mc=new MonthlyCalendar(now.getYear(), now.getMonthValue()); 
		System.out.println("No. of Working days="+mc.noOfWorkingDay);
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
