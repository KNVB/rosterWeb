class RosterRule{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let dboObj=new DBO();
		this.essentialShiftList=null;	
		this.maxConsecutiveWorkingDay=0;
        this.shiftHourCount={};

        dboObj.getRosterRule()
        .then(resultList=>{
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
                    default:
                        break;    
                }
            })
            console.log("Get Roster Rule successfully!");
        })
        .catch(err=>{
            console.log("Some wrong when getting Roster Rule:"+err);
        })
        .finally(()=>{
            dboObj.close();
        });
    }
}
module.exports =new RosterRule();        