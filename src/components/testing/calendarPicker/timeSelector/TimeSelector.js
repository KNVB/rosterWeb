import useTimeSelector from "./useTimeSelector"
export default function TimeSelector({ getSelectedTime, value }) {
    const { aPM, hour, minute, result, selectedItem, action } = useTimeSelector(value);
    let downValue = () => {
        let temp;
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
    let upValue = () => {
        let temp;
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
            <span
                className={"timeSelectorDigit" + (selectedItem === "hour" ? " selectedItem" : "")}
                contentEditable={true}
                onClick={() => action.updateSelectedItem("hour")}
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
            <div className="timeSelectorUpDown">
                <div onClick={upValue}>▲</div>
                <div onClick={downValue}>▼</div>
            </div>
        </div>
    )
}