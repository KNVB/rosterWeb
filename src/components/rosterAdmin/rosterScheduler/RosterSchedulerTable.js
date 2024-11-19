import { useEffect } from "react";
import useRosterSchedulerTable from "./useRosterSchedulerTable";
import HeaderRows from "../../common/rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../common/ShiftInfoLegend";

export default function RosterSchedulerTable({ dataAction, rosterSchedulerData }) {
    const { activeShiftList, calendarDateList, nonStandardWorkingHourSummary, rosterMonth, systemParam } = rosterSchedulerData;
    const rosterSchedulerTableUtil = useRosterSchedulerTable(rosterSchedulerData);
    //console.log(rosterSchedulerData);
    useEffect(() => {
        const mouseUp = () => rosterSchedulerTableUtil.endSelect();
        document.addEventListener("mouseup", mouseUp);
        return () => {
            document.removeEventListener("mouseup", mouseUp);
        };
    }, [rosterSchedulerTableUtil]);
    return (
        <table className="m-1 p-0 rosterTable">
            <HeaderRows
                caption="EMSTF Computer Operator Roster"
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                highLightAction={rosterSchedulerTableUtil}
                rosterMonth={rosterMonth}
                systemParam={systemParam} />
            <RosterSchedulerBody
                dataAction={dataAction}
                rosterSchedulerData={rosterSchedulerData}
                rosterSchedulerTableUtil={rosterSchedulerTableUtil} />
            <tfoot>
                <tr>
                    <td colSpan="7" className="pt-1">
                        <ShiftInfoLegend activeShiftList={activeShiftList} />
                    </td>
                    <td colSpan={20}>

                    </td>
                    <td colSpan={17}>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};