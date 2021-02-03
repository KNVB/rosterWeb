class RosterParam{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let dboObj=new DBO();
		this.essentialShiftList=null;	
		this.maxConsecutiveWorkingDay=0;
        this.monthSelectorMinDate={};
        this.noOfPrevDate=0;
        this.shiftHourCount={};

        dboObj.getRosterParam()
        .then(resultList=>{
            resultList.forEach(result=>{
                switch (result.param_type){
                    case 'ConsecutiveWorkingDay':
                        this.maxConsecutiveWorkingDay=parseInt(result.param_value);
                        break;
                    case 'monthSelector':
                        this.monthSelectorMinDate=JSON.parse(result.param_value);
                        break;
                    case 'shiftHour':
                        this.shiftHourCount[result.param_key]=parseFloat(result.param_value);
                        break;
                    case 'shiftList':
                        let temp=result.param_value.replace(/"/g,'');
                        this.essentialShiftList=temp.split(',');
                        break;
                    case 'tables':
                        this.noOfPrevDate=parseInt(result.param_value);
                        break;
                    default:
                        break;    
                }
            })
            console.log("Get Roster Parameter successfully!");
        })
        .catch(err=>{
            console.log("Some wrong when getting Roster Parameter:"+err);
        })
        .finally(()=>{
            dboObj.close();
        });
    }
}
module.exports =new RosterParam();        