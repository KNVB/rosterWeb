export default function BigStepSelectorHeader(props) {
    let context = props.context;
  /****************************************************************
   * if the first day of the next year does not within the range, *
   * the next year button should be disabled.                     *
   ****************************************************************/
    let genNextYearTag = () => {
        let nextYearBtn;
        let nextYear = new Date(props.selectedYear + 1, 0, 1);
        if (nextYear >= context.minDate && nextYear <= context.maxDate) {
            nextYearBtn = (
                <td className="active" onClick={()=>updateSelectedYear(nextYear.getFullYear())} title="Next Year">
                    &gt;&nbsp;
                </td>
            );
        } else {
            nextYearBtn = (
                <td className="inActive" title="Next Year">
                    &gt;&nbsp;
                </td>
            );
        }
        return nextYearBtn;
    };
    /*******************************************************************
     * if the last day of the previous year does not within the range, *
     * the previous year button should be disabled.                    *
     *******************************************************************/
    let genPreviousYearTag = () => {
        let prevYearBtn;
        let prevYear = new Date(props.selectedYear  - 1, 11, 31);
        if (prevYear >= context.minDate && prevYear <= context.maxDate) {
            prevYearBtn = (
                <td className="active" onClick={()=>updateSelectedYear(prevYear.getFullYear())} title="Previous Year">
                    &nbsp;&lt;
                </td>
            );
        } else {
            prevYearBtn = (
                <td className="inActive" title="Previous Year">
                    &nbsp;&lt;
                </td>
            );
        }
        return prevYearBtn;
    };
    let updateSelectedYear=(newYear)=>{
        props.updateSelectedYear(newYear);
    }
    return (
        <thead>
            <tr>
                {genPreviousYearTag()}
                <td>{props.selectedYear}</td>
                {genNextYearTag()}
            </tr>
        </thead>
    );

}