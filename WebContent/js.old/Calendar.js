var CalendarFactory=function()
{
	var lunarInfo=new Array(
0x4bd8,0x4ae0,0xa570,0x54d5,0xd260,0xd950,0x5554,0x56af,0x9ad0,0x55d2,
0x4ae0,0xa5b6,0xa4d0,0xd250,0xd255,0xb54f,0xd6a0,0xada2,0x95b0,0x4977,
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
0xd520);
	var solarMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
	var Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
	var Animals=new Array("鼠","牛","虎","兔","龍","蛇","馬","羊","猴","雞","狗","豬");
	var solarTerm = new Array("小寒","大寒","立春","雨水","驚蟄","春分","清明","穀雨","立夏","小滿","芒種","夏至","小暑","大暑","立秋","處暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至");
	var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758);
	var nStr1 = new Array('日','一','二','三','四','五','六','七','八','九','十');
	var nStr2 = new Array('初','十','廿','卅','卌');
	var monthName = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	var weekDayNames =new Array("Su", "M", "T", "W", "Th", "F", "S");
	//西曆節日 *表示放假日
	var sFtv = new Array(
	"0101*元旦",
	"0501*勞動節",
	"0701*香港回歸紀念日",
	"1001*中華人民共和國國慶",
	"1225*聖誕節",
	"1226*聖誕節第二日",
	"1231 除夕");

	//某月的第幾個星期幾。 5,6,7,8 表示到數第 1,2,3,4 個星期幾
	var wFtv = new Array(
	"0520 母親節",
	"0630 父親節");

	//農曆節日
	var lFtv = new Array(
	"0101*大年初一",
	"0102*年初二",
	"0103*年初三",
	"0408*佛誕",
	"0505*端午節",
	"0701 開鬼門",
	"0707 七夕",
	"0714 盂蘭節",
	"0800 關鬼門",
	"0816*中秋節",
	"0909*重陽節",
	"0100 除夕");
	//====================================== 傳回農曆 y年的總天數
	 var lYearDays=function(y) {
	 var i, sum = 348;
	 for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-1900] & i)? 1: 0;
	 return(sum+leapDays(y));
	}

	//====================================== 傳回農曆 y年閏月的天數
	 var leapDays=function (y) {
	 if(leapMonth(y)) return( (lunarInfo[y-1899]&0xf)==0xf? 30: 29);
	 else return(0);
	}

	//====================================== 傳回農曆 y年閏哪個月 1-12 , 沒閏傳回 0
	var leapMonth=function (y) {
	 var lm = lunarInfo[y-1900] & 0xf;
	 return(lm==0xf?0:lm);
	}

	//====================================== 傳回農曆 y年m月的總天數

	function monthDays(y,m) {
	 return( (lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
	}
	//==============================傳回國曆 y年某m+1月的天數
	function solarDays(y,m) {
	 if(m==1)
		return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
	 else
		return(solarMonth[m]);
	}
	//============================== 傳入 offset 傳回干支, 0=甲子
	function cyclical(num) {
	 return(Gan[num%10]+Zhi[num%12]);
	}
	//===== 某年的第n個節氣為幾日(從0小寒起算)
	function sTerm(y,n) {
	 var offDate = new Date( ( 31556925974.7*(y-1900) + sTermInfo[n]*60000  ) + Date.UTC(1900,0,6,2,5) );
	 return(offDate.getUTCDate());
	}
	//====================================== 算出農曆, 傳入日期物件, 傳回農曆日期物件
	//                                       該物件屬性有 .year .month .day .isLeap
	function Lunar(objDate)
	{
		var i, leap=0, temp=0;
		var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;

		for(i=1900; i<2100 && offset>0; i++) { temp=lYearDays(i); offset-=temp; }

		if(offset<0) { offset+=temp; i--; }

		this.year = i;

		leap = leapMonth(i); //閏哪個月
		this.isLeap = false;

		for(i=1; i<13 && offset>0; i++) {
		//閏月
		if(leap>0 && i==(leap+1) && this.isLeap==false)
		   { --i; this.isLeap = true; temp = leapDays(this.year); }
		else
		   { temp = monthDays(this.year, i); }

		//解除閏月
		if(this.isLeap==true && i==(leap+1)) this.isLeap = false;

		offset -= temp;
		}

		if(offset==0 && leap>0 && i==leap+1)
		if(this.isLeap)
		   { this.isLeap = false; }
		else
		   { this.isLeap = true; --i; }

		if(offset<0){ offset += temp; --i; }

		this.month = i;
		this.day = offset + 1;
	};
	//======================================= 傳回該年的復活節(春分後第一次滿月週後的第一主日)
	function easterDate(y)
	{
		var term2=sTerm(y,5); //取得春分日期
		var dayTerm2 = new Date(Date.UTC(y,2,term2,0,0,0,0)); //取得春分的國曆日期物件(春分一定出現在3月)
		var lDayTerm2 = new Lunar(dayTerm2); //取得取得春分農曆
		if(lDayTerm2.day<15) //取得下個月圓的相差天數
		var lMlen= 15-lDayTerm2.day;
		else
		var lMlen= (lDayTerm2.isLeap? leapDays(y): monthDays(y,lDayTerm2.month)) - lDayTerm2.day + 15;

		//一天等於 1000*60*60*24 = 86400000 毫秒
		var l15 = new Date(dayTerm2.getTime() + 86400000*lMlen ); //求出第一次月圓為國曆幾日
		var dayEaster = new Date(l15.getTime() + 86400000*( 7-l15.getUTCDay() ) ); //求出下個週日

		this.month = dayEaster.getUTCMonth();
		this.date = dayEaster.getUTCDate();
	}
/*
 功能說明:算出農曆, 傳入日期物件, 傳回農曆日期物件
 使用方式: OBJ = CalendarFactory.getLunarDate(javascript 的日期物件);
 
 OBJ.year	農曆年份	
 OBJ.month	農曆月份
 OBJ.day	農曆日期
 OBJ.isLeap 是否為閏月
*/
	CalendarFactory.prototype.getLunarDate=function(objDate)
	{
		return new Lunar(objDate);
	}
	
	/*
	功能說明: 傳回該年的復活節日期
	使用方式: OBJ = CalendarFactory.getEasterDate(年);
	OBJ.month  復活節的月份(零起算月)
	OBJ.date   復活節的日期
	*/
	CalendarFactory.prototype.getEasterDate=function(y)
	{
		return new easterDate(y);
		
	}
	//============================== 傳回月曆物件 (y年,m+1月)
	/*
	功能說明: 傳回整個月的日期資料物件

	使用方式: OBJ = CalendarFactory.getMonthCalendar(年,零起算月);

	OBJ.length      傳回當月最大日
	OBJ.firstWeekDay   傳回當月一日星期

	
	*/
	CalendarFactory.prototype.getMonthCalendar=function(y,m) 
	{
		return new MonthCalendar(y,m); 
		function MonthCalendar(y,m) 
		{
			var sDObj, lDObj, lY, lM, lD=1, lL, lX=0, tmp1, tmp2, tmp3;
			var cY, cM, cD; //年柱,月柱,日柱
			var lDPOS = new Array(3);
			var n = 0;
			var firstLM = 0;
			sDObj = new Date(y,m,1,0,0,0,0);    //當月一日日期
			this.length    = solarDays(y,m);    //西曆當月天數
			this.firstWeekDay = sDObj.getDay();    //西曆當月1日星期幾
			var calendarDateList=new Array();
			////////年柱 1900年立春後為庚子年(60進制36)
			if(m<2) cY=cyclical(y-1900+36-1);
			else cY=cyclical(y-1900+36);
			var term2=sTerm(y,2); //立春日期

			////////月柱 1900年1月小寒以前為 丙子月(60進制12)
			var firstNode = sTerm(y,m*2) //傳回當月「節」為幾日開始
			cM = cyclical((y-1900)*12+m+12);

			//當月一日與 1900/1/1 相差天數
			//1900/1/1與 1970/1/1 相差25567日, 1900/1/1 日柱為甲戌日(60進制10)
			var dayCyclical = Date.UTC(y,m,1,0,0,0,0)/86400000+25567+10;
			
			for(var i=0;i<this.length;i++) 
			{
				if(lD>lX) {
				   sDObj = new Date(y,m,i+1);    //當月一日日期
				   lDObj = new Lunar(sDObj);     //農曆
				   lY    = lDObj.year;           //農曆年
				   lM    = lDObj.month;          //農曆月
				   lD    = lDObj.day;            //農曆日
				   lL    = lDObj.isLeap;         //農曆是否閏月
				   lX    = lL? leapDays(lY): monthDays(lY,lM); //農曆當月最後一天

				   if(n==0) firstLM = lM;
				   lDPOS[n++] = i-lD+1;
				}
				//依節氣調整二月分的年柱, 以立春為界
				if(m==1 && (i+1)==term2) cY=cyclical(y-1900+36);
				//依節氣月柱, 以「節」為界
				if((i+1)==firstNode) cM = cyclical((y-1900)*12+m+13);
				//日柱
				cD = cyclical(dayCyclical+i);

				//sYear,sMonth,sDay,week,
				//lYear,lMonth,lDay,isLeap,
				//cYear,cMonth,cDay
				var cal=new CalendarDate(y, m+1, i+1, weekDayNames[(i+this.firstWeekDay)%7],
                             lY, lM, lD++, lL,
                             cY ,cM, cD);
				calendarDateList.push(cal);
			}
			
			//節氣
			tmp1=sTerm(y,m*2  )-1;
			tmp2=sTerm(y,m*2+1)-1;
			
			calendarDateList[tmp1].solarTerms = solarTerm[m*2];
			calendarDateList[tmp2].solarTerms = solarTerm[m*2+1];
			//清明節只出現在4月 
			if (m==3)
			{
				calendarDateList[tmp1].isHoliday=true;	
			}
			
			//復活節只出現在3或4月
			if(m==2 || m==3) {
				var estDay = new easterDate(y);
				if(m == estDay.month)
				{   
					if (calendarDateList[estDay.date-1]!=null)
						calendarDateList[estDay.date-1].solarFestival = calendarDateList[estDay.date-1].solarFestival+' 復活節 ';
					if (calendarDateList[estDay.date]!=null)
						calendarDateList[estDay.date].isHoliday=true;
					if (calendarDateList[estDay.date-3]!=null)
						calendarDateList[estDay.date-3].isHoliday=true;
				}
			}			
			
			//國曆節日
			for(i in sFtv)
			{
				if(sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
				   if(Number(RegExp.$1)==(m+1)) 
				   {
					  calendarDateList[Number(RegExp.$2)-1].solarFestival += RegExp.$4 + ' ';
					  if(RegExp.$3=='*') calendarDateList[Number(RegExp.$2)-1].isHoliday = true;
				   }
			}
			
			 //月週節日
			for(i in wFtv)
			{
				if(wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
				{   
					if(Number(RegExp.$1)==(m+1)) {
					  tmp1=Number(RegExp.$2);
					  tmp2=Number(RegExp.$3);
					  if(tmp1<5)
					  {
						calendarDateList[((this.firstWeekDay>tmp2)?7:0) + 7*(tmp1-1) + tmp2 - this.firstWeekDay].solarFestival += RegExp.$5 + ' ';
					  }
					  else {
						 tmp1 -= 5;
						 tmp3 = (this.firstWeekDay+this.length-1)%7; //當月最後一天星期?
						 calendarDateList[this.length - tmp3 - 7*tmp1 + tmp2 - (tmp2>tmp3?7:0) - 1 ].solarFestival += RegExp.$5 + ' ';
					  }
				   }
				}
			}
			//農曆節日
			for(i in lFtv)
			{
				if(lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) 
				{
				   tmp1=Number(RegExp.$1)-firstLM;
				   if(tmp1==-11) tmp1=1;
				   if(tmp1 >=0 && tmp1<n) {
					  tmp2 = lDPOS[tmp1] + Number(RegExp.$2) -1;
					  if( tmp2 >= 0 && tmp2<this.length && calendarDateList[tmp2].isLeap!=true) {
						calendarDateList[tmp2].lunarFestival += RegExp.$4 + ' ';
						if(RegExp.$3=='*') calendarDateList[tmp2].isHoliday=true;
					  }
					}
				}
			}   
 
			
			//今日
			var Today = new Date();
			var tY = Today.getFullYear();
			var tM = Today.getMonth();
			var tD = Today.getDate();
			if(y==tY && m==tM) calendarDateList[tD-1].isToday = true;
			
			MonthCalendar.prototype.getCalendarDateList=function()
			{
				return calendarDateList;
			}
		};

	}
};
//============================== 月曆屬性
function CalendarDate(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,cYear,cMonth,cDay) 
{
	this.isToday    = false;
	//國曆
	this.sYear      = sYear;   //西元年4位數字
	this.sMonth     = sMonth;  //西元月數字
	this.sDay       = sDay;    //西元日數字
	this.week       = week;    //星期, 1個中文
	//農曆
	this.lYear      = lYear;   //西元年4位數字
	this.lMonth     = lMonth;  //農曆月數字
	this.lDay       = lDay;    //農曆日數字
	this.isLeap     = isLeap;  //是否為農曆閏月?
	//八字
	this.cYear      = cYear;   //年柱, 2個中文
	this.cMonth     = cMonth;  //月柱, 2個中文
	this.cDay       = cDay;    //日柱, 2個中文

	this.lunarFestival = ''; //農曆節日
	this.solarFestival = ''; //西曆節日
	this.solarTerms    = ''; //節氣
	this.isHoliday=false;
}



