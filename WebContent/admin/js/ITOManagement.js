class ITOManagement
{
	constructor(container)
	{
		this.adminUtility=new AdminUtility();
		this.container=container;
		this.rosterRule=new RosterRule();
	}
	loadITOList()
	{	
		var self=this;
		return new Promise((resolve, reject) =>{
			self.adminUtility.getAllITOInfo()
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
		var cell,firstITOId=null;
		var form=document.getElementById("updateITOInfoFormTemplate").cloneNode(true);
		var link,ito,itoTable=document.createElement("table");
		var row=itoTable.insertRow(itoTable.rows.length);
		var self=this;
		$(this.container).empty();
		form.id="updateITOInfoForm";
		
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
			
			if (firstITOId==null)
				firstITOId=itoId;
			link=document.createElement("a");
			link.textContent=ito.name;
			link.href="#";
			link.addEventListener("click",function(){
				self.loadITOInfo(itoId);
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
		$(this.container).append("<br>");
		$(this.container).append(form);
		form.style.display="inline";
		this.loadITOInfo(firstITOId);
	}
	loadITOInfo(itoId)
	{
		var availableShiftList;
		var form=document.getElementById("updateITOInfoForm");
		var ito=this.itoList[itoId];
		
		form.itoId.value=ito.itoId;
		form.itoName.value=ito.name;
		form.postName.value=ito.postName;
		form.workingHourPerDay.value=ito.workingHourPerDay;
		
		$(form).find("input[name='availableShiftList']").each(function(){
				if ($.inArray(this.value,ito.availableShiftList)>-1)
					this.checked=true;
				else
					this.checked=false;
				});
		$(form.joinDate).val(ito.joinDate.getFullYear()+"-"+(1+ito.joinDate.getMonth())+"-"+ito.joinDate.getDate());
		$(form.joinDate).datepicker({dateFormat:"yy-mm-dd",
			                         "defaultDate":ito.joinDate});
		
		$(form.leaveDate).val(ito.leaveDate.getFullYear()+"-"+(1+ito.leaveDate.getMonth())+"-"+ito.leaveDate.getDate());
		$(form.leaveDate).datepicker({dateFormat:"yy-mm-dd",
			                         "defaultDate":ito.leaveDate});
		$(form).submit(function(){
			var ito=new ITO();
			ito.itoId=this.itoId.value;
			ito.name=this.itoName.value;
			ito.postName=this.postName.value;
			ito.workingHourPerDay=this.workingHourPerDay.value;
			ito.joinDate=this.joinDate.value;
			ito.leaveDate=this.leaveDate.value;
			console.log(JSON.stringify(ito));
		});
	}
}