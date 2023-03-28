export default class AutoPlannerUtil {
    constructor(){
        let iterationCount=100;
        let startDate=1,endDate;
        this.autoPlan=(rosterDataUtil)=>{

        }
        this.getIterationCount=()=>{
            return iterationCount;
        }
        this.getEndDate=()=>{
            return endDate;
        }
        this.getStartDate=()=>{
            return startDate;
        }        
        this.setEndDate=e=>{
            endDate=e;
        }
        this.setIterationCount=(newCount)=>{
            iterationCount=newCount;
        }
        this.setStartDate=s=>{
            startDate=s;
        }
    }
}