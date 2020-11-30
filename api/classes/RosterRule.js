class RosterRule{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let dboObj=new DBO();
		this.essentialShiftList=null;	
		this.maxConsecutiveWorkingDay=0;
		this.shiftHourCount={};		
		dboObj.getRosterRule((err,resultList)=>{
			if (err){
				throw err;
			}else {
				resultList.forEach(result=>{
					switch (result.rule_type){
						case 'ConsecutiveWorkingDay':
							this.maxConsecutiveWorkingDay=parseInt(result.rule_value);
							break;
						case 'shiftHour':
							this.shiftHourCount[result.rule_key]=parseFloat(result.rule_value);
							break;
						case 'shiftList':
							var temp=result.rule_value.replace(/"/g,'');
							this.essentialShiftList=temp.split(',');
							break;
					}
				});
			}
		});
		
	}
}
module.exports =new RosterRule();