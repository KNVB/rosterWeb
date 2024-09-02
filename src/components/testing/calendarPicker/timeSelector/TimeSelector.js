import useTimeSelector from "./useTimeSelector"
export default function TimeSelector({ getSelectedTime, value }) {
    const { aPM, hour, minute, selectedItem, action } = useTimeSelector(value);
    let downValue = () => {
        switch (selectedItem) {
            case "APM":
                toggleAPM();
                break;
            case "hour":
                getSelectedTime(action.downHour());
                break;
            case "minute":
                getSelectedTime(action.downMin());
                break;
            default:
                break;
        }
    }

    let toggleAPM = () => {
        getSelectedTime(action.toggleAPM());
    }
    let updateTimeFieldValue=(fieldName, value) => {
        getSelectedTime(action.updateTimeFieldValue(fieldName, value));
    }
    let upValue = () => {
        switch (selectedItem) {
            case "APM":
                toggleAPM();
                break;
            case "hour":
                getSelectedTime(action.upHour());
                break;
            case "minute":
                getSelectedTime(action.upMin());
                break;
            default:
                break;
        }
    }
    return (
        <div className="timeSelector">
            <input
                className={"timeSelectorDigit" + (selectedItem === "hour" ? " selectedItem" : "")}
                max="13"
                min="0"
                onChange={e => updateTimeFieldValue("hour", e.target.value)}
                onClick={() => action.updateSelectedItem("hour")}
                type="number"
                value={hour} />&nbsp;:&nbsp;
            <input
                className={"timeSelectorDigit" + (selectedItem === "minute" ? " selectedItem" : "")}
                max="60"
                min="-1"
                onChange={e => updateTimeFieldValue("minute", e.target.value)}
                onClick={() => action.updateSelectedItem("minute")}
                type="number"
                value={minute} />&nbsp;
            <span
                className={"timeSelectorDigit" + (selectedItem === "APM" ? " selectedItem" : "")}
                onClick={() => action.updateSelectedItem("APM")}
                suppressContentEditableWarning={true}>{aPM}</span>
            {/*           <span
                className={"timeSelectorDigit" + (selectedItem === "hour" ? " selectedItem" : "")}
                contentEditable={true}
                onClick={() => action.updateSelectedItem("hour")}
                onKeyUp={e =>{ return handleKeyBoardEvent(e, "hour");}}
                suppressContentEditableWarning={true}
            >{hour}</span>&nbsp;:&nbsp;
            <span
                className={"timeSelectorDigit" + (selectedItem === "minute" ? " selectedItem" : "")}
                contentEditable={true}
                onClick={() => action.updateSelectedItem("minute")}
                suppressContentEditableWarning={true}>{minute}</span>&nbsp;
            <span
                className={"timeSelectorDigit" + (selectedItem === "APM" ? " selectedItem" : "")}
                contentEditable={true}
                onClick={() => action.updateSelectedItem("APM")}
                suppressContentEditableWarning={true}>{aPM}</span>
*/}
            <div className="timeSelectorUpDown">
                <div onClick={upValue}>▲</div>
                <div onClick={downValue}>▼</div>
            </div>
        </div>
    )
}