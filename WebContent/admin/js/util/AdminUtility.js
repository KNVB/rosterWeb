class AdminUtility  extends Utility
{
	constructor()
	{
		super();
	}
	//Clone Array only
	cloneArray(inArray) 
	{
	 return inArray.map(value => {
	    return (value);
	    //console.log(after,obj);
	  });
	}
	exportRosterToExcel(rosterData)
	{
		return jQuery.ajax({"url": "exportRosterToExcel.jsp",
			data:JSON.stringify(rosterData),
			method:"POST",
			dataType: 'binary',
			xhrFields: {
		            responseType: 'blob'
		        },
			success:function(blob, status, request){
						  var fileName=(request.getResponseHeader("Content-Disposition"));
						  fileName=fileName.substr(fileName.indexOf("filename=")+"filename=".length);
					      var link=document.createElement('a');
					      link.href=window.URL.createObjectURL(blob);
					      link.download=fileName;
					      link.click();
					 },   
			error:this.showAjaxErrorMessage			 
		});
	}
	getAllITOInfo()
	{
		var self=this;
		var jsITOList={};
		return new Promise((resolve, reject) =>{
			jQuery.ajax({"url": "getAllITOInfo.jsp",
				data:{},
				method:"POST",
				dataType:"json",
				success:function(itoList){
					var jsITO,ito;
					for (var itoId in itoList)
					{
						ito=itoList[itoId];
						jsITO=new ITO();
						jsITO.itoId=itoId;
						jsITO.name=ito.name;
						jsITO.postName=ito.postName;
						jsITO.workingHourPerDay=ito.workingHourPerDay;
						jsITO.availableShiftList=ito.availableShiftList;
						jsITO.blackListShiftPatternList=ito.blackListedShiftPatternList;
						
						jsITO.joinDate=new Date(ito.joinDate.year,ito.joinDate.monthValue-1,ito.joinDate.dayOfMonth);
						jsITO.leaveDate=new Date(ito.leaveDate.year,ito.leaveDate.monthValue-1,ito.leaveDate.dayOfMonth);	
						jsITOList[itoId]=jsITO;
					}
					resolve(jsITOList);
				},
				error: function(xhr) {
				      console.log('error', xhr);
				      reject();
				}
			});
		});	
	}
	getITOList(year,month)
	{
		var jsITOList={};
		return new Promise((resolve, reject) =>{
			jQuery.ajax({"url": "getITOList.jsp",
				data:{"year":year,"month":month},
				method:"POST",
				dataType:"json",
				success:function(itoList){
					var jsITO,ito;
					for (var itoId in itoList)
					{
						ito=itoList[itoId];
						jsITO=new ITO();
						jsITO.itoId=itoId;
						jsITO.name=ito.name;
						jsITO.postName=ito.postName;
						jsITO.workingHourPerDay=ito.workingHourPerDay;
						jsITO.availableShiftList=ito.availableShiftList;
						jsITO.blackListShiftPatternList=ito.blackListedShiftPatternList;
						
						jsITO.joinDate=new Date(ito.joinDate.year,ito.joinDate.monthValue-1,ito.joinDate.dayOfMonth);
						jsITO.leaveDate=new Date(ito.leaveDate.year,ito.leaveDate.monthValue-1,ito.leaveDate.dayOfMonth);	
						jsITOList[itoId]=jsITO;
					}
					resolve(jsITOList);
				},
				error: function(xhr) {
				      console.log('error', xhr);
				      reject();
				}
			});
		});
	}

	getPreferredShiftList(rosterYear,rosterMonth)
	{
		return jQuery.ajax({"url": "getPreferredShiftList.jsp",
			data:{"year":rosterYear,"month":rosterMonth},
			method:"POST",
			dataType:"json",
			error: function(xhr) {
			      console.log('error', xhr);
			    }
		});
	}
	//Get the mean value for the incoming array of value;
	getMean(data)
	{
		 return data.reduce(function (a, b) {
		        return Number(a) + Number(b);
		    }) / data.length;
	}
	//Get The Standard Deviation for the incoming array of value;
	getSD(data)
	{
	    var m =this.getMean(data);
	    return Math.sqrt(data.reduce(function (sq, n) {
	            return sq + Math.pow(n - m, 2);
	        }, 0) / (data.length - 1));
	}
	getYearlyStatistic(rosterYear,rosterMonth)
	{
		return jQuery.ajax({"url": "getYearlyStatistic.jsp",
			data:{"year":rosterYear,"month":rosterMonth},
			method:"POST",
			dataType:"json",
			error: function(xhr) {
			      console.log('error', xhr);
			    }
		});
	}
	saveRosterData(rosterData)
	{
		//console.log(rosterData);
		return jQuery.ajax({"url": "saveRosterData.jsp",
			 dataType: 'text',
			 data:JSON.stringify(rosterData),
			 method:"POST",
			 error:this.showAjaxErrorMessage
		});
	}
	shuffleProperties(obj)
	{
		var new_obj = {};
	    var keys = this._getKeys(obj);
	    this._shuffle(keys);
        for (var key in keys){
            if (key == "shuffle") continue; // skip our prototype method
            new_obj[keys[key]] = obj[keys[key]];
        }
        return new_obj;	
	}
/*==============================================================================================*
 *																				  				*
 *	Private Method																				*
 *																				  				*
 *==============================================================================================*/
	_getKeys(obj)
	{
        var arr = new Array();
        for (var key in obj)
            arr.push(key);
        return arr;
    }	
	_shuffle(arr)
    {
    	for (var i = 0; i < arr.length; i++){
            var a = arr[i];
            var b = Math.floor(Math.random() * arr.length);
            arr[i] = arr[b];
            arr[b] = a;
        }
    }	
}