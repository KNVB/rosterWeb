class BorderedNameCell extends NameCell
{
	constructor()
	{
		super();
		$(this).addClass(Css.borderCellClassName);
	}
}
customElements.define('bordered-name-cell',
		BorderedNameCell, {
			extends: 'td'
		});