class RosterRule{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let dboObj=new DBO();
		//let result=await dboObj.getRosterRule();
		this.essentialShiftList=null;	
		this.maxConsecutiveWorkingDay=0;
		this.shiftHourCount={};		
		dboObj.getRosterRule()
		.then(resultList=>{
			//console.log(resultList);
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
		})
		.catch(error=>{
			throw error;
		});
	}
}
module.exports =new RosterRule();