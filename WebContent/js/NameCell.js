class NameCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.nameCellClassName);
	}
}
customElements.define('name-cell',
		NameCell, {
		extends: 'td'
		}
	);
