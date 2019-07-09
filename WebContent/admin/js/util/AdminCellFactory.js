/*==============================================================================================*
 *																				  				*
 *	This is Admin Cell object factory, which is extends from SimpleCellFactory object          	*
 *	It generates different type of admin. cells									  				*
 *																								*
 *==============================================================================================*/

class AdminCellFactory extends SimpleCellFactory
{
	static get AutoPlannerButtonCell()
	{
		var cell=document.createElement("td");
		cell.innerHTML="&nbsp;<a class=\"autoPlannerButton\">Auto Planner</a>";
		return cell;
	}
	static get AutoPlannerIterationCell()
	{
		var cell=document.createElement("td");
		var iterationCountInput=document.createElement("input");
		iterationCountInput.id="iterationCount";
		iterationCountInput.type="number";
		iterationCountInput.value="100";
		cell.appendChild(iterationCountInput);
		return cell;
	}
	static get AutoSchedulerResultDiv()
	{
		var autoSchedulerResultCell;
		var autoSchedulerResultTable=document.createElement("table");
		var autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		var div=document.createElement("div");
		
		div.id="genResult";
		div.style.paddingLeft="10px";
		div.style.display="none";

		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.colSpan=2;
		autoSchedulerResultCell.textContent="Standard Deviation:";

		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="theLowestSD";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";

		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="secondLowestSD";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";

		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="thirdLowestSD";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);

		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.colSpan=2;
		autoSchedulerResultCell.innerHTML="<br>";

		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.colSpan=2;
		autoSchedulerResultCell.textContent="Missing shift Count:";

		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="theLowestMissingShiftCount";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";

		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="theSecondLowestMissingShiftCount";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";

		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="theThirdLowestMissingShiftCount";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		div.append(autoSchedulerResultTable);
		return div;
	}
	static get ButtonTable()
	{
		var table=document.createElement("table");
		table.id="buttonTable";
		
		var row=table.insertRow(table.rows.length);
		var cell=row.insertCell(row.cells.length);
		
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"findMissingShiftButton\">Find Missing Shift</a>";

		cell=row.insertCell(row.cells.length);
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"findDuplicateShiftButton\">Find Duplicate Shift</a>";

		cell=row.insertCell(row.cells.length);
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"checkAllButton\">is it a valid roster?</a>";

		cell=row.insertCell(row.cells.length);
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"clearAllButton\">Clear All Shift Data</a>";

		row=table.insertRow(table.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=2;
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"exportButton\">Export to Excel File</a>";

		cell=row.insertCell(row.cells.length);
		cell.colSpan=2;
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"saveRosterToDBButton\">Save all data to DB</a>";
		return table;
	}
	static get FillEmptyShiftWithOButtonCell()
	{
		var cell=document.createElement("td");
		$(cell).addClass(AdminCss.alignCenterClassName);
		cell.colSpan=3;
		cell.innerHTML="<a class=\"fillEmptyShiftWithOButton\">Fill empty shift with \"O\"</a>";
		return cell;
	}
	static get PreferredShiftNameCell()
	{
		var cell=this.BorderedNameCell;
		cell.innerHTML="Preferred Shift";
		return cell;
	}
	static get VacantShiftCell()
	{
		var cell=this.BorderedAlignCenterCell;
		$(cell).addClass(AdminCss.vacantShiftClassName);
		return cell;
	}
	static get VacantShiftLabelCell()
	{
		var cell=this.BorderCell;
		cell.textContent="Vacant Shifts";
		$(cell).addClass(AdminCss.vacantShiftLabelClassName);
		return cell;
	}
/****************************************************************************************************
 *                                                                                                  * 
 *  Static Method                                                                                   *
 *                                                                                                  * 
 ****************************************************************************************************/	
	static getAutoPlannerSelectCell(dateObjList)
	{
		var cell=document.createElement("td");
		var autoPlanStartDateSelect=document.createElement("select");
		var autoPlanEndDateSelect=document.createElement("select");
		var i,option;
		autoPlanStartDateSelect.id="autoPlanStartDate";
		for (i=1;i<=Object.keys(dateObjList).length;i++)
		{
			option=document.createElement("option");
			option.value=i;
			option.text=i;
			autoPlanStartDateSelect.append(option);
		}
		cell.appendChild(autoPlanStartDateSelect);
		$(cell).append("&nbsp;to&nbsp;");

		autoPlanEndDateSelect.id="autoPlanEndDate";
		for (i=1;i<=Object.keys(dateObjList).length;i++)
		{
			option=document.createElement("option");
			option.value=i;
			option.text=i;
			autoPlanEndDateSelect.append(option);
		}	
		option.selected=true;
		cell.appendChild(autoPlanEndDateSelect);
		cell.colSpan=2;
		return cell;
	}
	/***********************************************************************************
	 *                                                                                 * 
	 * It returns a editable shift cell.                  	                           *
	 * If mouse over on this type of cell, 											   *
	 * the related date cell and ito cell would be high lighted.					   *
	 * The content of this type of shift cell is editable.							   *	
	 * The background color of this type of cell will be changed when shift type change*
	 *                                                                                 * 
	 ***********************************************************************************/
	static getEditableShiftCell(rosterSchedulerTable,itoId)
	{
		var cell=this.getCursoredShiftCell(rosterSchedulerTable);
		var editableCellHandler=new EditableCellHandler(cell,rosterSchedulerTable);
		$(cell).addClass(AdminCss.shiftCellClassName);
		$(cell).blur(function(event){
			rosterSchedulerTable.updateValue(this,itoId);
		});
		return cell;
	}
	/***********************************************************************************
	 *                                                                                 * 
	 * It returns a preferred shift cell.                                              *
	 * If mouse over on this type of cell, 											   *
	 * the related date cell and ito cell would be high lighted.					   *
	 * The content of this type of shift cell is editable					           *
	 *                                                                                 * 
	 ***********************************************************************************/
	static getPreferredShiftCell(rosterSchedulerTable)
	{
		var cell=this.BorderedAlignCenterCell;
		var editableCellHandler=new EditableCellHandler(cell,rosterSchedulerTable);
		this._addCursorEventHandler(cell,rosterSchedulerTable);
		return cell;
	}
}