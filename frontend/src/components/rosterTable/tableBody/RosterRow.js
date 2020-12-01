

import NameCell from '../nameCell/NameCell';
function RosterRow(props) {
    return(
        <tr>
            <NameCell content={props.rosterData.itoName}/>
        </tr>
    );
  }
  export default RosterRow;