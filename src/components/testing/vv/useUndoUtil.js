import {useReducer} from "react";
export default function useUndoUtil(initialValue){
  let initialState= {
    futureValue:[],
    pastValue:[],
    presentValue: initialValue
  }  
  function dataReducer(state, action){
    switch (action.type) {
      case "redo":
                  if (state.futureValue.length>0){
                    let temp=JSON.parse(JSON.stringify(state.pastValue));
                    temp.push(JSON.parse(JSON.stringify(state.presentValue)));
                    let presentValue=JSON.parse(JSON.stringify(state.futureValue.pop()));
                    return {
                      futureValue:state.futureValue,
                      pastValue:temp,
                      presentValue:presentValue
                    }
                  }else {
                    return state;
                  }
      case 'reset':
                  return {
                    futureValue:[],
                    pastValue:[],
                    presentValue:JSON.parse(JSON.stringify(action.value))
                  }
      case "set":
                console.log("set");            
                let temp=JSON.parse(JSON.stringify(state.pastValue));
                temp.push(JSON.parse(JSON.stringify(state.presentValue)));
                return {
                  futureValue:state.futureValue,
                  pastValue:temp,
                  presentValue:JSON.parse(JSON.stringify(action.value))
                }
      case 'undo':
                console.log("undo");                
                if (state.pastValue.length>0){
                  let temp=JSON.parse(JSON.stringify(state.futureValue));
                  temp.push(JSON.parse(JSON.stringify(state.presentValue)));
                  let currentValue=JSON.parse(JSON.stringify(state.pastValue.pop()));                  
                  return{
                    futureValue:temp,
                    pastValue:state.pastValue,
                    presentValue:currentValue  
                  }
                }else {
                  return state;
                }                
      default: return state;
    }
  }

  function redo(){
    dispatch({ type: 'redo'});
  }
  function reset(newValue){
    dispatch({ type: 'reset',value:newValue });
  }
  function set(newValue){
    dispatch({ type: 'set',value:newValue });
  }
  function undo(){
    dispatch({ type: 'undo'});
  }
  const [state, dispatch] = useReducer(dataReducer,initialState);
  let canRedo=(state.futureValue.length>0);
  let canUndo=(state.pastValue.length>0);
  let futureValue=state.futureValue;
  let pastValue=state.pastValue;
  let presentValue=state.presentValue;
  
  return {futureValue,pastValue,presentValue,canRedo,canUndo,redo,reset,set,undo,}
}