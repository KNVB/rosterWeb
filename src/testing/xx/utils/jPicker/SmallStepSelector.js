import JPickerUtil from './JPickerUtil';
export default function SmallStepSelector(props) {
  let context=props.context;
 /*****************************************************************
   * if the first day of the next month does not within the range, *
   * the next month button should be disabled.                     *
   *****************************************************************/
  let genNextMonth = () => {
    let nextMonth = new Date(
      context.selectedMonth.getFullYear(),
      context.selectedMonth.getMonth(),
      1
    );
    nextMonth.setMonth(nextMonth.getMonth() + 1);    
    if (nextMonth >= context.minDate && nextMonth <= context.maxDate) {
      return (
        <span className="active" onClick={()=>updateSelectedMonth(nextMonth)} title="Next Month">
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
  let genPreviousMonth=()=>{
    let prevMonth = new Date(
      context.selectedMonth.getFullYear(),
      context.selectedMonth.getMonth(),
      1
    );
    prevMonth.setDate(prevMonth.getDate() - 1);
    if (prevMonth >= context.minDate && prevMonth <= context.maxDate) {
      return (
        <span className="active" onClick={()=>updateSelectedMonth(prevMonth)} title="Previous Month">
          &lt; &nbsp;
        </span>
      );
    } else {
      return <span className="inActive" title="Previous Month">&lt;</span>;
    }
  }
  let updateSelectedMonth=(newSelectedMonth)=>{
    props.updateValue("updateSelectedMonth",newSelectedMonth);
  }
  let toggleBigStepSelectorContainer=e=>{
    props.updateValue("toggleBigStepSelectorContainer");
  }
  return( 
    <div className="jpickerSmallStepSelector">
      {genPreviousMonth()}
      <input
          className="jpickerValue"
          onClick={toggleBigStepSelectorContainer}
          readOnly={true}
          size="10"
          type="text"
          value={JPickerUtil.formatMonth(context.selectedMonth)}
      />
      {genNextMonth()}
    </div>
  );  
}