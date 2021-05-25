class ITO
{
	constructor(){
		/**
		 * The ITO Id of the specified ITO.
		 */
		this.itoId="";
		/**
		 * The name of the specified ITO.
		 */
		this.itoName="";
		/**
		 * The post name of the specified ITO
		 */
		this.postName="";
	
		/**
		 * The total no. of working hour per day for the specified ITO.
		 */
		this.workingHourPerDay=0.0;
		/**
		 * The join date of the specified ITO.
		 */
		this.joinDate=null;
		/**
		 * The leave date of the specified ITO.
		 */
		this.leaveDate=null;
		/**
		 * The available shift list of the specified ITO.	
		 */
		this.availableShiftList=[];
		/**
		 * The black listed shift pattern list of the specified ITO.	
		 */
		this.blackListedShiftPatternList=[];
	}	
}
module.exports = ITO;