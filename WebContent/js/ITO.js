class ITO
{
	constructor()
	{
		this.name;
		this.itoId;
		this.postName;
		this.availableShift;
		this.workingHourPerDay;
		this.blackListShiftPatternList;
	}
	isValidShift(shift)
	{
		//return (this.availableShift.includes(shift));
		return ($.inArray (shift,this.availableShift)>-1)
	}
	isValidShiftRequirement(shiftRequirement)
	{
		var self=this;
		var isMatched=false;
		switch (shiftRequirement)
		{
			case "":
			case "o":
			case "al":
						isMatched=true;
						break;
			default:
					for (var i=0;i<this.availableShift.length;i++)
					{
						if ((this.availableShift[i]==shiftRequirement)|| (shiftRequirement==("n"+this.availableShift[i])))
						{	
							isMatched=true;
							break;
						}
					}
		}
		return isMatched;
	}
	getBlackListedShiftPatternIndex(shiftPattern)
	{
		var myRe,temp;
		var index=new Array(),match;
		var blackListShiftPattern,commaPattern = /,/g;
		
		for (var i in this.blackListShiftPatternList)
		{
			blackListShiftPattern=this.blackListShiftPatternList[i];
			//console.log(shiftPattern,blackListShiftPattern);
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
		return index;
	}
}