import "./TimeSelector.css";
import useTimeSelector from "./useTimeSelector";
export default function TimeSelector({ getSelectedTime, value }) {
    const { aPM, hour, minute, selectedItem, action } = useTimeSelector(value);
    let handleClick = (fieldName, element) => {
        action.updateSelectedItem(fieldName);
        let value = element.value;
        element.value = "";
        element.value = value;
    }
    let updateHourFieldValue = (element) => {
        let temp = element.value;
        let result;
        if (Number(temp) < Number(element.max)) {
            if ((temp === "0") || (temp === "")) {
                result = 12;
            } else {
                result = Number(temp);
            }
        } else {
            switch (true){
                case (Number(temp) === Number(element.max)):
                    result=1;
                    break;
                case (temp === "0") :
                        

            }
            /*
            swith (true) 
                

            }
            
            if 
                temp=1;
            temp = temp.substring(temp.length - 1);
            
            if (temp === "0") {
                result = 12;
            } else {
                result = Number(temp);
            }*/
        }
        getSelectedTime(action.updateTimeFieldValue("hour" , String(result).padStart(2, '0')));
    }
    let updateMinuteField=element=>{
        let temp = element.value;
        let result;
        if (Number(temp) < Number(element.max)) {
            result = Number(temp);
        }else {
            temp = temp.substring(temp.length - 1);
            result = Number(temp);
        }
        getSelectedTime(action.updateTimeFieldValue("minute" , String(result).padStart(2, '0')));
    }
    return (
        <div className="timeSelector">
            <input
                className={"timeSelectorDigit" + (selectedItem === "hour" ? " selectedItem" : "")}
                max="13"
                min="0"
                onChange={e => updateHourFieldValue(e.target)}
                onClick={e => handleClick("hour", e.target)}
                type="number"
                value={hour} />&nbsp;:&nbsp;
            <input
                className={"timeSelectorDigit" + (selectedItem === "minute" ? " selectedItem" : "")}
                max="60"
                min="-1"
                onChange={e => updateMinuteField(e.target)}
                onClick={e => handleClick("minute", e.target)}
                type="number"
                value={minute} />&nbsp;
        </div>
    );
}