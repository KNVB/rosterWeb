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
                /*
                let temp=JSON.parse(JSON.stringify(this.pastValue));
                temp.push(JSON.parse(JSON.stringify(this.presentValue)));
                let currentValue=JSON.parse(JSON.stringify(this.futureValue.pop()));
                this.pastValue=JSON.parse(JSON.stringify(temp));
                this.presentValue=JSON.parse(JSON.stringify(currentValue));
                */
            }
        }
        this.reset=()=>{
            console.log('UndoableData:reset');
        }
        this.set=(newValue)=>{
            console.log('UndoableData:set');
            this.pastValue.push(this.presentValue);
            this.presentValue=newValue;
            /*
            let temp=JSON.parse(JSON.stringify(this.pastValue));
            temp.push(JSON.parse(JSON.stringify(this.presentValue)));
            this.pastValue=JSON.parse(JSON.stringify(temp));
            this.presentValue=JSON.parse(JSON.stringify(newValue));
            */
        }
        this.undo=()=>{
            console.log('UndoableData:undo');
            if (this.pastValue.length>0){
                this.futureValue.push(this.presentValue);
                this.presentValue=this.pastValue.pop();
                /*
                let temp=JSON.parse(JSON.stringify(this.futureValue));
                temp.push(JSON.parse(JSON.stringify(this.presentValue)));
                let currentValue=JSON.parse(JSON.stringify(this.pastValue.pop()));                  
                
                this.futureValue=JSON.parse(JSON.stringify(temp));
                this.presentValue=JSON.parse(JSON.stringify(currentValue));
                */
            }
        }
    }
}