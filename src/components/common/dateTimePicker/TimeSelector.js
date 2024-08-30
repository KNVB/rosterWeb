export default function TimeSelector({ selectedTime }) {
    let timeFormatter = new Intl.DateTimeFormat('en-ZA', {
        hour: "2-digit",
        hour12: true,
        minute: "2-digit"
    });
    let timeString=timeFormatter.format(selectedTime);
    let hour=timeString.substring(0,2);
    let minute=timeString.substring(3,5);
    let aPM=timeString.substring(timeString.length-2).toUpperCase().trim();
    let highLight=e=>{
        let p=e.target;
        let range = new Range();
        range.setStart(p, 0);
        range.setEnd(p, 1);
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(range);
    }
    return (
        <div className="timeSelector">
            <span
                className="timeSelectorDigit"
                contentEditable={true}
                onClick={highLight}                
                suppressContentEditableWarning={true}
            >{hour}</span>&nbsp;:&nbsp;
            <span
                className="timeSelectorDigit"
                contentEditable={true}
                onClick={highLight}
                suppressContentEditableWarning={true}>{minute}</span>&nbsp;
            <span
                className="timeSelectorDigit"
                contentEditable={true}
                onClick={highLight}
                suppressContentEditableWarning={true}>{aPM}</span>
            <div className="timeSelectorUpDown">
                <div>▲</div>
                <div>▼</div>
            </div>    
        </div>)
}