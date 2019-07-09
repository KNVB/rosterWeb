/*==============================================================================================*
 *																				  				*
 *	This is month picker object.									                  	        *
 *																								*
 *==============================================================================================*/
class MonthPicker extends HTMLTableElement
{
	constructor(options)
	{
		super();
		var self=this;
		var defaults={
						minValue: "1/1000",
						maxValue: "12/9999",
						initYear:new Date().getFullYear(),
						monthNames:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
						monthFullNames:['Jan','February','March','April','May','June','July','August','September','October','November','December'],
					 };
		options = $.extend({}, defaults, options);
		this.maxDateValue=(new Date(options.maxValue.split("/")[1],options.maxValue.split("/")[0],1)).getTime();
		this.minDateValue=(new Date(options.minValue.split("/")[1],options.minValue.split("/")[0],1)).getTime();
		this.maxYear=options.maxValue.split("/")[1];
		this.minYear=options.minValue.split("/")[1];
		this.monthNames=options.monthNames;
		this.monthFullNames=options.monthFullNames;
		this.initYear=options.initYear;
		this.onPickHandler=null;
		
		this.id="monthPickTable";
		this._buildMonthPickTable(this.initYear);
	}
	onPick(handler)
	{
		this.onPickHandler=handler;	
	}
	_buildMonthPickTable(pickYear)
	{
		var cell,monthValue,row;
		var rect,self=this,tbody,tempDateValue,thead;
		$(this).empty();
		thead=document.createElement("thead");
		$(thead).click(function(event){
				event.stopPropagation();
		});
		tbody=document.createElement("tbody");
		this.append(thead);
		row=thead.insertRow(thead.rows.length);
		cell=row.insertCell(row.cells.length);
		if (pickYear>this.minYear)
		{
			var downYearButton=document.createElement("button");
			downYearButton.className="downYearButton";
			downYearButton.textContent="<";
			cell.append(downYearButton);
			$(downYearButton).click(function (){
				event.stopPropagation();
				self._downYear(pickYear);
			});						
		}
		cell=row.insertCell(row.cells.length);
		cell.id="pickYear";
		cell.innerHTML=pickYear;
		cell=row.insertCell(row.cells.length);
		if (pickYear<this.maxYear)
		{
			var upYearButton=document.createElement("button");
			upYearButton.className="upYearButton";
			upYearButton.textContent=">";
			cell.append(upYearButton);
			$(upYearButton).click(function (){
				event.stopPropagation();
				self._upYear(pickYear);
			});						
		}
		for (var i=0;i<4;i++)
		{
			row=tbody.insertRow(tbody.rows.length);
			for (var j=0;j<3;j++)
			{
				let monthValue=i*3+j;
				cell=row.insertCell(row.cells.length);
				cell.innerHTML=this.monthNames[monthValue++];
				tempDateValue=(new Date(pickYear,monthValue,1)).getTime();
				if ((tempDateValue>=this.minDateValue) && (tempDateValue<=this.maxDateValue))
				{	
					cell.className="clickable";
					$(cell).click(function(){
						if (self.onPickHandler!=null)
						{
							self.onPickHandler(pickYear,monthValue,self.monthFullNames[monthValue-1]);
						}
					});
				}
				else
				{	
					cell.className="notAvailable";
					$(cell).click(function(event){
							event.stopPropagation();
					});
				}						
			}
		}
		this.append(tbody);
	}
	_clearMonthPickTable()
	{
		$(this.monthPickTable).hide();			
	}
	_downYear(pickYearValue)
	{
		if (pickYearValue>this.minYear)
		{
			pickYearValue--;
			this._buildMonthPickTable(pickYearValue);
		}
	}
	_showMonthPickTable(theElement)			
	{
		$(this).show();
	}
	_upYear(pickYearValue)				
	{
		if (pickYearValue<this.maxYear)
		{
			pickYearValue++;
			this._buildMonthPickTable(pickYearValue);
		}
	}
}
customElements.define('month-picker-table',
		MonthPicker, {
			extends: 'table'
		});
