import './MonthPicker.css';
import { useCallback, useEffect,useRef,useState } from 'react';
import BigStepSelector from './BigStepSelector';
import SmallStepSelector from './SmallStepSelector';

export default function MonthPicker(props) {
  let maxDate, minDate, now, selectedMonth;
  const obj = useRef();
  now = new Date();
  if (props.selectedMonth) {
    selectedMonth = new Date(
      props.selectedMonth.getFullYear(),
      props.selectedMonth.getMonth(),
      props.selectedMonth.getDate()
    );
  } else {
    selectedMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (props.maxDate) {
    maxDate = new Date(
      props.maxDate.getFullYear(),
      props.maxDate.getMonth(),
      props.maxDate.getDate()
    );
  } else {
    maxDate = new Date(now.getFullYear() + 100, now.getMonth(), 1);
  }
  if (props.minDate) {
    minDate = new Date(
      props.minDate.getFullYear(),
      props.minDate.getMonth(),
      props.minDate.getDate()
    );
  } else {
    minDate = new Date(now.getFullYear() - 100, now.getMonth(), 1);
  }
  const [context, updateContext] = useState({
    isShowBigStepSelector:false,
    maxDate:maxDate,
    minDate:minDate,
    selectedMonth:new Date(selectedMonth.getFullYear(),selectedMonth.getMonth(),1)
  });
  let updateValue=(type,value)=>{
    switch (type){
      case "toggleBigStepSelectorContainer":
        updateContext({
          ...context,
          isShowBigStepSelector:!context.isShowBigStepSelector
        });
        break;
      case "updateSelectedMonth":
        if (props.onChange) {
          props.onChange(value);
        }  
        updateContext({
          ...context,
          isShowBigStepSelector:false,
          selectedMonth:value
        });
        break;
      default:
        break;  
    }    
  }
  let mouseDown=useCallback(e=>{
    if (context.isShowBigStepSelector && !obj.current.contains(e.target)){
      updateContext({
        ...context,
        isShowBigStepSelector:false});
    }
  },[context,updateContext]);
  useEffect(()=>{
    document.addEventListener('mousedown',mouseDown);
    return () => {
        document.removeEventListener('mousedown', mouseDown)
    }
},[mouseDown]);  
  return (
    <div ref={obj} className="jpickerContainter">
      <SmallStepSelector context={context} updateValue={updateValue}/>
    {
      context.isShowBigStepSelector && 
      <BigStepSelector context={context} updateValue={updateValue}/>
    }      
    </div>
  );
}
