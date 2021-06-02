export default class ITO
{
	constructor(){
		/**
		 * The available shift list of the specified ITO.	
		 */
		 this.availableShiftList=[];
		 /**
		  * The black listed shift pattern list of the specified ITO.	
		  */
		 this.blackListedShiftPatternList=[];
		/**
		 * The ITO Id of the specified ITO.
		 */
		this.itoId="";
		/**
		 * The name of the specified ITO.
		 */
		this.itoName="";
		/**
		 * The join date of the specified ITO.
		 */
		this.joinDate=null;
		/**
		 * The leave date of the specified ITO.
		 */
		this.leaveDate=null;
		/**
		 * The post name of the specified ITO
		 */
		this.postName="";
		/**
		 * The total no. of working hour per day for the specified ITO.
		 */
		this.workingHourPerDay=0.0;
		this.isBlackListedShiftPattern=(shiftPattern)=>{
			let result=false;
			//console.log(this.itoId,this.blackListedShiftPatternList,shiftPattern,this.blackListedShiftPatternList.includes(shiftPattern));
			for (let i=0;i<this.blackListedShiftPatternList.length;i++){
				//console.log(this.itoId,this.blackListedShiftPatternList[i],shiftPattern,shiftPattern.indexOf(this.blackListedShiftPatternList[i]));
				if (shiftPattern.indexOf(this.blackListedShiftPatternList[i])>-1){
					result=true;
					return result;
				}
			}
			return result;
		}
	}	
}