import EditableRosterRow from './EditableRosterRow';
import PreferredShiftRow from './PreferredShiftRow';
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
                rowIndex={(index * 2 + 5)}
                uiAction={uiAction} />
        );
        rowList.push(
            <PreferredShiftRow
                itoId={itoId}
                key={"preferredShiftRow_" + itoId}
                rosterDataList={rosterDataList}
                rosterDataAction={rosterDataAction}
                rowIndex={(index * 2 + 6)}
                uiAction={uiAction} />
        );
    })
    return <tbody>{rowList}</tbody>;
}