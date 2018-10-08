class RosterSchedulerTable extends RosterTable
{
	constructor()
	{
		super();
		this.preferredShiftList;
		this.preferredShiftRowList={};
		this.utility=new RosterSchedulerUtility();
	}
	show()
	{
		var row,self=this;
		console.log(this.preferredShiftList);
		super.genRosterRowList();
		self.genPreferredShiftRowList();
		this.itoIdList.forEach(function(itoId){
			row=self.rosterRowList[itoId];
			self.rosterBody.append(row);
			row=self.preferredShiftRowList[itoId];
			self.rosterBody.append(row);
		});
	}
	genPreferredShiftRowList()
	{
		var cell;
		var i,itoPreferredShiftList,itoRoster;
		var row,self=this;
		
		this.itoIdList.forEach(function(itoId){
			row=document.createElement("tr");
			itoPreferredShiftList=self.preferredShiftList[itoId];

			row.id="preferredShift_"+itoId;
			cell=row.insertCell(row.cells.length);
			cell.className="alignLeft borderCell";
			cell.textContent="Preferred Shift";
			for (i=0;i<self.showNoOfPrevDate;i++)
			{
				cell=row.insertCell(row.cells.length);
				cell.className="alignCenter borderCell";
			}
			for (i=0;i<31;i++)
			{
				cell=row.insertCell(row.cells.length);
				cell.className="alignCenter borderCell cursorCell";
				if (itoPreferredShiftList[i+1]!=null)
				{
					cell.textContent=itoPreferredShiftList[i+1];
				}	
			}	
			self.preferredShiftRowList[itoId]=row;
		});
	}
}