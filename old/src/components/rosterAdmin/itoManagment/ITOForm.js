import { useITOForm } from "../../../hooks/useITOForm";
import handleAPIError from "../../common/handleAPIError";
import ITODetail from "./ITODetail";
import Loading from "../../common/Loading";
export default function ITOForm({ itoAction }) {
    const { activeShiftList, error, isLoading, ito, updateAction } = useITOForm();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading) {
        return <Loading />
    }
    return (
        <ITODetail
            activeShiftList={activeShiftList}
            ito={ito}
            itoAction={itoAction}
            updateAction={updateAction} />
    );
}