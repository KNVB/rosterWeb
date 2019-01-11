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
		var addbtn,cell,firstITOId=null;
		let form=document.getElementById("updateITOInfoFormTemplate").cloneNode(true);
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
		addbtn=document.createElement("button");
		addbtn.textContent="Add New ITO";
		
		row=itoTable.insertRow(itoTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=4;
		cell.style.textAlign="right";
		cell.append(addbtn);
		addbtn.onclick=function(){
			form.reset();
			form.itoId.value="";
			$(form).find("span").remove();
			form.joinDate.value="";
			$(form.joinDate).datepicker("destroy");
			$(form.joinDate).datepicker({"defaultDate":new Date()});
			$(form.joinDate).datepicker("refresh");
			form.leaveDate.value="2099-12-31";
		};		
		
		$(this.container).append(itoTable);
		$(this.container).append("<br>");
		$(this.container).append(form);
		form.style.display="inline";
		this.loadITOInfo(firstITOId);
	}
	loadITOInfo(itoId)
	{
		var availableShiftList;
		var blackListShiftCell;
		var form=document.getElementById("updateITOInfoForm");
		var ito=this.itoList[itoId];
		var self=this,table;
		
		form.itoId.value=ito.itoId;
		form.itoName.value=ito.name;
		form.postName.value=ito.postName;
		form.workingHourPerDay.value=ito.workingHourPerDay;
		blackListShiftCell=$(form).children("table").find("td#blackListShiftPatterns")[0];
		$(blackListShiftCell).empty();
		$(form).find("input[name='availableShiftList']").each(function(){
				if ($.inArray(this.value,ito.availableShiftList)>-1)
					this.checked=true;
				else
					this.checked=false;
				});
		ito.blackListShiftPatternList.forEach(function(blackListShiftPattern){
			var input=document.createElement("input");
			var span=document.createElement("span");
			input.name="blackListShiftPattern";
			input.type="text";
			input.value=blackListShiftPattern;
			
			span.style.cursor="pointer";
			span.append(input);
			span.onclick=function(){
				$(this).remove();
			}
			
			$(span).append("&nbsp;-");
			
			blackListShiftCell.append(span);
			blackListShiftCell.append(document.createElement("br"));
		});
		
		$(form.joinDate).val(ito.joinDate.getFullYear()+"-"+(1+ito.joinDate.getMonth())+"-"+ito.joinDate.getDate());
		$(form.joinDate).datepicker({dateFormat:"yy-mm-dd",
			                         "defaultDate":ito.joinDate});
		
		$(form.leaveDate).val(ito.leaveDate.getFullYear()+"-"+(1+ito.leaveDate.getMonth())+"-"+ito.leaveDate.getDate());
		$(form.leaveDate).datepicker({dateFormat:"yy-mm-dd",
			                         "defaultDate":ito.leaveDate});
		$(form).submit(function(){
			var ito={};
			var availableShiftList=[];
			if (this.itoId.value=="")
				ito.itoid=this.postName.value+"_"+this.joinDate.value;
			else	
				ito.itoid=this.itoId.value;
			
			ito.itoname=this.itoName.value;
			ito.postName=this.postName.value;
			ito.workingHourPerDay=this.workingHourPerDay.value;
			ito.joinDate=new Date(self.adminUtility.getUTCDateObj(this.joinDate.value));
			ito.leaveDate=new Date(self.adminUtility.getUTCDateObj(this.leaveDate.value));
			this.availableShiftList.forEach(function(inputItem){
				if (inputItem.checked)
					availableShiftList.push(inputItem.value);
			});
			ito.availableShiftList=availableShiftList;
			self.adminUtility.updateITOInfo(ito)
			.done(function(){
				alert("The ITO information update success.");
			})
			.fail(function(){
				alert("The ITO information update failure.");
			});
		});
	}
}