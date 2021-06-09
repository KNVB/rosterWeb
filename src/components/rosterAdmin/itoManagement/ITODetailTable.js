import {useEffect,useReducer} from 'react';
import AdminUtility from '../AdminUtility';
import moment from "moment";
export default function ITODetailTable (props){
    let addBlackListShiftPattern=e=>{
        updateObjectList({
            type:'addBlackListShiftPattern'
        });
    }

    let buildASOptionList=(availableShiftList)=>{
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
    };
    
    let buildBSOptionList=(blackListedShiftPatternList,errorMessage)=>{
        let bsList= Object.entries(blackListedShiftPatternList).map(([index,blackListShiftPattern])=>(
                <div key={"blackList_"+index}>
                    <input 
                        className="w-75"
                        data-index={index}
                        name="blackShiftPattern"
                        onChange={handleChange}
                        type="text" 
                        value={blackListShiftPattern}/>
                        <span className="cursor-pointer" onClick={()=>removeBlackListShiftPattern(index)}>&#10060;</span>
                        <div className="errorMessage">
                            {errorMessage["blackListedShiftPattern_"+index]}
                        </div>    
                </div>
            )
        );
        return bsList;
    };

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
        let validateResult=validate(objectList.selectedITO);
        //console.log(validateResult);
        if (Object.keys(validateResult).length>0){
            updateObjectList({
                type:'updateError',
                data:{
                    value:validateResult
                }
            });
        } else {
            let adminUtility = new AdminUtility(props.changeLoggedInFlag);
            adminUtility.saveITOInfoToDB(objectList.selectedITO)
            .then(updateResult=>{
                if (updateResult.result){
                    alert("Update ITO Info. Success");
                    props.setReload(updateResult.itoId);
                } else {
                    console.log(updateResult);
                }
            })
            .catch(error=>{
                alert(error.message);
            });
        }
    }

    let reducer=(state,action)=>{
        switch (action.type){
            case 'addBlackListShiftPattern':
                let temp1=JSON.parse(JSON.stringify(state.selectedITO));
                temp1.blackListedShiftPatternList.push('');
                //console.log(temp1.blackListedShiftPatternList.length);
                return {
                    ...state,
                    selectedITO:temp1,
                    error:validate(temp1)
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
                let temp2={...state};
                temp2.selectedITO.availableShiftList=asList;
                temp2.error=validate(temp2.selectedITO);
                return temp2;
            case "blackShiftPattern":
                let bsList=JSON.parse(JSON.stringify(state.selectedITO.blackListedShiftPatternList));
                bsList[action.value.index]=action.value.blackShiftPattern;
                let temp3={...state};
                temp3.selectedITO.blackListedShiftPatternList=bsList;
                temp3.error=validate(temp3.selectedITO);
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
                    selectedITO:temp4,
                    error:validate(temp4)
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
				error:{}
            }
        })
    },[props.ito]);
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
        } else {
            let essentialShiftList=props.activeShiftInfoList.essentialShift.split('');
            let isIncludeEssentialShift=true;
            for (let i=0;i<essentialShiftList.length;i++){
                //console.log(templateShift[i],ito.availableShiftList.includes(templateShift[i]));
                if (essentialShiftList[i]==='b'){
                    if ((!ito.availableShiftList.includes('b')) && (!ito.availableShiftList.includes('b1'))){
                        isIncludeEssentialShift=false;
                        break;
                    }
                }else {
                    if (!ito.availableShiftList.includes(essentialShiftList[i])){
                        isIncludeEssentialShift=false;
                        break;
                    }
                }
            }
            if (!isIncludeEssentialShift){
                result.availableShiftList='Please include the essential shift (i.e. a,b/b1,c).';
            } else {
                if (!ito.availableShiftList.includes('O')){
                    result.availableShiftList='Please include \'O\' shift.';
                } else {
                    let isIncludeDxShift=false;
                    ito.availableShiftList.forEach(shiftType=>{
                        if (shiftType.startsWith("d")){
                            isIncludeDxShift=true;
                        }
                    });
                    if (!isIncludeDxShift){
                        result.availableShiftList='Please include \'dx\' shift.';
                    }
                }
            }
        }
        if (ito.blackListedShiftPatternList.length===0){
            result.blackListedShiftPatternList='Please enter the black listed shift pattern';
        }else {
            let blackListedShiftPattern='';
            for (let i=0;i<ito.blackListedShiftPatternList.length;i++){
                blackListedShiftPattern=ito.blackListedShiftPatternList[i];
                if (blackListedShiftPattern===''){
                    result["blackListedShiftPattern_"+i]='Please enter a black listed shift pattern';
                    continue;
                }
                if (blackListedShiftPattern.indexOf(',')===-1){
                    result["blackListedShiftPattern_"+i]='Blacklisted shift pattern contains at least 2 shift type.';
                    continue;
                }
                if (blackListedShiftPattern.startsWith(',') || blackListedShiftPattern.endsWith(',')){
                    result["blackListedShiftPattern_"+i]='Blacklisted shift pattern starts/ends with comma.';
                    continue;
                }
                let blackListedShiftPatternList=blackListedShiftPattern.split(',');
                for (let index=0;index < blackListedShiftPatternList.length; index++){
                    if (!ito.availableShiftList.includes(blackListedShiftPatternList[index])){
                        result["blackListedShiftPattern_"+i]='Shift '+blackListedShiftPatternList[index]+' does not included in the avaliable shift type.';
                    }
                }
            }
        }
		return result;
	}
    const [objectList, updateObjectList] = useReducer(reducer);
    return(
        <form 
            className="d-flex flex-column flex-grow-1 justify-content-center"
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
                                    {buildASOptionList(objectList.selectedITO.availableShiftList)}
                                </div>
                                <div className="d-flex errorMessage flex-grow-1 justify-content-center">
                                    {objectList.error.availableShiftList}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Black Listed Shift Pattern</td>
                            <td>
                                <div className="align-items-center border d-flex flex-grow-1 flex-row justify-content-around p-1">
                                    <div className="d-flex flex-column flex-grow-1">
                                        {buildBSOptionList(objectList.selectedITO.blackListedShiftPatternList,objectList.error)}
                                    </div>
                                    <div className="d-flex flex-grow-1 justify-content-start">	
                                        <div className="cursor-pointer" onClick={addBlackListShiftPattern}>&#10133;</div>
                                    </div>
                                </div>
                                <div className="errorMessage text-center" key="blackListedShiftPatternList">
                                    {objectList.error.blackListedShiftPatternList}
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
									value={moment(objectList.selectedITO.joinDate).format('YYYY-MM-DD')}/>
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
									value={moment(objectList.selectedITO.leaveDate).format('YYYY-MM-DD')}/>
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