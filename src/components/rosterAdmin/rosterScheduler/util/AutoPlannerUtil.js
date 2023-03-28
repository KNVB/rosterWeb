export default class AutoPlannerUtil {
    constructor(){
        let rosterDataUtil;
        let iterationCount=100;
        let startDate=1,endDate;
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
        this.setRosterDataUtil=inRosterDataUtil=>{
            rosterDataUtil=inRosterDataUtil;
        }
        this.setStartDate=s=>{
            startDate=s;
        }
    }
}