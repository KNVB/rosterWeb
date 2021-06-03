import {useState} from 'react';
import moment from "moment";
export default function ITODetailTable (props){
    let activeShiftList=[],blackListShiftPatternList=[];
    let activeShiftInfoList=props.activeShiftInfoList;
    let allITOList=props.allITOList,count=0;
    let [ito,setITO]=useState(allITOList[props.itoId]);
    let joinDate =new Date(ito.joinDate);
    let leaveDate=new Date(ito.leaveDate);
    console.log(props.itoId,ito);
    let addBlackListShiftPattern=(e)=>{
        let temp=JSON.parse(JSON.stringify(ito));
        temp.blackListedShiftPatternList.push('');
        setITO(temp);
    }
    let handleChange=(e)=>{
        let itemName=e.target.name;
        let temp=JSON.parse(JSON.stringify(ito));
        switch (itemName){
            case "availableShift":
                let newList=[];
                if (e.target.checked){
                    newList=JSON.parse(JSON.stringify(ito.availableShiftList));
                    newList.push(e.target.value);
                }else{    
                    ito.availableShiftList.forEach(shift=>{
                        if (shift!==e.target.value){
                            newList.push(shift);
                        }
                    });
                }
                temp.availableShiftList=newList;
                break;
            case "blackShiftPattern":
                console.log(e.target.dataset.index);
                temp.blackListedShiftPatternList[e.target.dataset.index]=e.target.value;                
                break;
            case "joinDate":
                temp.joinDate=new Date(e.target.value);
                break;
            case "leaveDate":
                temp.leaveDate=new Date(e.target.value);
                break;
            case "postName":
                temp.postName=e.target.value;
                break;                
            case "itoName":
                temp.itoName=e.target.value;
                break;
            case "workingHourPerDay":
                temp.workingHourPerDay=e.target.value;
                break;          
            default:break;
        }
        setITO(temp);
    }
    let handleSubmit=(e)=>{
        e.preventDefault();
        return false;
    }
    let removeBlackListShiftPattern=(index)=>{
        let newList=[];
        let temp=JSON.parse(JSON.stringify(ito));
        for (let i=0;i<index;i++){
            newList.push(ito.blackListedShiftPatternList[i]);
        }
        for (let i=(+index)+1;i<ito.blackListedShiftPatternList.length;i++){
            newList.push(ito.blackListedShiftPatternList[i]);
        }
        console.log(newList)
        temp.blackListedShiftPatternList=newList;
        setITO(temp);
    }
    //console.log(ito);
    Object.keys(activeShiftInfoList).forEach(key=>{
        if ((key!=="essentialShift") &&(key!=="s")){
            let checked=false;
            if (ito.availableShiftList.includes(key)){
                checked=true;
            }
            activeShiftList.push(
                <div className="align-items-center d-flex flex-row flex-grow-1 justify-content-start" key={key}>
                    <span>{key}</span>
                    <input checked={checked} name="availableShift" onChange={handleChange} type="checkbox" value={key}/>
                </div>
            )
        }
    });
    
    for (let [index,blackListShiftPattern] of Object.entries(ito.blackListedShiftPatternList)){
        blackListShiftPatternList.push(
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
   
    return (
        <form 
            className="d-flex flex-column flex-grow-1 justify-content-center"
            onSubmit={handleSubmit}>
            <table className="itoDetailTable">
                <tbody>
                    <tr>
                        <td>ITO Name</td>
                        <td><input type="text" name="itoName" onChange={handleChange} required value={ito.itoName}/></td>
                    </tr>
                    <tr>
                        <td>Post Name</td>
                        <td><input type="text" name="postName" onChange={handleChange} required value={ito.postName}/></td>
                    </tr>
                    <tr>
                        <td>Avaliable Shift Type</td>
                        <td>
                            <div className="d-flex w-75 flex-row justify-content-start">
                                {activeShiftList}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Black Listed Shift Type</td>
                        <td>
                            <div className="align-items-center border d-flex flex-grow-1 flex-row justify-content-around p-1">
                                <div className="d-flex flex-column flex-grow-1">
                                    {blackListShiftPatternList}
                                </div>
                                <div className="d-flex flex-grow-1 justify-content-start">	
                                    <div className="cursor-pointer" onClick={addBlackListShiftPattern}>&#10133;</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>No. of Working Hour Per Day</td>
                        <td><input type="number" onChange={handleChange} step="0.01" name="workingHourPerDay" required value={ito.workingHourPerDay}/></td>
                    </tr>
                    <tr>
                        <td>Join Date</td>
                        <td><input type="date" onChange={handleChange} name="joinDate" required value={moment(joinDate).format('YYYY-MM-DD')}/></td>
                    </tr>
                    <tr>
                        <td>Leave Date</td>
                        <td>
                            <input type="date" name="leaveDate" onChange={handleChange} required value={moment(leaveDate).format('YYYY-MM-DD')}/>
                           "31/12/2099" mean active member
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2" className="p-1 text-right">
                            <button>Update</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </form>
    )
}