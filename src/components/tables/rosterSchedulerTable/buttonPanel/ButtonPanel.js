import "./ButtonPanel.css";
export default function ButtonPanel(){
    return(
        <table id="buttonTable">
            <tbody>
                <tr>
                    <td className="text-center p-1">
                        <a className="findMissingShiftButton">
                            Find Missing Shift
                        </a>
                    </td>
                    <td className="text-center p-1">
                        <a className="findDuplicateShiftButton">
                            Find Duplicate Shift
                        </a>
                    </td>
                    <td className="text-center p-1">
                        <a className="checkAllButton">
                            is it a valid roster?
                        </a>
                    </td>
                    <td className="text-center p-1">
                        <a className="clearAllButton">
                            Clear All Shift Data
                        </a>
                    </td>
                </tr>
                <tr>
                    <td className="text-center p-1" colSpan="2">
                        <a className="exportButton">
                            Export to Excel File
                        </a>
                    </td>
                    <td className="text-center p-1" colSpan="2">
                        <a className="saveRosterToDBButton">
                            Save all data to DB
                        </a>
                    </td>                  
                </tr>
            </tbody>
        </table>
    )
}