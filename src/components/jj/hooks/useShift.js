export default function useShift(activeShiftInfo,itoRosterList,setITORosterList){
  const getShiftCssClassName=(shiftType)=>{
    let shiftInfo=activeShiftInfo[shiftType];
    if (shiftInfo===undefined){
      return '';
    } else {
      return shiftInfo.cssClassName;
    }
  }
  return [getShiftCssClassName]
}