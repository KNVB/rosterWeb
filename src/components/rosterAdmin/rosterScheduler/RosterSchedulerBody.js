import EditableRosterRow from './EditableRosterRow';
export default function RosterSchedulerBody({ rosterDataAction, rosterDataList, uiAction }) {
    let rowList = [];
    let itoIdList = Object.keys(rosterDataList.rosterList);
    itoIdList.forEach((itoId, index) => {        
        rowList.push(
            <EditableRosterRow
                itoId={itoId}
                key={"rosterRow_" + itoId}
                rosterDataList={rosterDataList}
                rosterDataAction={rosterDataAction}                
                uiAction={uiAction} />
        );
    })
    return <tbody>{rowList}</tbody>;
}