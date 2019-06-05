class DateCell extends BorderCell
{
	constructor(dateCellClassName) {
		super();
		$(this).addClass(dateCellClassName);
	}
}
customElements.define('datacell-string',
		DateCell, {
			extends: 'td'
		});	