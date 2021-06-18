import MonthPickerUtil from './MonthPickerUtil';
export default function BigStepSelectorBody(props) {
  let context = props.context;
  let monthCellList = [];
  let monthRowList = [];

  let selectedMonth = context.selectedMonth;
  let setContext = props.setContext;
  let firstDate, lastDate;

  let getMonth = month => {
    let newSelectedMonth = new Date(selectedMonth.getFullYear(), month, 1);
    setContext({
      ...context,
      isShowBigStepSelector: false,
      selectedMonth: newSelectedMonth
    });
  };

  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 3 === 0) {
      monthRowList.push(
        <tr key={'monthRow_' + monthRowList.length}>{monthCellList}</tr>
      );
      monthCellList = [];
    }
    firstDate = new Date(selectedMonth.getFullYear(), i, 1);
    lastDate = new Date(selectedMonth.getFullYear(), i + 1, 1);
    lastDate.setDate(lastDate.getDate() - 1);
    
    if (
      (firstDate >= context.minDate && firstDate <= context.maxDate) ||
      (lastDate >= context.minDate && lastDate <= context.maxDate)
    ) {
      monthCellList.push(
        <td
          className="activeMonth"
          key={'monthCell_' + i}
          onClick={() => getMonth(i)}
        >
          {MonthPickerUtil.monthShortName[i]}
        </td>
      );
    } else {
      monthCellList.push(
        <td className="inActive" key={'monthCell_' + i}>
          {MonthPickerUtil.monthShortName[i]}
        </td>
      );
    }
  }
  monthRowList.push(
    <tr key={'monthRow_' + monthRowList.length}>{monthCellList}</tr>
  );
  return <tbody>{monthRowList}</tbody>;
}
