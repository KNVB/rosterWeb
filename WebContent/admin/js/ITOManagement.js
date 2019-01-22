class ITOManagement
{
	constructor(container)
	{
		this.adminUtility=new AdminUtility();
		this.container=container;
		this.rosterRule=new RosterRule();
	}	
	showITOTable()
	{
		var cell;
		let form=document.getElementById("updateITOInfoFormTemplate").cloneNode(true);
		var itoTable=document.createElement("table");
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
		
		this.adminUtility.getAllITOInfo()
		.then(function(itoList){
			self.itoList=itoList;
			self._showITOList(itoTable,form);
		})
		.catch(function(xhr){
			//console.log(data);
			alert("Fail to get ITO Object List.");
			//alert(xhr.status);
		});
	}
	_addBlackListShiftPatternEntry(blackListShiftPattern,blackListShiftListDiv)
	{
		var div=document.createElement("div");
		var input=document.createElement("input");
		var span=document.createElement("span");
		
		input.name="blackListShiftPatternList";
		input.required = true;
		input.type="text";			
		input.value=blackListShiftPattern;
		
		span.style.cursor="pointer";
		span.className="fas fa-minus-circle";
		span.onclick=function(){
			$(div).remove();
		}
		div.append(input);
		div.append(span);
		blackListShiftListDiv.append(div);
	}
	_loadITOInfo(itoId)
	{
		var availableShiftList,addBlackListShiftEntryDiv;
		var blackListShiftListDiv,blackListShiftEntryDiv;
		var form=document.getElementById("updateITOInfoForm");
		var ito=this.itoList[itoId];
		var self=this,span,table;
		
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
		blackListShiftListDiv=$("div.blackListShiftListDiv")[0];
		$(blackListShiftListDiv).empty();
		
		ito.blackListShiftPatternList.forEach(function(blackListShiftPattern){
			self._addBlackListShiftPatternEntry(blackListShiftPattern,blackListShiftListDiv);
		});
		
		$(form.joinDate).val(ito.joinDate.getFullYear()+"-"+(1+ito.joinDate.getMonth())+"-"+ito.joinDate.getDate());
		$(form.joinDate).datepicker({changeMonth: true,
									 changeYear: true,
									 dateFormat:"yy-mm-dd",
									 "defaultDate":ito.joinDate});
		
		$(form.leaveDate).val(ito.leaveDate.getFullYear()+"-"+(1+ito.leaveDate.getMonth())+"-"+ito.leaveDate.getDate());
		$(form.leaveDate).datepicker({changeMonth: true,
			                          changeYear: true,
			                          dateFormat:"yy-mm-dd",
				                      "defaultDate":ito.leaveDate,});
		form.submitButton.value="Update";
	}
	_showITOList(itoTable,form)
	{
		var addbtn,cell,firstITOId=null;
		var link,ito,row,self=this;
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
				self._loadITOInfo(itoId);
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
		addbtn.onclick=function(){
			self._resetUpdateITOInfoForm();
		};
		
		row=itoTable.insertRow(itoTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=4;
		cell.style.textAlign="right";
		cell.append(addbtn);
		
		$(this.container).append(itoTable);
		$(this.container).append("<br>");
		$(this.container).append(form);

		
		$(form).find("span.fas.fa-minus-circle").click(function(){
			$(this).parent("div").remove();
		});
		
		var blackListShiftListDiv=$("div.blackListShiftListDiv")[0];
		$(form).find("span.fas.fa-plus-circle").click(function(){
			self._addBlackListShiftPatternEntry("",blackListShiftListDiv);
		});
		
		this._loadITOInfo(firstITOId);
		
		form.style.display="inline";
		
		$(form).submit(function(){
			try
			{
				var ito=self._validateITOInfoForm(this);
				self._submitITOInfoToServer(ito);
			}
			catch (err)
			{
				alert(err);
			}
			finally 
			{
				return false;
			}
		});
	}
	_resetUpdateITOInfoForm()
	{
		var self=this;
		var form=document.getElementById("updateITOInfoForm");
		form.reset();
		form.itoId.value="";
		 
		form.joinDate.value="";
		$(form.joinDate).datepicker("destroy");
		$(form.joinDate).datepicker({changeMonth: true,
			                         changeYear: true,
			                         dateFormat: 'yy-mm-dd',
			                         "defaultDate":new Date()});
		$(form.joinDate).datepicker("refresh");
		form.leaveDate.value="2099-12-31";
		
		var blackListShiftListDiv=$("div.blackListShiftListDiv")[0];
	
		$(blackListShiftListDiv).empty();
		self._addBlackListShiftPatternEntry("",blackListShiftListDiv);
		form.submitButton.value="Add";
	}
	_submitITOInfoToServer(ito)
	{
		var self=this;
		this.adminUtility.updateITOInfo(ito)
		.done(function(){
			alert("The ITO information update success.");
			self.showITOTable();
		})
		.fail(function(){
			alert("The ITO information update failure.");
		});
	}
	_validateITOInfoForm(form)
	{
		var availableShiftList=[];
		var ito={};
		var result=true;
		var self=this;
		
		if (form.itoId.value=="")
			ito.itoid=form.postName.value+"_"+form.joinDate.value;
		else	
			ito.itoid=form.itoId.value;
		ito.itoname=form.itoName.value;
		ito.postName=form.postName.value;
		ito.workingHourPerDay=form.workingHourPerDay.value;
		ito.joinDate=new Date(self.adminUtility.getUTCDateObj(form.joinDate.value));
		ito.leaveDate=new Date(self.adminUtility.getUTCDateObj(form.leaveDate.value));
		
		if ($("input[name='availableShiftList']:checked").length==0)
			throw "Please select an available shift type.";
		else
		{
			form.availableShiftList.forEach(function(inputItem){
				if (inputItem.checked)
					availableShiftList.push(inputItem.value);
			});
			ito.availableShiftList=availableShiftList;
			if ($(form).find("input[name='blackListShiftPatternList']").length==0)
			{
				throw "Black Listed Shift Type must be included.";
			}
			else
			{
				var shiftType;
				result=true;
				for (var i=0;i<$(form.blackListShiftPatternList).length;i++)
				{
					var blackListShiftPatternList=$(form.blackListShiftPatternList)[i].value.split(",");
					for (var j=0;j<blackListShiftPatternList.length;j++)
					{
						shiftType=blackListShiftPatternList[j];
						if ($.inArray(shiftType,availableShiftList)==-1)
						{	
							result=false;
							break;
						}
					}
					if (result==false)
					{
						$(form.blackListShiftPatternList)[i].focus();
						throw "Invalid shift type entered.";
						break;
					}	
				}
				if (result==true)
				{
					ito.blackListedShiftPatternList=[];
					for (var i=0;i<$(form.blackListShiftPatternList).length;i++)
					{
						ito.blackListedShiftPatternList.push($(form.blackListShiftPatternList)[i].value);
					}
					return ito;
				}	
			}	
		}
	}
}