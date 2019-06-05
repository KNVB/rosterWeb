class BorderCell extends HTMLTableCellElement
{
	constructor(borderClassName) {
		super();
		$(this).addClass(borderClassName);
	}
}
customElements.define('bordercell-string',
		BorderCell, {
		extends: 'td'
		}
	);
