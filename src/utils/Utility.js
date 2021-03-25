import SessionExpiredError from './SessionExpiredError';
export default class Utility{
  static calculateMean(data){
      return data.reduce(function (a, b) {
          return Number(a) + Number(b);
      }) / data.length;
  }
  static calculateStdDev(data){
      let m =this.calculateMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
  }
  static calculateITOMonthlyStat(roster,noOfWorkingDay,activeShiftInfoList){
    roster.actualWorkingHour=0.0;
    roster.totalHour = roster.workingHourPerDay * noOfWorkingDay;
    Object.keys(roster.shiftList).forEach(date=>{
        let item=roster.shiftList[date];
        let shiftTypeList = item.split("+");
        
        shiftTypeList.forEach(shiftType => {
          if (roster.availableShiftList.includes(shiftType)){
            if (activeShiftInfoList[shiftType]){
              roster.actualWorkingHour += activeShiftInfoList[shiftType].duration;
            }
          }
        });
    });    
    roster.thisMonthHourTotal = roster.actualWorkingHour - roster.totalHour;
    roster.thisMonthBalance = roster.lastMonthBalance + roster.thisMonthHourTotal;
    roster.shiftCountList=this.calculateShiftCount(roster);
    roster.actualNoOfWorkingDay =roster.shiftCountList.aShiftCount +roster.shiftCountList.bxShiftCount+roster.shiftCountList.cShiftCount +roster.shiftCountList.dxShiftCount;
  }
  static calculateShiftCount(roster) {
    let aShiftCount = 0,
      bxShiftCount = 0,
      cShiftCount = 0,
      dxShiftCount = 0;

    Object.keys(roster.shiftList).forEach(key=>{
      let item=roster.shiftList[key];
        let shiftTypeList = item.split("+");
        shiftTypeList.forEach(shiftType => {
          if (roster.availableShiftList.includes(shiftType)){
            switch (shiftType) {
              case "a":
                aShiftCount++;
                break;
              case "b":
              case "b1":
                bxShiftCount++;
                break;
              case "c":
                cShiftCount++;
                break;
              case "d":
              case "d1":
              case "d2":
              case "d3":
                dxShiftCount++;
                break;
              default:
                break;
            }
          }
        });
    });        
    return {
      aShiftCount: aShiftCount,
      bxShiftCount: bxShiftCount,
      cShiftCount: cShiftCount,
      dxShiftCount: dxShiftCount
    };
  }
  static endSelect(selectedRegion,setSelectedRegion){
    if (selectedRegion.inSelectMode){
      let temp=JSON.parse(JSON.stringify(selectedRegion));
      temp.firstX=-1;
      temp.firstY=-1;
      temp.inSelectMode=false;
      temp.minX=-1;
      temp.minY=-1;
      temp.maxX=-1;
      temp.maxY=-1;
      setSelectedRegion(temp);
    }
  }
  static async fetchAPI(url,method,params){
    console.log("=======================");
    console.log("url="+url);
    console.log("method="+method);
    console.log("params="+params);
    console.log("=======================");
    let requestPara={
      headers:{
        'Content-Type': 'application/json'
      },
      "method":method || 'GET',
    }
    switch (method.toUpperCase()){
      case 'GET':
        const paramsObject = new URLSearchParams(params);
        const queryString = paramsObject.toString();  
        url+="?"+queryString;
        break;
      case 'POST':
        requestPara["body"]=JSON.stringify(params);
        break;
      default:
        break;  
    }
    url="/rosterWeb"+url;
    let response = await fetch(url,requestPara);
    /*
    response.headers.forEach((value,name)=>{
      console.log(name+","+value);
    })
    */
    
    if (response.headers.get('content-disposition')){
      let fileName=response.headers.get('content-disposition').replace("attachment; filename=","").replaceAll("\"","");
      let blob=await response.blob();
      const newBlob = new Blob([blob], { type:response.headers.get('content-type')});
      const objUrl = window.URL.createObjectURL(newBlob);
      let link = document.createElement('a');
      link.href = objUrl;
      link.download = fileName;
      link.click();
    } else {
      let responseObj=await response.json();
      switch (response.status){
        case 401:
          throw new SessionExpiredError(responseObj.message);
          break;
        case 200:
          return responseObj;  
          break;
        default:
          throw new Error(responseObj.message);
          break;  
      }
    }
  }
  static getDuplicateShiftList(monthlyCalendar,rosterList){
    let result={};
    Object.keys(rosterList).forEach(itoId => {
      result[itoId]=[];
    });
    for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
      let tempResult=[];
      Object.keys(rosterList).forEach(itoId => {
        let roster = rosterList[itoId];
        if (roster.shiftList[i+1]){
          let shiftTypeList = roster.shiftList[i+1].split("+");
          shiftTypeList.forEach(shiftType => {
            if (roster.availableShiftList.includes(shiftType)){
              switch (shiftType){
                case "a" :                 
                case "c" :if (tempResult.includes(shiftType)){
                            result[itoId].push(i+1);
                          } else {
                            tempResult.push(shiftType);
                          }
                          break;
                case "b" :
                case "b1":if (tempResult.includes("b")){
                            result[itoId].push(i+1);
                          }else {
                            tempResult.push('b');
                          }
                          break;      
                default:break;          
              }
            }  
          }); 
        }
      });
    }
    return result;
  }    
  static getSystemParam(){
      return this.fetchAPI('/publicAPI/getSystemParam','GET');
  }
  static getVacantShiftList(essentialShift,monthlyCalendar,rosterList){
    let result={};
    for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
      let vacantShift = essentialShift;
      Object.keys(rosterList).forEach(itoId => {
        let roster = rosterList[itoId];
        if (roster.shiftList[i+1]){
          let shiftTypeList = roster.shiftList[i+1].split("+");
          shiftTypeList.forEach(shiftType => {
            if (roster.availableShiftList.includes(shiftType)){
              if (shiftType === "b1") {
                vacantShift = vacantShift.replace("b", "");
              } else {
                vacantShift = vacantShift.replace(shiftType, "");
              }
            }
          });
        }
      });
      result[i]=vacantShift;
    }
    return result;
  }
  static startSelect(theCell,selectedRegion,setSelectedRegion){
    let row=theCell.parentElement;
    let temp=JSON.parse(JSON.stringify(selectedRegion));
    temp.firstX=theCell.cellIndex;
    temp.firstY=row.rowIndex;
    temp.minX=theCell.cellIndex;
    temp.minY=row.rowIndex;
    temp.maxX=theCell.cellIndex;
    temp.maxY=row.rowIndex;
    temp.inSelectMode=true;
    console.log("temp="+JSON.stringify(temp));
    setSelectedRegion(temp);
  }
  static updateSelect(theCell,selectedRegion,setSelectedRegion){
    if (selectedRegion.inSelectMode){
      let cellIndex=theCell.cellIndex;
			let isChanged=false;
			let newMaxX=selectedRegion.maxX,newMinX=selectedRegion.minX;
			let newMaxY=selectedRegion.maxY,newMinY=selectedRegion.minY;
			let row=theCell.parentElement;
			let rowIndex=row.rowIndex;

      if (cellIndex<selectedRegion.firstX)
			{
				newMinX=cellIndex;
				isChanged=true;
			}
			else
			{
				if (cellIndex>selectedRegion.firstX)
				{
					newMaxX=cellIndex;
					isChanged=true;
				}
				else
				{
					newMinX=selectedRegion.firstX;
					newMaxX=selectedRegion.firstX;
					isChanged=true;
				}	
			}
			if (rowIndex>selectedRegion.firstY)
			{
				newMaxY=rowIndex;
				isChanged=true;
			}
			else
			{
				if (rowIndex<selectedRegion.firstY)
				{
					newMinY=rowIndex;
					isChanged=true;
				}
				else
				{
					newMinY=selectedRegion.firstY;
					newMaxY=selectedRegion.firstY;
					isChanged=true;
				}	
			}
      if (isChanged){
        console.log("isChanged=true");
        let temp=JSON.parse(JSON.stringify(selectedRegion))
        temp.minX=newMinX;
				temp.maxX=newMaxX;
				
				temp.minY=newMinY;
			  temp.maxY=newMaxY;
        setSelectedRegion(temp);
      }
    }
  }
  static updateThisMonthBalance(rosterData,itoId){
    let roster=rosterData.rosterList[itoId];
    roster.thisMonthBalance=roster.thisMonthHourTotal+roster.lastMonthBalance;
    rosterData.rosterList[itoId]=roster;
  }
  
}