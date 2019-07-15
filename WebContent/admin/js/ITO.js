/*==============================================================================================*
 *																				  				*
 *	It denote an ITO object/record.													            *
 *																				  				*
 *==============================================================================================*/

class ITO
{
	constructor()
	{
		this.name;						//The ITO name.
		this.itoId;						//The ITO Id.
		this.postName;					//The ITO post name.
		this.workingHourPerDay;			//The no. of working hour per day for the specified ITO.
		this.availableShiftList;		//The available shift list for the specified ITO.
		this.blackListShiftPatternList;	//The black list shift pattern list for the specified ITO.
		this.joinDate;					//The join date for the specified ITO.
		this.leaveDate;					//The leave date for the specified ITO (2099/12/31 mean the active ITO).
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It returns a list of black listed shift pattern index for the given shift pattern           *
	 *																				  				*
	 *==============================================================================================*/
	getBlackListedShiftPatternIndex(shiftPattern)
	{
		var myRe,temp;
		var index=new Array(),match;
		var blackListShiftPattern,commaPattern = /,/g;
		
		for (var i in this.blackListShiftPatternList)
		{
			blackListShiftPattern=this.blackListShiftPatternList[i];
			//console.log(this.itoId,shiftPattern,blackListShiftPattern);
			myRe= new RegExp(blackListShiftPattern, 'gi');
			while ((match = myRe.exec(shiftPattern))!=null)
			{
				temp=shiftPattern.substring(0, match.index);
				if (temp=="")
					index.push(1);
				else
					index.push(temp.match(commaPattern).length+1);
			}	
		}
		//console.log(this.itoId,shiftPattern,index);
		return index;
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It check whether the given shift list is a valid for the specified ITO.				        *
	 *																				  				*
	 *==============================================================================================*/
	isValidShift(shiftListString)
	{
		var self=this;
		var result=true;
		var shiftList=shiftListString.split("\+");
		shiftList.forEach(function(shift){
			if ($.inArray (shift,self.availableShiftList)==-1)
			{
				result=false;
			}	
		});
		return result;
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It check whether the given preferred shift list is a valid for the specified ITO.	        *
	 *																				  				*
	 *==============================================================================================*/
	isValidPreferredShift(preferredShift)
	{
		var self=this;
		var isMatched=false;
		switch (preferredShift)
		{
			case "":
			case "o":
			case "al":
						isMatched=true;
						break;
			default:
					for (var i=0;i<this.availableShiftList.length;i++)
					{
						if ((this.availableShiftList[i]==preferredShift)|| (preferredShift==("n"+this.availableShiftList[i])))
						{	
							isMatched=true;
							break;
						}
					}
		}
		return isMatched;
	}
}