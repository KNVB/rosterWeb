import useUndoUtil from './useUndoUtil';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';

export default function useRosterMonth(rosterMonth){
    console.log(rosterMonth);
    let calendarUtility=new CalendarUtility();
    let roster = new Roster();
    let rosterData = await roster.get(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
    let shiftInfoList= await roster.getAllActiveShiftInfo();
    let monthlyCalendar=calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(),rosterMonth.getMonth());
    return null;
}