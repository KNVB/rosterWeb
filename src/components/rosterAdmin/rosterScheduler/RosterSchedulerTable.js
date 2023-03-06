import { useEffect } from 'react';
import "../../RosterTable.css";
import HeaderRow from "../../rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
export default function RosterSchedulerTable({rosterDataList, rosterDataAction, uiAction }) {
    useEffect(() => {
        let mouseUpHandler = document.addEventListener("mouseup", () => {
            uiAction.endSelect();
        });
        return () => {
            document.removeEventListener("mouseup", mouseUpHandler);
        }
    }, []);
    return (
        <table className="m-0 rosterTable">
            <HeaderRow
                caption="EMSTF Computer Operator Roster Scheduler"
                rosterDataAction={rosterDataAction}
                rosterDataList={rosterDataList}
                uiAction={uiAction} />
            <RosterSchedulerBody
                rosterDataAction={rosterDataAction}
                rosterDataList={rosterDataList}
                uiAction={uiAction} />
        </table>
    )
}