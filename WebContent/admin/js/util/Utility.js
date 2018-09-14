/**
 * 
 */
class Utility
{
	constructor()
	{
		
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
	getDateDiffInDay(date1,date2)
	{
		var time1=date1.UTC();
		var time2=date2.UTC();
		return (time1-time2)/86400000;
	}
	//Get the mean value for the incoming array of value;
	getMean(data)
	{
		 return data.reduce(function (a, b) {
		        return Number(a) + Number(b);
		    }) / data.length;
	}
	getRosterRule(year,month)
	{
		var requestParameters={"year":year,"month":month}; 
		return jQuery.ajax({"url": "getRosterRule.jsp",
					 dataType: 'json',
					 data:requestParameters,
					 error:this.showAjaxErrorMessage
		});
	}
	getRosterData(year,month)
	{
		var requestParameters={"year":year,"month":month}; 
		return jQuery.ajax({"url": "getRoster.jsp",
					 dataType: 'json',
					 data:requestParameters,
					 error:this.showAjaxErrorMessage
		});
	}
	//Get The Standard Deviation for the incoming array of value;
	getSD(data)
	{
	    var m =this.getMean(data);
	    return Math.sqrt(data.reduce(function (sq, n) {
	            return sq + Math.pow(n - m, 2);
	        }, 0) / (data.length - 1));
	};
	
	getYearlyRosterStatistic(year,month)
	{
		var requestParameters={"year":year,"month":month};
		return jQuery.ajax({"url": "getYearlyRosterStatistic.jsp",
			 dataType: 'json',
			 data:requestParameters,
			 error:this.showAjaxErrorMessage
		});
	}
	saveRosterData(rosterData)
	{
		return jQuery.ajax({"url": "saveRosterData.jsp",
			 dataType: 'text',
			 data:JSON.stringify(rosterData),
			 method:"POST",
			 error:this.showAjaxErrorMessage
		});
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
		console.log(jqXHR,textStatus);
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
//------------------------------------------------------------------------------------------------------------------------------------	
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