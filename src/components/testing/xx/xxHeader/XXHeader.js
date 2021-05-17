import {useContext} from 'react';
import DateRow from './DateRow';
import HolidayRow from './HolidayRow';
import WeekDayRow from './WeekDayRow';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function XXHeader(props){
    let [contextValue]=useContext(RosterWebContext);
    return(
        <thead>
            <HolidayRow noOfPrevDate={contextValue.systemParam.noOfPrevDate}/>
            <WeekDayRow noOfPrevDate={contextValue.systemParam.noOfPrevDate}/>
            <DateRow noOfPrevDate={contextValue.systemParam.noOfPrevDate}/>
        </thead>
    )
}
