class SystemParam{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let dboObj=new DBO();        
		this.maxConsecutiveWorkingDay=0;
        this.monthSelectorMinDate={};
        this.noOfPrevDate=0;
        this.shiftHourCount={};

        dboObj.getSystemParam()
        .then(resultList=>{
            resultList.forEach(result=>{
                switch (result.param_type){
                    case 'ConsecutiveWorkingDay':
                        this.maxConsecutiveWorkingDay=parseInt(result.param_value);
                        break;
                    case 'monthSelector':
                        this.monthSelectorMinDate=JSON.parse(result.param_value);
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
            console.log("Some wrong when getting System Parameter:"+err);
        })
        .finally(()=>{
            dboObj.close();
        });

    }
}
module.exports =new SystemParam();