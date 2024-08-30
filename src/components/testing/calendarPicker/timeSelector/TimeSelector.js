import { useRef } from "react";
import useTimeSelector from "./useTimeSelector";
export default function TimeSelector({ getSelectedTime, value }) {
    let aPMRef = useRef(), hourRef = useRef(), minRef = useRef();
   
    const { aPM, hour, minute, selectedItem,result, action } = useTimeSelector({
        "aPMRef": aPMRef,
        "hourRef": hourRef,
        "minRef": minRef,
        "value": (value ?? new Date())
    });
    let downValue = () => {
        let temp;
        switch (selectedItem) {
            case "APM":
                toggleAPM();
                break;
            default:
                break;
        }
    }
    let toggleAPM = () => {        
        let temp = new Date(value.getTime());
        if (aPM === "AM") {
            temp.setHours(temp.getHours() + 12);
        } else {
            temp.setHours(temp.getHours() - 12);
        }
        //console.log(result,temp);
        getSelectedTime(temp);
    }
    let upValue = () => {
        let temp;
        switch (selectedItem) {
            case "APM":
                toggleAPM();
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
                ref={hourRef}
                suppressContentEditableWarning={true}
            >{hour}</span>&nbsp;:&nbsp;
            <span
                className={"timeSelectorDigit" + (selectedItem === "minute" ? " selectedItem" : "")}
                contentEditable={true}
                onClick={() => action.updateSelectedItem("minute")}
                ref={minRef}
                suppressContentEditableWarning={true}>{minute}</span>&nbsp;
            <span
                className={"timeSelectorDigit" + (selectedItem === "APM" ? " selectedItem" : "")}
                contentEditable={true}
                onClick={() => action.updateSelectedItem("APM")}
                ref={aPMRef}
                suppressContentEditableWarning={true}>{aPM}</span>
            <div className="timeSelectorUpDown">
                <div onClick={upValue}>▲</div>
                <div onClick={downValue}>▼</div>
            </div>
        </div>
    )

}