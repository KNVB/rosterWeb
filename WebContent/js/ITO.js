class ITO
{
	constructor()
	{
		this.name;
		this.itoId;
		this.postName;
		this.workingHourPerDay;
		this.availableShiftList;
		this.blackListShiftPatternList;
	}
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
	isValidShift(shift)
	{
		//return (this.availableShift.includes(shift));
		return ($.inArray (shift,this.availableShiftList)>-1)
	}
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