import { useITOList } from "../../../hooks/useITOList";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Pencil, PlusLg } from 'react-bootstrap-icons';
import handleAPIError from "../../common/handleAPIError";
import ITO from "./ITO";
import Loading from "../../common/Loading";
export default function ITOList() {
    const { error, isLoading, itoList } = useITOList();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading) {
        return <Loading />
    } else {
        let itoRowList = [], isLeft;
        for (const [itoId, ito] of Object.entries(itoList)) {
            isLeft = (ito.leaveDate !== "2099-12-31");
            itoRowList.push(
                <tr className={(isLeft ? "highLight text-secondary" : "highLight")} key={itoId} title={(isLeft ? ito.name+" has left on "+ito.leaveDate : "")}>
                    <td className="border">
                        {ito.name}
                    </td>
                    <td className="border text-center">
                        {ito.post}
                    </td>
                    <td className="border text-center">
                        {ito.availableShift.join(",")}
                    </td>
                    <td className="border text-center">
                        {ito.workingHourPerDay}
                    </td>
                    <td className="border text-center">
                        <Link state={{ "ito": ito }} to="../itoManagement/edit">
                            <Button variant="warning"><Pencil /></Button>
                        </Link>
                    </td>
                </tr>
            )
        }
        return (
            <table className="border m-1 p-0">
                <thead>
                    <tr>
                        <th className="text-center" colSpan={5}>ITO Management</th>
                    </tr>
                    <tr>
                        <th className="border text-center">ITO Name</th>
                        <th className="border text-center">Post Name</th>
                        <th className="border text-center">Available Shift Type</th>
                        <th className="border text-center">No. of Working Hour Per Day</th>
                        <th className="border text-center">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {itoRowList}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="" colSpan={5}>
                            <div className="d-flex flex-grow-1 justify-content-end p-1">
                                <Link
                                    state={{ "ito": ITO() }}
                                    to="../itoManagement/add">
                                    <Button className="d-flex align-items-center">
                                        <PlusLg />
                                        Add New ITO
                                    </Button>
                                </Link>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        )
    }
}