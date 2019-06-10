class EditableShiftCell extends BorderedAlignCenterCell
{
	constructor(shiftType,shiftClassName){
		super();
		this.textContent=shiftType;
		$(this).addClass(shiftClassName);
		$(this).addClass(Css.cursorCellClassName);
		this.contentEditable="true";
	}
}
customElements.define('editable-shift-cell',
		EditableShiftCell, {
		extends: 'td'
		}
	);
class PreferredShiftCell extends BorderedAlignCenterCell
{
	constructor(){
		super();
		$(this).addClass(Css.cursorCellClassName);
		this.contentEditable="true";
	}
}
customElements.define('preferred-shift-cell',
		PreferredShiftCell, {
		extends: 'td'
		}
	);