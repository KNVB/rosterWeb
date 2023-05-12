roster: {
  activeShiftList:{[],essentialShift},
  month,  
  rosterRow:itoId: {    
    "actualWorkingDayCount",
    "actualWorkingHour,
    availableShiftList: [],
    expectedWorkingHour,
    itoName,
    itoPostName,
    lastMonthBalance,
    shiftList:[],    
    "shiftCountList": {
      "aShiftCount",
      "bxShiftCount",
      "cShiftCount",
      "dxShiftCount"
    },
    thisMonthBalance,
    "totalBalance",
    workingHourPerDay,
  },
  weekdayNames,
  year
}
rosterMonth:{
	calendarDateList:[],
	noOfWorkingDay
}
systemParam : {  
  maxConsecutiveWorkingDay,
  maxNoOfShiftPerMonth,
  monthPickerMinDate,
  noOfPrevDate": 2
}
rosterSchedulerData:{  
  blackListShiftList:itoId:{},
  blackListShiftPattern:itoId:{},
  duplicateShiftList:{}
  previousMonthShiftList:itoId:{},
  preferredShiftList:itoId:{},
  vacantShiftList:{}
}

autoplanResult:{
	duplicateShiftList:{},
	rosterRow:itoId:{
		"actualWorkingDayCount",
		"actualWorkingHour,
		availableShiftList: [],
		expectedWorkingHour,
		itoName,
		itoPostName,
		lastMonthBalance,
		shiftList:[],    
		"shiftCountList": {
		  "aShiftCount",
		  "bxShiftCount",
		  "cShiftCount",
		  "dxShiftCount"
		},
		thisMonthBalance,
		"totalBalance",
		workingHourPerDay,
	}
	vacantShiftList:{},
	vacantShiftCount
}