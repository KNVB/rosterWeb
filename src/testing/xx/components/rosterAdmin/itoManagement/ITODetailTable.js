import {useCallback, useEffect,useReducer} from 'react';
import moment from "moment";
export default function ITODetailTable (props){
    let addBlackListShiftPattern=e=>{
        updateFormObject({
            type:'addBlackListShiftPattern'
        });
    }

    let buildASOptionList=useCallback((availableShiftList)=>{
        let newASOptionList=[];
        Object.keys(props.activeShiftInfoList).forEach(key=>{
            if ((key !== "essentialShift") &&(key !== "s")){
                let checked =availableShiftList.includes(key)
                newASOptionList.push(
                    <div className="align-items-center d-flex flex-row flex-grow-1 justify-content-center" key={key}>
                        <span>{key}</span>
                        <input checked={checked} name="availableShift" onChange={handleChange} type="checkbox" value={key}/>
                    </div>
                )
            }
        });
        return newASOptionList;
    },[props.activeShiftInfoList]);
    
    let buildBSOptionList=useCallback((blackListedShiftPatternList)=>{
        return Object.entries(blackListedShiftPatternList).map(([index,blackListShiftPattern])=>(
                <div key={"blackList_"+index}>
                    <input 
                        className="w-75"
                        data-index={index}
                        name="blackShiftPattern"
                        onChange={handleChange}
                        pattern=".*(?<!,)$"
                        required
                        type="text" 
                        value={blackListShiftPattern}/>
                        <span className="cursor-pointer" onClick={()=>removeBlackListShiftPattern(index)}>&#10060;</span>
                </div>
            )
        );
    },[]);

    let handleChange=e=>{
        let itemName=e.target.name;
        switch(itemName){
            case "availableShift":
                updateFormObject({
                    type:"availableShift",
                    value:{
                        checked:e.target.checked,
                        shiftType:e.target.value
                    }
                });
                break;
            case "blackShiftPattern":
                updateFormObject({
                    type:'blackShiftPattern',
                    value:{
                        index:e.target.dataset.index,
                        blackShiftPattern:e.target.value
                    }
                })
                break
            case "workingHourPerDay":
                let value=e.target.value;
                if (value!==''){
                    updateFormObject({
                        type:e.target.name,
                        value:+value
                    });
                } else {
                    updateFormObject({
                        type:e.target.name,
                        value:value
                    });
                }
                break
            default:
                updateFormObject({
                    type:e.target.name,
                    value:e.target.value
                });
        }
    }

    let handleSubmit=(e)=>{
        e.preventDefault();
        //console.log(formObject);
        
    }

    let reducer=(state,action)=>{
        let bsList=[];
        switch (action.type){
            case 'addBlackListShiftPattern':
                let temp1=JSON.parse(JSON.stringify(state.selectedITO));
                temp1.blackListedShiftPatternList.push('');
                console.log(temp1.blackListedShiftPatternList.length);
                return {
                    ...state,
                    ito:temp1,
                    bsOptionList:buildBSOptionList(temp1.blackListedShiftPatternList)
                };
            case "availableShift":
                let asList=[];
                if (action.value.checked){
                    asList=JSON.parse(JSON.stringify(state.selectedITO.availableShiftList));
                    asList.push(action.value.shiftType);
                }else {
                    state.selectedITO.availableShiftList.forEach(shift=>{
                        if (shift!==action.value.shiftType){
                            asList.push(shift);
                        }
                    });
                }
                let temp2={...state,asOptionList:buildASOptionList(asList)};
                temp2.selectedITO.availableShiftList=asList;
                return temp2;
            case "blackShiftPattern":
                bsList=JSON.parse(JSON.stringify(state.selectedITO.blackListedShiftPatternList));
                bsList[action.value.index]=action.value.blackShiftPattern;
                let temp3={...state,bsOptionList:buildBSOptionList(bsList)};
                temp3.selectedITO.blackListedShiftPatternList=bsList;
                return temp3;
            case 'initFormObject':
                return action.value;
            case 'removeBlackListShiftPattern':
                let temp4=JSON.parse(JSON.stringify(state.selectedITO));
                temp4.blackListedShiftPatternList=[];
                for (let i = 0 ;i < state.selectedITO.blackListedShiftPatternList.length; i++){
                    if (i!==action.value){
                        temp4.blackListedShiftPatternList.push(state.selectedITO.blackListedShiftPatternList[i]);
                    }
                }
                return {
                    ...state,
                    bsOptionList:buildBSOptionList(temp4.blackListedShiftPatternList),
                    selectedITO:temp4
                }
            default:
                let ito={...state.selectedITO};
                ito[action.type]=action.value;
                return {
                    selectedITO:ito,
                    asOptionList:buildASOptionList(ito.availableShiftList),
                    bsOptionList:buildBSOptionList(ito.blackListedShiftPatternList),
                    joinDateValue:moment(ito.joinDate).format('YYYY-MM-DD'),
                    leaveDateValue:moment(ito.leaveDate).format('YYYY-MM-DD'),
                }                
        }
        
    }
    let removeBlackListShiftPattern=(index)=>{
        updateFormObject({
            type:'removeBlackListShiftPattern',
            value:+index
        });
    }
    useEffect(()=>{
        let ito=props.ito;
        updateFormObject({
            type:'initFormObject',
            value:{
                selectedITO:ito,
                asOptionList:buildASOptionList(ito.availableShiftList),
                bsOptionList:buildBSOptionList(ito.blackListedShiftPatternList),
                joinDateValue:moment(ito.joinDate).format('YYYY-MM-DD'),
                leaveDateValue:moment(ito.leaveDate).format('YYYY-MM-DD'),
            }
        })
    },[props.ito, buildASOptionList, buildBSOptionList]);
    const [formObject, updateFormObject] = useReducer(reducer);
    return(
        <form 
            className="d-flex flex-column flex-grow-1 justify-content-center"
            onSubmit={handleSubmit}>
            {formObject && 
                <table className="itoDetailTable">
                    <tbody>
                        <tr>
                            <td>ITO Name</td>
                            <td>
                                <input 
                                    name="itoName" 
                                    onChange={handleChange} 
                                    required 
                                    type="text"
                                    value={formObject.selectedITO.itoName}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Post Name</td>
                            <td>
                                <input 
                                    name="postName"
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    value={formObject.selectedITO.postName}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Available Shift Type</td>
                            <td>
                                <div className="d-flex w-75 flex-row justify-content-center">
                                    {formObject.asOptionList}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Black Listed Shift Type</td>
                            <td>
                                <div className="align-items-center border d-flex flex-grow-1 flex-row justify-content-around p-1">
                                    <div className="d-flex flex-column flex-grow-1">
                                        {formObject.bsOptionList}
                                    </div>
                                    <div className="d-flex flex-grow-1 justify-content-start">	
                                        <div className="cursor-pointer" onClick={addBlackListShiftPattern}>&#10133;</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>No. of Working Hour Per Day</td>
                            <td><input type="number" onChange={handleChange} step="0.01" name="workingHourPerDay" required value={formObject.selectedITO.workingHourPerDay}/></td>
                        </tr>
                        <tr>
                            <td>Join Date</td>
                            <td><input type="date" onChange={handleChange} name="joinDate" required value={formObject.joinDateValue}/></td>
                        </tr>
                        <tr>
                            <td>Leave Date</td>
                            <td>
                                <input type="date" name="leaveDate" onChange={handleChange} required value={formObject.leaveDateValue}/>
                                "31/12/2099" mean active member
                            </td>
                        </tr>                        
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2" className="p-1 text-right">
                                <button>
                                    {((formObject.selectedITO.itoId === '-1')?'Add':'Update')}
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            }
        </form>
    );                
}