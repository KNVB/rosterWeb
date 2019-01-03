class AdminUtility  extends Utility
{
	constructor()
	{
		super();
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

}