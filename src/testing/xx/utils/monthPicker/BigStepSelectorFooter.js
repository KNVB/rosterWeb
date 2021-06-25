import MonthPickerUtil from "./MonthPickerUtil";
export default function BigStepSelectorFooter(props) {
  let context = props.context;
  let now = new Date();
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let todayTag;

  let setToday = () => {
    props.updateValue("updateSelectedMonth",today);
  };
  if (
    MonthPickerUtil.isWithinTheRange(today, context.maxDate, context.minDate)
  ) {
    todayTag = (
      <td colSpan="3">
        <div className="active" onClick={setToday}>
          {" "}
          This Month
        </div>
      </td>
    );
  } else {
    todayTag = (
      <td colSpan="3">
        <div className="inActive"> This Month</div>
      </td>
    );
  }
  return (
    <tfoot>
      <tr>{todayTag}</tr>
    </tfoot>
  );
}
