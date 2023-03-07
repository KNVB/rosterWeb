import EditableRosterRow from './EditableRosterRow';
export default function RosterSchedulerBody({ rosterDataAction, rosterDataList, uiAction }) {
    let rowList = [];
    let itoIdList = Object.keys(rosterDataList.rosterList);
    itoIdList.forEach((itoId, index) => {
        //if (index === 0) {
            rowList.push(
                <EditableRosterRow
                    itoId={itoId}
                    key={"rosterRow_" + itoId}
                    rosterDataList={rosterDataList}
                    rosterDataAction={rosterDataAction}
                    rowIndex={(index * 2 + 5)}
                    uiAction={uiAction} />
            );
        //}
    })
    return <tbody>{rowList}</tbody>;
}