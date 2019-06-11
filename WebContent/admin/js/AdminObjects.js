class AutoPlannerButtonCell extends HTMLTableCellElement
{
	constructor(){
		super();
		this.innerHTML="&nbsp;<a class=\"autoPlannerButton\">Auto Planner</a>";
	}
}
customElements.define('auto-planner-button-cell',
		AutoPlannerButtonCell, {
		extends: 'td'
		}
	);
class AutoPlannerIterationCell extends HTMLTableCellElement
{
	constructor(){
		super();
		var iterationCountInput=document.createElement("input");
		iterationCountInput.id="iterationCount";
		iterationCountInput.type="number";
		iterationCountInput.value="100";
		this.appendChild(iterationCountInput);
	}
}
customElements.define('auto-planner-iteration-cell',
		AutoPlannerIterationCell, {
		extends: 'td'
		}
	);
class AutoPlannerSelectCell extends HTMLTableCellElement
{
	constructor(dateObjList){
		super();
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
		this.appendChild(autoPlanStartDateSelect);
		$(this).append("&nbsp;to&nbsp;");
		
		autoPlanEndDateSelect.id="autoPlanEndDate";
		for (i=1;i<=Object.keys(dateObjList).length;i++)
		{
			option=document.createElement("option");
			option.value=i;
			option.text=i;
			autoPlanEndDateSelect.append(option);
		}	
		option.selected=true;
		this.appendChild(autoPlanEndDateSelect);
		this.colSpan=2;
	}
}
customElements.define('auto-planner-select-cell',
		AutoPlannerSelectCell, {
		extends: 'td'
		}
	);
class AutoSchedulerResultDiv extends HTMLDivElement
{
	constructor(){
		super();
		this.id="genResult";
		this.style.paddingLeft="10px";
		this.style.display="none";
		var autoSchedulerResultCell;
		var autoSchedulerResultTable=document.createElement("table");
		var autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
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
		this.append(autoSchedulerResultTable);
	}
}
customElements.define('auto-scheduler-result-div',
		AutoSchedulerResultDiv, {
		extends: 'div'
		}
	);
class ButtonTable extends HTMLTableElement
{
	constructor(){
		super();
		this.id="buttonTable";
		
		var row=this.insertRow(this.rows.length);
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
		
		row=this.insertRow(this.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=2;
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"exportButton\">Export to Excel File</a>";
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=2;
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"saveRosterToDBButton\">Save all data to DB</a>";
	}
}
customElements.define('button-table',
		ButtonTable, {
		extends: 'table'
		}
	);

class EditableShiftCell extends ReadOnlyShiftCell
{
	constructor(rosterTable){
		super(rosterTable);
		this.contentEditable="true";
		$(this).click(function(event){
			event.preventDefault();
			var range = document.createRange();
		    range.selectNodeContents(this);
		    var sel = window.getSelection();
		    sel.removeAllRanges();
		    sel.addRange(range);
		    console.log("click");
		});
		$(this).dblclick(function(event){
			event.preventDefault();
			var sel = window.getSelection();
			this.focus();
			sel.collapse(this.firstChild, 1);
			console.log("double click");
		});
	}
}
customElements.define('editable-shift-cell',
		EditableShiftCell, {
		extends: 'td'
		}
	);
class FillEmptyShiftWithOButtonCell extends HTMLTableCellElement
{
	constructor(){
		super();
		$(this).addClass(AdminCss.alignCenterClassName);
		this.colSpan=3;
		this.innerHTML="<a class=\"fillEmptyShiftWithOButton\">Fill empty shift with \"O\"</a>";
	}
}
customElements.define('fill-empty-shift-with-o-button-cell',
		FillEmptyShiftWithOButtonCell, {
		extends: 'td'
		}
	);

class PreferredShiftCell extends CursorCell
{
	constructor(rosterTable){
		super(rosterTable);
		$(this).addClass(Css.cursorCellClassName);
		this.contentEditable="true";
	}
}
customElements.define('preferred-shift-cell',
		PreferredShiftCell, {
		extends: 'td'
		}
	);
class VacantShiftCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		$(this).addClass(AdminCss.vacantShiftClassName);
	}
}
customElements.define('vacant-shift-cell',
		VacantShiftCell, {
		extends: 'td'
		}
	);

class VacantShiftLabelCell extends BorderCell
{
	constructor() {
		super();
		this.textContent="Vacant Shifts";
		$(this).addClass(AdminCss.vacantShiftLabelClassName);
	}
}
customElements.define('vacant-shift-label-cell',
		VacantShiftLabelCell, {
		extends: 'td'
		}
	);
