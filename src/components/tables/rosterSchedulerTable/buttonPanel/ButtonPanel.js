import "./ButtonPanel.css";
export default function ButtonPanel(){
    return(
        <table id="buttonTable">
            <tbody>
                <tr>
                    <td className="text-center">
                        <button className="findMissingShiftButton">
                            Find Missing Shift
                        </button>
                    </td>
                    <td className="text-center">
                        <button className="findDuplicateShiftButton">
                            Find Duplicate Shift
                        </button>
                    </td>
                    <td className="text-center">
                        <button className="checkAllButton">
                            is it a valid roster?
                        </button>
                    </td>
                    <td className="text-center">
                        <button className="clearAllButton">
                            Clear All Shift Data
                        </button>
                    </td>
                </tr>
                <tr>
                    <td className="text-center" colSpan="2">
                        <button className="exportButton">
                            Export to Excel File
                        </button>
                    </td>
                    <td className="text-center" colSpan="2">
                        <button className="saveRosterToDBButton">
                            Save all data to DB
                        </button>
                    </td>                  
                </tr>
            </tbody>
        </table>
    )
}