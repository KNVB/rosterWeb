/**
 * 
 */
class Utility
{
	constructor()
	{
		
	}
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
	showAjaxErrorMessage(jqXHR, textStatus, errorThrown)
	{
		console.log(jqXHR,textStatus);
	}
	standardDeviation(values){
		  var avg = this._average(values);
		  
		  var squareDiffs = values.map(function(value){
		    var diff = value - avg;
		    var sqrDiff = diff * diff;
		    return sqrDiff;
		  });
		  var avgSquareDiff = this._average(squareDiffs);

		  var stdDev = Math.sqrt(avgSquareDiff);
		  return stdDev;
	}
	_average(data){
		  var sum = data.reduce(function(sum, value){
		    return sum + value;
		  }, 0);

		  var avg = sum / data.length;
		  return avg;
		}
}