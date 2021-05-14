export default class UndoableData{
    constructor(initialValue){
        let futureValue=[];
        let pastValue=[];
        this.presentValue=initialValue;

        this.canRedo=()=>(futureValue.length>0);
        this.canUndo=()=>(pastValue.length>0);

        this.redo=()=>{
            console.log('UndoableData:redo');
            if (futureValue.length>0){
                console.log(pastValue);
                pastValue.push(this.presentValue);
                this.presentValue=futureValue.pop();
            }
        }
        this.reset=(newValue)=>{
            console.log('UndoableData:reset');
            futureValue=[];
            pastValue=[];
            this.presentValue=newValue;
        }
        this.set=(newValue)=>{
            console.log('UndoableData:set');
            //console.log('UndoableData:set:newValue='+JSON.stringify(newValue));
            //console.log('UndoableData:set:presentValue='+JSON.stringify(this.presentValue));
            
            pastValue.push(this.presentValue);
            this.presentValue=newValue;
            //console.log('UndoableData:set:pastValue='+JSON.stringify(pastValue));
        }
        this.undo=()=>{
            console.log('UndoableData:undo');
            for (let i=0;i<pastValue.length;i++){
                console.log(pastValue[i]["ITO1_1999-01-01"].rosterList.shiftList[1]);
            }
            if (pastValue.length>0){
                //console.log(pastValue);
                futureValue.push(this.presentValue);
                this.presentValue=pastValue.pop();
            }
        }
    }
}