import { useEffect,useState} from 'react';
import '../tables.css';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/roster';
import TableBody   from './tableBody/TableBody';
import TableFooter from './TableFooter'; 
import TableHeader from '../tableHeader/TableHeader'; 
function RosterTable(props){
    const [hightLightCellIndex,setHightLightCellIndex]=useState(-1);
    const [tableContent,setTableContent]=useState([]);
    useEffect(()=>{
      const genTableContent = async () => {
        console.log(props.rosterMonth);
        let calendarUtility=new CalendarUtility();
        let roster = new Roster();
        let rosterParam=await roster.getRosterParam();
            
        let rosterData=await roster.get(props.rosterMonth.getFullYear(), props.rosterMonth.getMonth()+1);
        let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            
        let temp=[];
        temp.push(
            <TableHeader
                calendarUtility={calendarUtility} 
                key="header"
                monthlyCalendar={monthlyCalendar}
                rosterParam={rosterParam}
                hightLightCellIndex={hightLightCellIndex}/>);
        temp.push(
            <TableBody 
                key="body"
                monthlyCalendar={monthlyCalendar}
                rosterData={rosterData}
                rosterParam={rosterParam}
                setHightLightCellIndex={setHightLightCellIndex}/>
        );
        temp.push(
            <TableFooter key="footer"/>
        );         
        setTableContent(temp);        
      }
      genTableContent();
    },[props.rosterMonth,hightLightCellIndex]);
    
    return (
        <table id="rosterTable">
            {tableContent}
        </table>     
    );
    /*
    return (
        <table id="rosterTable">
             <TableHeader 
                calendarUtility={calendarUtility} 
                hightLightCellIndex={hightLightCellIndex} 
                monthlyCalendar={monthlyCalendar}
                noOfPrevDate={0}/>
            <TableBody 
                noOfPrevDate={0}
                noOfWorkingDay={result.noOfWorkingDay} 
                rosterYear={props.rosterDate.getFullYear()} 
                rosterMonth={props.rosterDate.getMonth()+1} 
                setHightLightCellIndex={setHightLightCellIndex} />    
            <TableFooter/>
        </table>
    );
    */
}
export default RosterTable;