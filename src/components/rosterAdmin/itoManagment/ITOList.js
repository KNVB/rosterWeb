import { useITOList } from "../../../hooks/useITOList";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Pencil, PlusLg } from 'react-bootstrap-icons';
import handleAPIError from "../../common/handleAPIError";
import ITO from "./ITO";
import "./ITOList.css";
export default function ITOList() {
    const { error, isLoading, itoList, getSortingStatus, updateSortingMethod } = useITOList();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading) {
        return <div className="modalBackground"><img alt="Loading" src="/icon.gif" /></div>
    }
    return (
        <table className="border m-1 p-0">
            <thead>
                <tr>
                    <th className="text-center" colSpan={6}>ITO Management</th>
                </tr>
                <tr>
                    <th className="border text-center" onClick={() => { updateSortingMethod("name") }}>ITO Name{getSortingStatus("name")}</th>
                    <th className="border text-center" onClick={() => { updateSortingMethod("post") }}>Post Name{getSortingStatus("post")}</th>
                    <th className="border text-center" onClick={() => { updateSortingMethod("active") }}>Active{getSortingStatus("active")}</th>
                    <th className="border text-center">Edit</th>
                </tr>
            </thead>
            <tbody>
                {
                    itoList.map((ito, rowIndex) => (
                        <tr key={ito.itoId}>
                            <td className="border">
                                {ito.name}
                            </td>
                            <td className="border text-center">
                                {ito.post}
                            </td>
                            <td className="border text-center">
                                {ito.active}
                            </td>
                            <td className="border text-center">
                                <Link state={{ "ito": ito }} to="../itoManagement/edit">
                                    <Button variant="warning"><Pencil /></Button>
                                </Link>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
            <tfoot>
                <tr>
                    <td className="" colSpan={6}>
                        <div className="d-flex flex-grow-1 justify-content-end p-1">
                            <Link
                                state={{ "ito": new ITO() }}
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
    );
}