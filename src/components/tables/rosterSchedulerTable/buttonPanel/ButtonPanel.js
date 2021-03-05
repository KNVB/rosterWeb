import "./ButtonPanel.css";
export default function ButtonPanel(){
    
    return(
        <table id="buttonTable">
            <tbody>
                <tr>
                    <td className="text-center p-1">
                        <a className="findMissingShiftButton" href="#0">
                            Find Missing Shift
                        </a>
                    </td>
                    <td className="text-center p-1">
                        <a className="findDuplicateShiftButton" href="#0">
                            Find Duplicate Shift
                        </a>
                    </td>
                    <td className="text-center p-1">
                        <a className="checkAllButton" href="#0">
                            is it a valid roster?
                        </a>
                    </td>
                    <td className="text-center p-1">
                        <a className="clearAllButton" href="#0">
                            Clear All Shift Data
                        </a>
                    </td>
                </tr>
                <tr>
                    <td className="text-center p-1" colSpan="2">
                        <a className="exportButton" href="#0">
                            Export to Excel File
                        </a>
                    </td>
                    <td className="text-center p-1" colSpan="2">
                        <a className="saveRosterToDBButton" href="#0">
                            Save all data to DB
                        </a>
                    </td>                  
                </tr>
            </tbody>
        </table>
    )
}