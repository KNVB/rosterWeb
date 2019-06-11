<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/javascript; charset=UTF-8" pageEncoding="UTF-8"%>
class Utility
{
	constructor()
	{
		this.monthNames={1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"};
	}
	buildPreviousMonthShiftCells(rosterRowData,rosterTable,row)
	{
		var cell=new BorderCell(),i;
		cell.innerHTML=rosterRowData.itoName+"<br>"+rosterRowData.itoPostName+" Extn. 2458";
		row.appendChild(cell);
		
		for (i=0;i<rosterRowData.previousMonthShiftList.length;i++)
		{
			cell=new ReadOnlyShiftCell(rosterTable);
			cell.setShiftType(rosterRowData.previousMonthShiftList[i]);
			row.appendChild(cell);
		}
	}
	buildRosterRowData(rosterRule,rosterRowData,rosterTable)
	{
		var result={};
		var aShiftCount=0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0,balance=0.0;
		var	actualWorkingHour=0.0,thisMonthHourTotal=0.0,thisMonthBalance=0.0,totalHour=0.0;
		var i,previousMonthShiftIndex=Object.keys(rosterRowData.previousMonthShiftList).length-rosterTable.showNoOfPrevDate+1;
		var previousMonthShiftList=[],shiftList=[],shiftType;
		result["itoName"]=rosterRowData.itoname;
		result["itoPostName"]=rosterRowData.itopostName;
		for (i=previousMonthShiftIndex;i<=Object.keys(rosterRowData.previousMonthShiftList).length;i++)
		{
			previousMonthShiftList.push(rosterRowData.previousMonthShiftList[i]);
		}
		result["previousMonthShiftList"]=previousMonthShiftList;
		Object.keys(rosterRowData.shiftList).forEach(function(key){
			shiftType=rosterRowData.shiftList[key];
			shiftList[key-1]=shiftType;
			actualWorkingHour+=rosterRule.shiftHourCount[shiftType];
			switch(shiftType)
					{
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
					}
		});
		result["shiftList"]=shiftList;
		totalHour=rosterRowData.itoworkingHourPerDay*rosterTable.noOfWorkingDay;
		thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=thisMonthHourTotal+rosterRowData.lastMonthBalance;
		
		result["totalHour"]=this.roundTo(totalHour,2);
		result["actualHour"]=this.roundTo(actualWorkingHour,2);
		result["lastMonthBalance"]=this.roundTo(rosterRowData.lastMonthBalance,2);
		result["thisMonthHourTotal"]=this.roundTo(thisMonthHourTotal,2);
		result["thisMonthBalance"]=this.roundTo(thisMonthBalance,2);
		result["aShiftCount"]=aShiftCount;
		result["bxShiftCount"]=bxShiftCount;
		result["cShiftCount"]=cShiftCount;
		result["dxShiftCount"]=dxShiftCount;
		result["noOfWoringDay"]=aShiftCount+bxShiftCount+cShiftCount+dxShiftCount;
		
		return result;
	}
	buildShiftCountCell(rosterRowData,row)
	{
		var cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_totalHour";
		cell.textContent=rosterRowData.totalHour;
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_actualHour";
		cell.textContent=rosterRowData.actualHour;
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_lastMonthBalance";
		cell.textContent=rosterRowData.lastMonthBalance;
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_thisMonthHourTotal";
		cell.textContent=rosterRowData.thisMonthHourTotal;
		row.appendChild(cell);

		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_thisMonthBalance";
		cell.textContent=rosterRowData.thisMonthBalance;
		row.appendChild(cell);

		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_aShiftCount";
		cell.textContent=rosterRowData.aShiftCount;
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_bxShiftCount";
		cell.textContent=rosterRowData.bxShiftCount;
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_cShiftCount";
		cell.textContent=rosterRowData.cShiftCount;
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_dxShiftCount";
		cell.textContent=rosterRowData.dxShiftCount;
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id=rosterRowData.itoId+"_noOfWoringDay";
		cell.textContent=rosterRowData.noOfWoringDay;
		row.appendChild(cell);
		
	}
	getDateList(year,month)
	{
		return jQuery.ajax({"url": "<%=request.getContextPath()%>/getDateList.jsp",
							data:{"year":year,"month":month},
							method:"POST",
							dataType:"json",
							error: function(xhr) {
							      console.log('error', xhr);
							    }
		});
	}
	getRosterList(year,month)
	{
		return jQuery.ajax({"url": "<%=request.getContextPath()%>/getRosterList.jsp",
							data:{"year":year,"month":month},
							method:"POST",
							dataType:"json",
							error: function(xhr) {
							      console.log('error', xhr);
							    }
		});
	}	
	getShiftCssClassName(shiftType)
	{
		var className="";
    	switch (shiftType)
    	{
			case "a":
					className="aShiftColor";
					break;	
			case "b":
			case "b1":
					className="bShiftColor";
					break;
			case "c":
					className="cShiftColor";
					break;
			case "d":
			case "d1":
			case "d2":
			case "d3":
					 className="dShiftColor";
					 break;
			case  "O":
					 className="oShiftColor";
					 break;
    	}
    	return className;
	}	
	roundTo(theValue,decPlace)
	{
		var result=theValue*Math.pow(10,decPlace);
		result=Math.round(result);
		result=result/Math.pow(10,decPlace);
		return result;
	}
	showAjaxErrorMessage(jqXHR, textStatus, errorThrown)
	{
		alert(jqXHR,textStatus);
	}
}