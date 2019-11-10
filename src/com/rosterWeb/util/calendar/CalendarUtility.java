package com.rosterWeb.util.calendar;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.TreeMap;
/**
 * 
 * 日曆工具物件<br> 	
 * <br>
 * 本程式參考自Sean Lin (林洵賢)先生的農曆月曆與世界時間DHTML程式(AD1900至AD2100)<br>
 * http://sean.o4u.com/2008/04/dhtml.html<br><br>
 * 
 * The program is inspired by Sean Lin DHTML web page:<br>
 * http://sean.o4u.com/2008/04/dhtml.html
 *
 * @author Roy Tsang
 */
public class CalendarUtility {

	private int lunarInfo[]={0x4bd8,0x4ae0,0xa570,0x54d5,0xd260,0xd950,0x5554,0x56af,0x9ad0,0x55d2,
								0x4ae0,0xa5b6,0xa4d0,0xd250,0xd295,0xb54f,0xd6a0,0xada2,0x95b0,0x4977,
								0x497f,0xa4b0,0xb4b5,0x6a50,0x6d40,0xab54,0x2b6f,0x9570,0x52f2,0x4970,
								0x6566,0xd4a0,0xea50,0x6a95,0x5adf,0x2b60,0x86e3,0x92ef,0xc8d7,0xc95f,
								0xd4a0,0xd8a6,0xb55f,0x56a0,0xa5b4,0x25df,0x92d0,0xd2b2,0xa950,0xb557,
								0x6ca0,0xb550,0x5355,0x4daf,0xa5b0,0x4573,0x52bf,0xa9a8,0xe950,0x6aa0,
								0xaea6,0xab50,0x4b60,0xaae4,0xa570,0x5260,0xf263,0xd950,0x5b57,0x56a0,
								0x96d0,0x4dd5,0x4ad0,0xa4d0,0xd4d4,0xd250,0xd558,0xb540,0xb6a0,0x95a6,
								0x95bf,0x49b0,0xa974,0xa4b0,0xb27a,0x6a50,0x6d40,0xaf46,0xab60,0x9570,
								0x4af5,0x4970,0x64b0,0x74a3,0xea50,0x6b58,0x5ac0,0xab60,0x96d5,0x92e0,
								0xc960,0xd954,0xd4a0,0xda50,0x7552,0x56a0,0xabb7,0x25d0,0x92d0,0xcab5,
								0xa950,0xb4a0,0xbaa4,0xad50,0x55d9,0x4ba0,0xa5b0,0x5176,0x52bf,0xa930,
								0x7954,0x6aa0,0xad50,0x5b52,0x4b60,0xa6e6,0xa4e0,0xd260,0xea65,0xd530,
								0x5aa0,0x76a3,0x96d0,0x4afb,0x4ad0,0xa4d0,0xd0b6,0xd25f,0xd520,0xdd45,
								0xb5a0,0x56d0,0x55b2,0x49b0,0xa577,0xa4b0,0xaa50,0xb255,0x6d2f,0xada0,
								0x4b63,0x937f,0x49f8,0x4970,0x64b0,0x68a6,0xea5f,0x6b20,0xa6c4,0xaaef,
								0x92e0,0xd2e3,0xc960,0xd557,0xd4a0,0xda50,0x5d55,0x56a0,0xa6d0,0x55d4,
								0x52d0,0xa9b8,0xa950,0xb4a0,0xb6a6,0xad50,0x55a0,0xaba4,0xa5b0,0x52b0,
								0xb273,0x6930,0x7337,0x6aa0,0xad50,0x4b55,0x4b6f,0xa570,0x54e4,0xd260,
								0xe968,0xd520,0xdaa0,0x6aa6,0x56df,0x4ae0,0xa9d4,0xa4d0,0xd150,0xf252,
								0xd520};
	private String nStr1[] = {"日","一","二","三","四","五","六","七","八","九","十"};
	private String nStr2[] = {"初","十","廿","卅","卌"};
	public String solarTerm[] ={"小寒","大寒","立春","雨水","驚蟄","春分","清明","穀雨","立夏","小滿","芒種","夏至","小暑","大暑","立秋","處暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"};
	
