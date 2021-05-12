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
            pastValue.push(this.presentValue);
            this.presentValue=newValue;
        }
        this.undo=()=>{
            console.log('UndoableData:undo');
            if (pastValue.length>0){
                futureValue.push(this.presentValue);
                this.presentValue=pastValue.pop();
            }
        }
    }
}