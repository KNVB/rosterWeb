import React from 'react';
import MonthPickerUtil from './MonthPickerUtil';
export default function SmallStepSelector(props) {
  let context = props.context;
  let setContext = props.setContext;
  let selectedMonth = context.selectedMonth;

  /*****************************************************************
   * if the first day of the next month does not within the range, *
   * the next month button should be disabled.                     *
   *****************************************************************/
  let genNextMonth = () => {
    let nextMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    if (nextMonth >= context.minDate && nextMonth <= context.maxDate) {
      return (
        <span className="active" onClick={goNextMonth} title="Next Month">
          &nbsp; &gt;
        </span>
      );
    } else {
      return <span className="inActive" title="Next Month">&gt;</span>;
    }
  };
  /*******************************************************************
   * if the last day of the previous month does not within the range, *
   * the previous month button should be disabled.                    *
   *******************************************************************/
  let genPreviousMonth = () => {
    let prevMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    prevMonth.setDate(prevMonth.getDate() - 1);
    if (prevMonth >= context.minDate && prevMonth <= context.maxDate) {
      return (
        <span className="active" onClick={goPreviousMonth} title="Previous Month">
          &lt; &nbsp;
        </span>
      );
    } else {
      return <span className="inActive" title="Previous Month">&lt;</span>;
    }
  };
  let goNextMonth = () => {
    let nextMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setContext({
      ...context,
      selectedMonth: nextMonth
    });
  };
  let goPreviousMonth=()=>{
    let previousMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setContext({
      ...context,
      selectedMonth: previousMonth
    });
  };
  let toggleBigStepSelector=()=>{
     setContext({
      ...context,
      isShowBigStepSelector:!context.isShowBigStepSelector
    });
  }
  return (
    <div className="SmallStepSelector">
      {genPreviousMonth()}
      <div className="active" onClick={toggleBigStepSelector}>{MonthPickerUtil.formatMonth(selectedMonth)}</div>
      {genNextMonth()}
    </div>
  );
}
