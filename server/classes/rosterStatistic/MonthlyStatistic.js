class MonthlyStatistic{
    constructor(){
        this.aShiftTotal=0;
        this.bxShiftTotal=0;
        this.cShiftTotal=0;
        this.dxShiftTotal=0;
        this.oShiftTotal=0;

        this.getMonthlyTotal=()=>{
            return (
                this.aShiftTotal+
                this.bxShiftTotal+
                this.cShiftTotal+
                this.dxShiftTotal+
                this.oShiftTotal
            )
        }
    }
}
module.exports=MonthlyStatistic;