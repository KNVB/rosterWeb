class DateCell extends BorderCell
{
	constructor() {
		super();
		$(this).addClass(Css.dateCellClassName);
	}
}
customElements.define('data-cell',
		DateCell, {
			extends: 'td'
		});	