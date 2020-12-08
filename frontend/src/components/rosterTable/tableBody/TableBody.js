import { useEffect,useState} from 'react';
import Utility from '../Utility';
import Roster from '../../../utils/roster';
import RosterRow from './RosterRow';
function TableBody(props){
    const [rosterList, setRosterList] = useState([]);
    useEffect(() => {
      const getData = async () => {
        let roster = new Roster();
        let rosterData = await roster.get(props.rosterYear, props.rosterMonth);
        let rosterRule = await roster.getRosterRule();
        let rows=[];
        
        console.log(rosterData);
        Object.keys(rosterData).forEach(itoId=>{
          let result=Utility.calculateShiftStat(props.noOfWorkingDay,rosterData[itoId],rosterRule.shiftHourCount);
          console.log(itoId,result);
          rows.push(<RosterRow 
                      itoId={itoId} 
                      itoRoster={result} 
                      key={itoId} 
                      setHightLightCellIndex={props.setHightLightCellIndex}/>);
        });
        
        setRosterList(rows);
      };
      getData();
    }, [props.noOfWorkingDay,props.rosterYear, props.rosterMonth]);
    return (
        <tbody>
          {rosterList}
        </tbody>
    )
}
export default TableBody;