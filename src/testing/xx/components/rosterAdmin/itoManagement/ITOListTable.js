import ITO from '../ITO';
export default function ITOListTable(props){
    let addITO=(e)=>{
        let ito=new ITO();
        ito.itoId='-1';
        ito.availableShiftList=props.activeShiftInfoList.essentialShift.split('');
        ito.blackListedShiftPatternList=[''];
        ito.joinDate=new Date();
        ito.leaveDate=new Date('2099-12-31');
        props.setITO(ito);
    }
    const itoRowList = Object.entries(props.allITOList).map(([itoId, ito]) => (
        <tr key={itoId}>
            <td className="p-1">
                <span
                    className="text-primary cursor-pointer"
                    onClick={()=>props.setITO(props.allITOList[itoId])}>
                    <u>{ito.itoName}</u>
                </span>
            </td>
            <td>{ito.postName}</td>
            <td>{ito.availableShiftList.join(',')}</td>
            <td>{ito.workingHourPerDay}</td>
        </tr>
    ));
    return (
        <div className="d-flex flex-column flex-grow-1 justify-content-center">
            <table className="itoListTable">
                <thead>
                    <tr>
                        <th>ITO Name</th>
                        <th>Post Name</th>
                        <th>Avaliable Shift Type</th>
                        <th>No. of Working Hour Per Day</th>
                    </tr>
                </thead>
                <tbody>
                    {itoRowList}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4" className="p-1 text-right">
                            <button onClick={addITO}>Add New ITO</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}