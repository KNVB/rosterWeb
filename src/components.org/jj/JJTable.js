import JJTableBody from './JJTableBody';
import RosterWebContext from '../../utils/RosterWebContext';
import useRosterMonth from './hooks/useRosterMonth';
import useShift from './hooks/useShift';
import "./JJ.css";
import JJTableHeader from './jjTableHeader/JJTableHeader';
export default function JJTable(props) {
  let contextValue;
  let systemParam=props.systemParam;
  let [
        activeShiftInfoList,
        calendarUtility,
        hightLightCellIndex,
        itoRosterList,
        monthlyCalendar,
        setHightLightCellIndex,
        setITORosterList
  ]=useRosterMonth(props.rosterMonth);
  contextValue={
                activeShiftInfoList,
                calendarUtility,
                hightLightCellIndex,
                itoRosterList,
                monthlyCalendar,
                setHightLightCellIndex,
                setITORosterList,
                systemParam
  };
  return(
    <RosterWebContext.Provider value={contextValue}>
        <table id="rosterTable">
            {monthlyCalendar && <JJTableHeader noOfPrevDate={systemParam.noOfPrevDate}/>}
            {itoRosterList && <JJTableBody/>}
        </table>
    </RosterWebContext.Provider>
  )
}
