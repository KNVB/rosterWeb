import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Pencil, PlusLg } from 'react-bootstrap-icons';
import handleAPIError from "../../common/handleAPIError";
import useITOTimeOffList from "../../../hooks/useITOTimeOffList";
import Accordion from 'react-bootstrap/Accordion';
import Loading from "../../common/Loading";
export default function TimeOffList() {
    const { error, isLoading, itoTimeOffList } = useITOTimeOffList();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading) {
        return <Loading />
    }
    let dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    return (
        <div>
            <div className="text-center">
                <h5>Time Off Mangagement</h5>
            </div>
            <Accordion>
                {
                    Object.keys(itoTimeOffList).map((itoId, index) => (
                        <Accordion.Item eventKey={index} key={itoId}>
                            <Accordion.Header>
                                <div className="d-flex flex-row justify-content-between w-100">
                                    <div>{itoTimeOffList[itoId].name} ({itoTimeOffList[itoId].postName})</div>
                                    <div className="align-self-end d-flex me-3">
                                        <Link to="../timeOffManagement/add">
                                            efsd
                                        </Link>
                                        Total Time Off in hours: {itoTimeOffList[itoId].total}
                                    </div>
                                </div>
                            </Accordion.Header>
                            {
                                (itoTimeOffList[itoId].records.length > 0) &&
                                <Accordion.Body>
                                    <table className="w-100">
                                        <thead>
                                            <tr>
                                                <td>Start Time</td>
                                                <td>End Time</td>
                                                <td>Description</td>
                                                <td>No of hour applied for</td>
                                                <td>Status</td>
                                                <td>Edit</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                itoTimeOffList[itoId].records.map((record, index) => (
                                                    <tr key={record.timeOffId}>
                                                        <td>{dateFormatter.format(record.timeOffStart).replaceAll(",", "")}</td>
                                                        <td>{dateFormatter.format(record.timeOffEnd).replaceAll(",", "")}</td>
                                                        <td>{record.description}</td>
                                                        <td className='align-center'>{record.timeOffAmount}</td>
                                                        <td>{record.timeOffStatus}</td>
                                                        <td>
                                                            <Link state={{ "timeOff": record }} to="../timeOffManagement/edit">
                                                                <Button variant="warning">
                                                                    <Pencil />
                                                                </Button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                        <tfoot style={{ "borderTop": "1px black solid" }}>
                                            <tr>
                                                <td colSpan={2}>
                                                </td>
                                                <td className='align-right'>
                                                    Total:
                                                </td>
                                                <td className='align-center'>
                                                    {itoTimeOffList[itoId].total}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </Accordion.Body>
                            }
                        </Accordion.Item>
                    ))
                }
            </Accordion>
        </div>
    );
}   