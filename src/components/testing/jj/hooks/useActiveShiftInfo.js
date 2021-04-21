import { useEffect,useState } from "react";
import Roster from '../../../utils/Roster';
export default function useActiveShiftInfo(){
    const[activeShiftInfoList,setActiveShiftInfoList]=useState();
    useEffect(()=>{
        const getData = async () => {
            let roster = new Roster();
            let temp = await roster.getAllActiveShiftInfo();
            setActiveShiftInfoList(temp);
        }
        getData();
    },[setActiveShiftInfoList]);
    return [activeShiftInfoList];
}