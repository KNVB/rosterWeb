import {useState} from "react";
import BigStepSelectorBody from './BigStepSelectorBody';
import BigStepSelectorFooter from './BigStepSelectorFooter';
import BigStepSelectorHeader from './BigStepSelectorHeader';
export default function BigStepSelector(props) {
    let context=props.context;
    const[selectedYear,updateSelectedYear]=useState(context.selectedMonth.getFullYear());
    return (
        <div className="monthPickerBigStepSelectorContainer">
            <table className="monthPickerBigStepSelector">
                <BigStepSelectorHeader
                    context={props.context}
                    selectedYear={selectedYear}
                    updateSelectedYear={updateSelectedYear}
                />
                <BigStepSelectorBody
                    context={props.context}
                    selectedYear={selectedYear}
                    updateValue={props.updateValue}
                />
                <BigStepSelectorFooter
                    context={props.context}
                    updateValue={props.updateValue}
                />
            </table>
        </div>
    )
}