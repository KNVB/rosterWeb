export default class UndoableData{
    constructor(initialValue){
        this.futureValue=[];
        this.pastValue=[];
        this.presentValue=initialValue;

        this.canRedo=()=>(this.futureValue.length>0);
        this.canUndo=()=>(this.pastValue.length>0);

        this.redo=()=>{
            console.log('UndoableData:redo');
            if (this.futureValue.length>0){
                console.log(this.pastValue);
                this.pastValue.push(this.presentValue);
                this.presentValue=this.futureValue.pop();
            }
        }
        this.reset=(newValue)=>{
            console.log('UndoableData:reset');
            this.futureValue=[];
            this.pastValue=[];
            this.presentValue=newValue;
        }
        this.set=(newValue)=>{
            console.log('UndoableData:set');
            this.pastValue.push(this.presentValue);
            this.presentValue=newValue;
        }
        this.undo=()=>{
            console.log('UndoableData:undo');
            if (this.pastValue.length>0){
                this.futureValue.push(this.presentValue);
                this.presentValue=this.pastValue.pop();
            }
        }
    }
}