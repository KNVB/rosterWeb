import React, { useCallback, useEffect, useState, useRef } from 'react';
import './MonthPicker.css';
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
  let [context, setContext] = useState({
    isShowBigStepSelector: false,
    maxDate: maxDate,
    minDate: minDate,
    selectedMonth: selectedMonth
  });
  let mouseDown = useCallback(e => {
    if (context.isShowBigStepSelector && !obj.current.contains(e.target)) {
      setContext({
        ...context,
        isShowBigStepSelector: false
      });
    }
  },[context]);
  useEffect(() => {
    document.addEventListener('mousedown', mouseDown);
    return () => {
      document.removeEventListener('mousedown', mouseDown);
    };
  }, [mouseDown]);
  useEffect(() => {
    if (props.onChange) {
      props.onChange(context.selectedMonth);
    }
  }, [context.selectedMonth]);
  
  return (
    <div ref={obj} className="MonthPickerContainer">
      <SmallStepSelector context={context} setContext={setContext} />
      {context.isShowBigStepSelector && (
        <BigStepSelector context={context} setContext={setContext} />
      )}
    </div>
  );
}
