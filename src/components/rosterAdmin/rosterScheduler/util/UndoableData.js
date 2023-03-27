export default class UndoableData {
    constructor(initialValue) {
        let futureValue = [];
        let pastValue = [];
        console.log('UndoableData:init');
        /***********************************************************
         * if the input parameter is an object, the outside function 
         * can modify the inside variable value, to get ride of
         * this problem, just the store the input parameter in
         * string format
        **************************************************/
        let presentValue = JSON.stringify(initialValue);
        this.canRedo = () => (futureValue.length > 0);
        this.canUndo = () => (pastValue.length > 0);

        this.redo = () => {
            console.log('UndoableData:redo:' + this.canRedo());
            if (futureValue.length > 0) {
                pastValue.push(presentValue);
                presentValue = futureValue.pop();
                return JSON.parse(presentValue);
            }
        }
        this.reset = (newValue) => {
            console.log('UndoableData:reset');
            futureValue = [];
            pastValue = [];
            this.presentValue = JSON.stringify(newValue);
        }
        this.set = (newValue) => {
            pastValue.push(presentValue);
            presentValue = JSON.stringify(newValue);
        }
        this.undo = () => {
            console.log('UndoableData:undo:' + this.canUndo());
            if (pastValue.length > 0) {
                futureValue.push(presentValue);               
                presentValue=pastValue.pop();
                return JSON.parse(presentValue);
            }
        }
    }
}