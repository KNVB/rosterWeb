class BorderCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
	}
}
customElements.define('border-cell',
		BorderCell, {
		extends: 'td'
		}
	);
