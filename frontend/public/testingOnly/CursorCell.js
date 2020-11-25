class CursorCell extends HTMLTableCellElement {
	constructor() {
		super();
		this.textBox = document.createElement("input");
		this.textBox.type = "text";
		this.appendChild(this.textBox);
		$(this).addClass("borderCell");
		$(this).addClass("dateCell");
		$(this).addClass("cursorCell");
	}
	
	focus()
	{
		this.textBox.focus();
		console.log("Focus");
	}
	select()
	{
		this.textBox.select();
		console.log("Select");
	}				
	set textContent(t)
	{
		this.value = t;
	}
	get textContent()
	{
		return this.textBox.value ;
	}
	set value(v) 
	{
		this.textBox.value = v;
	}
	get value() 
	{
		return this.textBox.value;
	}
}
customElements.define('cursorcell-string',
	CursorCell, {
		extends: 'td'
	});