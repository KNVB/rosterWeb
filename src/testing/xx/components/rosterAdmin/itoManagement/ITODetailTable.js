import {useEffect,useReducer} from 'react';
import moment from "moment";
export default function ITODetailTable (props){
    useEffect(()=>{
        let asOptionList=[],availableShiftList=[],blackListedShiftPatternList=[],bsOptionList=[];
        let ito=props.allITOList[props.itoId];
        let itoName='',joinDate='',leaveDate='',postName='',workingHourPerDay=0.0;
        if (ito){
            for (let i = 0 ; i < ito.availableShiftList.length ; i++){
                availableShiftList.push(ito.availableShiftList[i]);
            }
            for (let i = 0 ; i < ito.blackListedShiftPatternList.length ; i++){
                blackListedShiftPatternList.push(ito.blackListedShiftPatternList[i]);
            }            
            itoName = ito.itoName;
            joinDate = moment(ito.joinDate).format('YYYY-MM-DD');
            leaveDate = moment(ito.leaveDate).format('YYYY-MM-DD');
            postName = ito.postName;            
            workingHourPerDay = ito.workingHourPerDay;
            Object.keys(props.activeShiftInfoList).forEach(key=>{
                if ((key !== "essentialShift") &&(key !== "s")){
                    let checked = false;
                    if (ito.availableShiftList.includes(key)){
                        checked=true;
                    }
                    asOptionList.push(
                        <div className="align-items-center d-flex flex-row flex-grow-1 justify-content-center" key={key}>
                            <span>{key}</span>
                            <input checked={checked} name="availableShift" onChange={handleChange} type="checkbox" value={key}/>
                        </div>
                    )
                }
            });
            for (let [index,blackListShiftPattern] of Object.entries(ito.blackListedShiftPatternList)){
                bsOptionList.push(
                    <div key={"blackList_"+index}>
                        <input 
                            className="w-75"
                            data-index={index}
                            name="blackShiftPattern"
                            onChange={handleChange}
                            required
                            type="text" 
                            value={blackListShiftPattern}/>
                            <span className="cursor-pointer" onClick={()=>removeBlackListShiftPattern(index)}>&#10060;</span>
                    </div>
                );
            }
        }else{
            Object.keys(props.activeShiftInfoList).forEach(key=>{
                if ((key !== "essentialShift") &&(key !== "s")){
                    asOptionList.push(
                        <div className="align-items-center d-flex flex-row flex-grow-1 justify-content-center" key={key}>
                            <span>{key}</span>
                            <input checked={false} name="availableShift" onChange={handleChange} type="checkbox" value={key}/>
                        </div>
                    )
                }
            });
        }
        //console.log(availableShiftList);
        updateSelectedITOInfo({
            type:'updateSelectedITO',
            value:{
                asOptionList:asOptionList,
                availableShiftList:availableShiftList,
                blackListedShiftPatternList:blackListedShiftPatternList,
                bsOptionList:bsOptionList,                
                itoId:props.itoId,
                itoName:itoName,
                joinDate:joinDate,
                leaveDate:leaveDate,
                postName:postName,
                workingHourPerDay:+workingHourPerDay
            }
        })
    },[props]);    
    function addBlackListShiftPattern(e){

    }
    function handleChange(e){
        let itemName=e.target.name;
        switch (itemName){
            case "availableShift":
                updateSelectedITOInfo({
                    type:'updateAvailableShiftList',
                    value:{
                        checked:e.target.checked,
                        shiftType:e.target.value
                    }
                });
                break;
            case "blackShiftPattern":
                updateSelectedITOInfo({
                    type:'updateBlackListShiftPattern',
                    value:{
                        index:e.target.dataset.index,
                        blackShiftPattern:e.target.value
                    }
                })
                break;
            case "joinDate":
                updateSelectedITOInfo({
                    type:'updateJoinDate',
                    value:e.target.value
                });
                break;
            case "leaveDate":
                updateSelectedITOInfo({
                    type:'updateLeaveDate',
                    value:e.target.value
                });
                break
            case "itoName":
                updateSelectedITOInfo({
                    type:'updateITOName',
                    value:e.target.value
                });
                break;
            case "postName":
                updateSelectedITOInfo({
                    type:'updatePostName',
                    value:e.target.value
                });
                break;
            case "workingHourPerDay":
                updateSelectedITOInfo({
                    type:"updateWorkingHourPerDay",
                    value:+e.target.value
                });
                break;
            default:break;    
        }
    }
    function handleSubmit(e){

    }
    function removeBlackListShiftPattern(index){

    }
    function reducer(state, action) {
        switch (action.type){
            case 'updateAvailableShiftList':
                let asList=[];
                let newASOptionList=[];
                if (action.value.checked){
                    asList=JSON.parse(JSON.stringify(state.availableShiftList));
                    asList.push(action.value.shiftType);
                }else {
                    state.availableShiftList.forEach(shift=>{
                        if (shift!==action.value.shiftType){
                            asList.push(shift);
                        }
                    });
                }
                Object.keys(props.activeShiftInfoList).forEach(key=>{
                    if ((key !== "essentialShift") &&(key !== "s")){
                        let checked = false;
                        if (asList.includes(key)){
                            checked=true;
                        }
                        newASOptionList.push(
                            <div className="align-items-center d-flex flex-row flex-grow-1 justify-content-center" key={key}>
                                <span>{key}</span>
                                <input checked={checked} name="availableShift" onChange={handleChange} type="checkbox" value={key}/>
                            </div>
                        )
                    }
                });
                return {
                    ...state,
                    asOptionList:newASOptionList,
                    availableShiftList:asList,
                }
            case 'updateBlackListShiftPattern':
                //console.log(action.value);
                let bsList=JSON.parse(JSON.stringify(state.blackListedShiftPatternList));
                let newBSOptionList=[];
                bsList[action.value.index]=action.value.blackShiftPattern;
                for (let [index,blackListShiftPattern] of Object.entries(bsList)){
                    newBSOptionList.push(
                        <div key={"blackList_"+index}>
                            <input 
                                className="w-75"
                                data-index={index}
                                name="blackShiftPattern"
                                onChange={handleChange}
                                required
                                type="text" 
                                value={blackListShiftPattern}/>
                                <span className="cursor-pointer" onClick={()=>removeBlackListShiftPattern(index)}>&#10060;</span>
                        </div>
                    );
                }
                return {
                    ...state,
                    bsOptionList:newBSOptionList,
                    blackListedShiftPatternList:bsList,
                }                
            case 'updateITOName':
                return {
                    ...state,
                    itoName:action.value
                }
            case 'updateJoinDate':
                return {
                    ...state,
                    joinDate:action.value
                }
            case 'updateLeaveDate':
                return {
                    ...state,
                    leaveDate:action.value
                }
            case 'updatePostName':
                return {
                    ...state,
                    postName:action.value
                }
            case 'updateSelectedITO':
                return action.value
            case "updateWorkingHourPerDay":
                return{
                    ...state,
                    "workingHourPerDay":action.value
                }
            default:
                return state;
        }
    }
    const [selectedITO, updateSelectedITOInfo] = useReducer(reducer);

    return(
        <form 
            className="d-flex flex-column flex-grow-1 justify-content-center"
            onSubmit={handleSubmit}>
        { selectedITO &&                 
            <table className="itoDetailTable">
                <tbody>
                    <tr>
                        <td>ITO Name</td>
                        <td><input type="text" name="itoName" onChange={handleChange} required value={selectedITO.itoName}/></td>
                    </tr>
                    <tr>
                        <td>Post Name</td>
                        <td><input type="text" name="postName" onChange={handleChange} required value={selectedITO.postName}/></td>
                    </tr>
                    <tr>
                        <td>Avaliable Shift Type</td>
                        <td>
                            <div className="d-flex w-75 flex-row justify-content-center">
                                {selectedITO.asOptionList}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Black Listed Shift Type</td>
                        <td>
                            <div className="align-items-center border d-flex flex-grow-1 flex-row justify-content-around p-1">
                                <div className="d-flex flex-column flex-grow-1">
                                    {selectedITO.bsOptionList}
                                </div>
                                <div className="d-flex flex-grow-1 justify-content-start">	
                                    <div className="cursor-pointer" onClick={addBlackListShiftPattern}>&#10133;</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>No. of Working Hour Per Day</td>
                        <td><input type="number" onChange={handleChange} step="0.01" name="workingHourPerDay" required value={selectedITO.workingHourPerDay}/></td>
                    </tr>
                    <tr>
                        <td>Join Date</td>
                        <td><input type="date" onChange={handleChange} name="joinDate" required value={selectedITO.joinDate}/></td>
                    </tr>
                    <tr>
                        <td>Leave Date</td>
                        <td>
                            <input type="date" name="leaveDate" onChange={handleChange} required value={selectedITO.leaveDate}/>
                           "31/12/2099" mean active member
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2" className="p-1 text-right">
                            <button>
                                {((props.itoId === '-1')?'Add':'Update')}
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        }    
        </form>
    )
}