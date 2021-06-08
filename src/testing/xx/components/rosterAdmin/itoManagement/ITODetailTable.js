import {useCallback, useEffect,useReducer} from 'react';
import moment from "moment";
export default function ITODetailTable (props){
    let addBlackListShiftPattern=e=>{
        updateObjectList({
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
                        <input 
                            checked={checked} 
                            name="availableShift"
                            onChange={handleChange}
                            type="checkbox" 
                            value={key}/>
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
                updateObjectList({
                    type:"availableShift",
                    value:{
                        checked:e.target.checked,
                        shiftType:e.target.value
                    }
                });
                break;
            case "blackShiftPattern":
                updateObjectList({
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
                    updateObjectList({
                        type:e.target.name,
                        value:+value
                    });
                } else {
                    updateObjectList({
                        type:e.target.name,
                        value:value
                    });
                }
                break
            default:
                updateObjectList({
                    type:e.target.name,
                    value:e.target.value
                });
        }
    }

    let handleSubmit=(e)=>{
        e.preventDefault();
        //console.log(objectList);
        /*
        let form=e.target;
        for(let field of form.elements) {
            console.log(field.type,field.name, field.checkValidity());
        }
        */
        let validateResult=validate(objectList.selectedITO);
        if (Object.keys(validateResult).length>0){
            updateObjectList({
                type:'updateError',
                data:{
                    value:validateResult
                }
            });
        }
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
                    selectedITO:temp1,
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
                temp2.error=validate(temp2.selectedITO);
                return temp2;
            case "blackShiftPattern":
                bsList=JSON.parse(JSON.stringify(state.selectedITO.blackListedShiftPatternList));
                bsList[action.value.index]=action.value.blackShiftPattern;
                let temp3={...state,bsOptionList:buildBSOptionList(bsList)};
                temp3.selectedITO.blackListedShiftPatternList=bsList;
                return temp3;
            case 'initObjectList':
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
            case 'updateError':
                return {
                    ...state,
                    error:action.data.value
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
					error:validate(ito)
                }                
        }
        
    }
    let removeBlackListShiftPattern=(index)=>{
        updateObjectList({
            type:'removeBlackListShiftPattern',
            value:+index
        });
    }
    useEffect(()=>{
        let ito=props.ito;
        updateObjectList({
            type:'initObjectList',
            value:{
                selectedITO:ito,
                asOptionList:buildASOptionList(ito.availableShiftList),
                bsOptionList:buildBSOptionList(ito.blackListedShiftPatternList),
                joinDateValue:moment(ito.joinDate).format('YYYY-MM-DD'),
                leaveDateValue:moment(ito.leaveDate).format('YYYY-MM-DD'),
				error:{}
            }
        })
    },[props.ito, buildASOptionList, buildBSOptionList]);
	let validate=ito=>{
		let result={};
		if (ito.itoName===''){
			result.itoName='Please enter the ITO Name';
		}
		if (ito.postName===''){
			result.postName='Please enter the Post Name';
		}
		if ((ito.workingHourPerDay==='') || isNaN(ito.workingHourPerDay)){
			result.workingHourPerDay='Please enter the no. of working hour per day';
		}
		if (ito.joinDate==='') {
			result.joinDate='Please enter the join date';
		}
		if (ito.leaveDate==='') {
			result.leaveDate='Please enter the leave date';
		}
        if (ito.availableShiftList.length===0){
            result.availableShiftList='Please an available shift';
        }
		return result;
	}
    const [objectList, updateObjectList] = useReducer(reducer);
    return(
        <form 
            className="d-flex flex-column flex-grow-1 justify-content-center"
            noValidate
            onSubmit={handleSubmit}>
            {objectList && 
                <table className="itoDetailTable">
                    <tbody>
                        <tr>
                            <td>ITO Name</td>
                            <td>
                                <input 
                                    name="itoName" 
                                    onChange={handleChange} 
                                    type="text"
                                    value={objectList.selectedITO.itoName}/>
								<div className="errorMessage">
									{objectList.error.itoName}
								</div>	
                            </td>
                        </tr>
                        <tr>
                            <td>Post Name</td>
                            <td>
                                <input 
                                    name="postName"
                                    onChange={handleChange}
                                    type="text"
                                    value={objectList.selectedITO.postName}/>
								<div className="errorMessage">
									{objectList.error.postName}
								</div>									
                            </td>
                        </tr>
                        <tr>
                            <td>Available Shift Type</td>
                            <td>
                                <div className="d-flex w-75 flex-row justify-content-center">
                                    {objectList.asOptionList}
                                </div>
                                <div className="d-flex w-75 errorMessage">
                                    {objectList.error.availableShiftList}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Black Listed Shift Pattern</td>
                            <td>
                                <div className="align-items-center border d-flex flex-grow-1 flex-row justify-content-around p-1">
                                    <div className="d-flex flex-column flex-grow-1">
                                        {objectList.bsOptionList}
                                    </div>
                                    <div className="d-flex flex-grow-1 justify-content-start">	
                                        <div className="cursor-pointer" onClick={addBlackListShiftPattern}>&#10133;</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>No. of Working Hour Per Day</td>
                            <td>
								<input 
									name="workingHourPerDay"
									onChange={handleChange}
									step="0.01"
									type="number"
									value={objectList.selectedITO.workingHourPerDay}/>
								<div className="errorMessage">
									{objectList.error.workingHourPerDay}
								</div>
							</td>
                        </tr>
                        <tr>
                            <td>Join Date</td>
                            <td>
								<input 
									name="joinDate"
									onChange={handleChange}
									type="date"
									value={objectList.joinDateValue}/>
								<div className="errorMessage">
									{objectList.error.joinDate}
								</div>
							</td>
                        </tr>
                        <tr>
                            <td>Leave Date</td>
                            <td>
                                <input
									name="leaveDate"
									onChange={handleChange}
									type="date"
									value={objectList.leaveDateValue}/>
                                "31/12/2099" mean active member
								<div className="errorMessage">
									{objectList.error.leaveDate}
								</div>
                            </td>
                        </tr>                        
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2" className="p-1 text-right">
                                <button>
                                    {((objectList.selectedITO.itoId === '-1')?'Add':'Update')}
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            }
        </form>
    );                
}