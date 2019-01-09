class ITOManagement
{
	constructor(container)
	{
		this.adminUtility=new AdminUtility();
		this.container=container;
		this.rosterRule=new RosterRule();
	}
	loadITOList(year,month)
	{	
		var self=this;
		this.year=year;
		this.month=month;
		return new Promise((resolve, reject) =>{
			self.adminUtility.getITOList(year,month)
			.then(function(itoList){
				self.itoList=itoList;
				resolve();
			})
			.catch(function(data){
				alert("Fail to get ITO Object List.");
				reject();
			});	
		});
	}
	showITOTable()
	{
		var cell,ito,itoTable=document.createElement("table");
		var link;
		var row=itoTable.insertRow(itoTable.rows.length);
		var self=this;
		$(this.container).empty();
		$(itoTable).attr("border","1");
		
		cell=row.insertCell(row.cells.length);
		cell.textContent="ITO Name";
		
		cell=row.insertCell(row.cells.length);
		cell.textContent="Post Name";
		
		cell=row.insertCell(row.cells.length);
		cell.textContent="Avaliable Shift Type";
		
		cell=row.insertCell(row.cells.length);
		cell.textContent="No. of Working Hour Per Day";
		
		$(this.container).empty();
		for (let itoId in this.itoList)
		{	
			ito=this.itoList[itoId];
			row=itoTable.insertRow(itoTable.rows.length);
			
			link=document.createElement("a");
			link.textContent=ito.name;
			link.href="#";
			link.addEventListener("click",function(){
				self.showITOInfo(itoId);
			});
			
			cell=row.insertCell(row.cells.length);
			cell.append(link);
			
			cell=row.insertCell(row.cells.length);
			cell.textContent=ito.postName;
			
			cell=row.insertCell(row.cells.length);
			cell.textContent=ito.availableShiftList;

			cell=row.insertCell(row.cells.length);
			cell.textContent=ito.workingHourPerDay;
		}
		$(this.container).append(itoTable);
	}
	showITOInfo(itoId)
	{
		var cell;
		var form=document.createElement("form");
		var input,ito,itoInfoTable=document.createElement("table");
		var link;
		var row=itoInfoTable.insertRow(itoInfoTable.rows.length);
		var self=this,textNode;
		$(this.container).empty();
		ito=this.itoList[itoId];
		$(itoInfoTable).attr("border","1");
		input=document.createElement("input");
		input.type="hidden";
		input.value=ito.itoId;
		input.name="itoId";
		form.append(input);
	
		cell=row.insertCell(row.cells.length);
		cell.textContent="ITO Name";
		
		input=document.createElement("input");
		input.type="text";
		input.value=ito.name;
		input.name="itoName";
		input.required = true;
		
		cell=row.insertCell(row.cells.length);
		cell.append(input);
		
		row=itoInfoTable.insertRow(itoInfoTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.textContent="Post Name";
		
		input=document.createElement("input");
		input.type="text";
		input.value=ito.postName;
		input.name="postName";
		input.required = true;
		
		cell=row.insertCell(row.cells.length);
		cell.append(input);
		
		row=itoInfoTable.insertRow(itoInfoTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.textContent="Avaliable Shift Type";
		
		cell=row.insertCell(row.cells.length);
		for (var shiftType in this.rosterRule.shiftHourCount)
		{
			input=document.createElement("input");
			input.type="checkbox";
			input.value=shiftType;
			input.name="availableShiftList";
			
			if (jQuery.inArray(shiftType,ito.availableShiftList)>-1)
				input.checked=true;
			
			textNode=document.createTextNode(shiftType);
			cell.append(textNode);
			cell.append(input);
		}
		row=itoInfoTable.insertRow(itoInfoTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.textContent="No. of Working Hour Per Day";
		
		input=document.createElement("input");
		input.type="number";
		input.value=ito.workingHourPerDay;
		input.name="workingHourPerDay";
		input.required = true;
		
		cell=row.insertCell(row.cells.length);
		cell.append(input);
		
		row=itoInfoTable.insertRow(itoInfoTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.textContent="Join Date";
		
		cell=row.insertCell(row.cells.length);
		input=document.createElement("input");
		input.type="date";
		input.value=ito.joinDate.getFullYear()+"-"+(ito.joinDate.getMonth()+1)+"-"+ito.joinDate.getDate();
		input.name="joinDate";
		input.required = true;
		//console.log(ito.joinDate.getFullYear()+"-"+ito.joinDate.getMonth()+"-"+ito.joinDate.getDate());
		cell.append(input);
		
		row=itoInfoTable.insertRow(itoInfoTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=2;
		cell.style.textAlign="right";
		link=document.createElement("a");
		link.textContent="<";
		link.href="#";
		link.addEventListener("click",function(){
			self.showITOTable();
		});
		cell.append(link);
		
		form.append(itoInfoTable);
		$(this.container).append(form);
		console.log(ito.blackListShiftPatternList);
	}
}