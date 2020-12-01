import { useEffect,useState} from 'react';
import Roster from '../../../utils/roster';
import RosterRow from './RosterRow';
function TableBody(props){
    const [rosterList, setRosterList] = useState({});
  
    useEffect(() => {
      const getData = async () => {
        let roster = new Roster();
        let rosterData = await roster.get(props.rosterYear, props.rosterMonth);
        let rows=[];
        let itoIdList=Object.keys(rosterData);
        for (var i=0;i<itoIdList.length;i++){
            var ito=rosterData[itoIdList[i]];
            rows.push(<RosterRow rosterData={ito}/>);
        };
        console.log(rows);
        setRosterList(rows);
      };
      getData();
    }, [props.rosterYear, props.rosterMonth]);
    return (
        <tbody>            
        </tbody>
    )
}
export default TableBody;