	private LocalDateTime solarStartDate=LocalDateTime.of(1900, 1, 31,0,0,0);
	public TreeMap <DayOfWeek,String> weekDayNames=new TreeMap <DayOfWeek,String>();
	public TreeMap <Month,String>monthNames=new TreeMap<Month,String>();
	public CalendarUtility() {
		
		
		weekDayNames.put(DayOfWeek.SUNDAY, "Su");
		weekDayNames.put(DayOfWeek.MONDAY, "M");
		weekDayNames.put(DayOfWeek.TUESDAY, "T");
		weekDayNames.put(DayOfWeek.WEDNESDAY, "W");
		weekDayNames.put(DayOfWeek.THURSDAY, "TH");
		weekDayNames.put(DayOfWeek.FRIDAY,"F");
		weekDayNames.put(DayOfWeek.SATURDAY,"S");
		
		monthNames.put(Month.JANUARY,"January");
		monthNames.put(Month.FEBRUARY,"February");
		monthNames.put(Month.MARCH,"March");
		monthNames.put(Month.APRIL,"April");
		monthNames.put(Month.MAY,"May");
		monthNames.put(Month.JUNE,"June");
		monthNames.put(Month.JULY,"July");
		monthNames.put(Month.AUGUST,"August");
		monthNames.put(Month.SEPTEMBER,"September");
		monthNames.put(Month.OCTOBER,"October");
		monthNames.put(Month.NOVEMBER,"November");
		monthNames.put(Month.DECEMBER,"December");
	}
	/**
	 * 傳入數字傳回相應的中文數字<br>
	 * It returns corresponding Chinese of a given number 
	 * @param d 傳入數字
	 * @return 傳回中文數字
	 */
	public String numToChineseNum(int d)
	{
		String s=new String();
		if (d<10)
			s=nStr1[d];
		else
		{
			s = nStr2[(int)(d/10)];
			if ((d%10)>0)
				s += nStr1[d%10];
		}
		return s;
	}
	/**
	 * 傳回某年的第n個節氣為幾日(從0小寒起算)
	 * @param y 年份
	 * @param n 第幾個
	 * @return 某年的第n個節氣為幾日(從0小寒起算)
	 */
	private int sTerm(int y,int n)
	{
		int result=0,index,solarTermBase[]={4,19,3,18,4,19,4,19,4,20,4,20,6,22,6,22,6,22,7,22,6,21,6,21};
		byte temp;
		String solarTermIdx ="0123415341536789:;<9:=<>:=1>?012@015@015@015AB78CDE8CD=1FD01GH01GH01IH01IJ0KLMN;LMBEOPDQRST0RUH0RVH0RWH0RWM0XYMNZ[MB\\]PT^_ST`_WH`_WH`_WM`_WM`aYMbc[Mde]Sfe]gfh_gih_Wih_WjhaWjka[jkl[jmn]ope]qph_qrh_sth_W";
		String solarTermOS = "211122112122112121222211221122122222212222222221222122222232222222222222222233223232223232222222322222112122112121222211222122222222222222222222322222112122112121222111211122122222212221222221221122122222222222222222222223222232222232222222222222112122112121122111211122122122212221222221221122122222222222222221211122112122212221222211222122222232222232222222222222112122112121111111222222112121112121111111222222111121112121111111211122112122112121122111222212111121111121111111111122112122112121122111211122112122212221222221222211111121111121111111222111111121111111111111111122112121112121111111222111111111111111111111111122111121112121111111221122122222212221222221222111011111111111111111111122111121111121111111211122112122112121122211221111011111101111111111111112111121111121111111211122112122112221222211221111011111101111111110111111111121111111111111111122112121112121122111111011111121111111111111111011111111112111111111111011111111111111111111221111011111101110111110111011011111111111111111221111011011101110111110111011011111101111111111211111001011101110111110110011011111101111111111211111001011001010111110110011011111101111111110211111001011001010111100110011011011101110111110211111001011001010011100110011001011101110111110211111001010001010011000100011001011001010111110111111001010001010011000111111111111111111111111100011001011001010111100111111001010001010000000111111000010000010000000100011001011001010011100110011001011001110111110100011001010001010011000110011001011001010111110111100000010000000000000000011001010001010011000111100000000000000000000000011001010001010000000111000000000000000000000000011001010000010000000";

		index=y-1900;
		temp=solarTermIdx.getBytes()[index];
		index=temp;
		index=(index-48)*24+n;
		result=solarTermOS.getBytes()[index]-48; //convert char to int
		result+=solarTermBase[n];
		return result;
	}
	/**
	 *  傳回農曆 y年的總天數
	 *  @param y
	 *  @return 傳回農曆 y年的總天數
	 *
	 */
	private int lYearDays(int y) 
	{
		int i, sum = 348;
		for(i=0x8000; i>0x8; i>>=1) 
		{	
			if ((lunarInfo[y-1900] & i)>0)
			{
				sum+=1;
			}
		}
		return(sum+leapDays(y));
	}
	/**
	 * 傳回農曆 y年閏月的天數
	 * @param y
	 * @return 傳回農曆 y年閏月的天數
	 *
	 */
	private int leapDays(int y) 
	{
		if(getLunarLeapMonth(y)!=0) 
		{	
			return( (lunarInfo[y-1899]&0xf)==0xf? 30: 29);
		}
		else 
			return(0);
	}
	/**
	 * 傳回農曆 y年閏哪個月 1-12 , 沒閏傳回 0
	 * @param y
	 * @return 傳回農曆 y年閏哪個月 1-12 , 沒閏傳回 0
	 *
	 */
	private int getLunarLeapMonth(int y) 
	{
		int lm = lunarInfo[y-1900] & 0xf;
		return(lm==0xf?0:lm);
	}
	/**
	 * 傳回農曆 y年m月的總天數
	 * @param y 年份
	 * @param m 月份
	 * @return 傳回農曆 y年m月的總天數
	 * 
	 */
	protected int lunarMonthDayCount(int y,int m) 
	{
		if ((lunarInfo[y-1900] & (0x10000>>m))>0)
			return 30;
		else
			return 29;	  
	}
	/**
	 * 傳入LocalDate物件, 傳回CalendarObj物件<br>
	 * It returns a corresponding CalendarObj object when a LocalDateTime object is given.
	 * @param inLocalDateObj LocalDateTime物件
	 * @return CalendarObj物件<br>
	 * A corresponding LunarDate object when a LocalDate object is given.
	 */
	public CalendarObj getCalendarObj(LocalDateTime inLocalDateObj)
	{
		int i,lunarLeapMonth;
		long offset=0L,temp=0L;
		CalendarObj result=new CalendarObj();
		result.solarDate=inLocalDateObj.getDayOfMonth();
		result.solarMonth=inLocalDateObj.getMonthValue();
		result.solarYear=inLocalDateObj.getYear();
		result.dayOfWeek=inLocalDateObj.getDayOfWeek();
		result.dayOfWeekName=weekDayNames.get(inLocalDateObj.getDayOfWeek());
		offset=inLocalDateObj.atZone(ZoneId.of("UTC")).toInstant().toEpochMilli();
		offset=(offset-solarStartDate.atZone(ZoneId.of("UTC")).toInstant().toEpochMilli())/86400000L;
		for(i=1900; i<2100 && offset>0; i++) 
		{ 
			temp=lYearDays(i); 
			offset-=temp; 
		}
		if(offset<0) 
		{ 
			offset+=temp; 
			i--; 
		}
		result.lunarYear=i;
		lunarLeapMonth=getLunarLeapMonth(i);
		result.isLeap=false;
		
		for(i=1; i<13 && offset>0; i++) 
		{
			//閏月
			if(lunarLeapMonth>0 && i==(lunarLeapMonth) && result.isLeap==false)
			{ 
				--i; 
				result.isLeap = true; 
				temp = leapDays(result.lunarYear); 
			}
			else
			{ 
				temp = lunarMonthDayCount(result.lunarYear, i); 
			}

			//解除閏月
			if(result.isLeap==true && i==(lunarLeapMonth)) 
				result.isLeap = false;

			offset -= temp;
		}
		if(offset==0L && lunarLeapMonth>0 && i==lunarLeapMonth)
			if(result.isLeap)
			{
				result.isLeap = false; 
			}
			else
			{ 
				result.isLeap = true; 
				--i; 
			}

		if(offset<0L)
		{ 
			offset += temp; 
			--i; 
		}
		result.lunarMonth=i;
		result.lunarDate=(int)offset+1;
		return result;
	}
	/**
	 * 傳回西曆 y年某month月的天數<br>
	 * It returns the no. of day of the given month
	 * @return 該月的天數
	 */
	public int getMonthLength(int year,int month) 
	{
		YearMonth yearMonthObject = YearMonth.of(year, month);
		return yearMonthObject.lengthOfMonth(); 
	}
	/**
	 * 傳回該年的復活節LocalDate物件(春分後第一次滿月週後的第一主日)<br>
	 * It returns a LocalDate object which devote the date of easter of the given year
	 * @param y 年份
	 * @return 傳回該年復活節LocalDate物件
	 */
	public LocalDate getEasterDateByYear(int year) {
		int lMlen,term2=sTerm(year,5); //取得春分日期
		LocalDate dayTerm2=LocalDate.of(year,3, term2);//取得春分的國曆日期物件(春分一定出現在3月)
		CalendarObj lDayTerm2 = getCalendarObj(dayTerm2.atStartOfDay()); //取得取得春分農曆
		if (lDayTerm2.lunarDate<15)
		{
			lMlen=15-lDayTerm2.lunarDate;
		} else {
			if (lDayTerm2.isLeap)
			{
				lMlen=leapDays(year);//農曆 y年閏月的天數
			}
			else
			{
				lMlen=lunarMonthDayCount(lDayTerm2.lunarYear,lDayTerm2.lunarMonth);//農曆 y年m月的總天數
			}
			lMlen=lMlen-lDayTerm2.lunarDate + 15;
		}
		dayTerm2=dayTerm2.plusDays(lMlen);
		if (dayTerm2.getDayOfWeek()==DayOfWeek.SUNDAY)
		{
			dayTerm2=dayTerm2.plusDays(1);
		}
		while (dayTerm2.getDayOfWeek()!=DayOfWeek.SUNDAY)
		{
			dayTerm2=dayTerm2.plusDays(1);
		}
		return dayTerm2;
	}
	/**
	 * 傳回該年的清明節日期<br>
	 * It returns a LocalDate object which devote the date of Ching Ming Festival of the given year
	 * @param y 年份
	 * @return 傳回該年的清明節日期
	 */
	public int getChingMingDateByYear(int year) {
		return sTerm(year,6); 
	}
}
