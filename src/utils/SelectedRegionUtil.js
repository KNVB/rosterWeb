export default class SelectedRegionUtil{
    static copySelectedRegion(clipboardData,rosterData,selectedRegion,setCopiedRegion,systemParam){
      let itoId,row,table=document.getElementById("rosterTable");
      let result=[],col;
      for (let y=selectedRegion.minY;y<=selectedRegion.maxY;y++){
        row=table.rows[y];
        itoId=row.id.replace("_roster","");
        col=[];
        for (let x=selectedRegion.minX;x<=selectedRegion.maxX;x++){
          //console.log(itoId,rosterData[itoId].shiftList[x-systemParam.noOfPrevDate]);
          col.push(rosterData[itoId].shiftList[x-systemParam.noOfPrevDate]);
        }
        result.push(col);
      }
      clipboardData.setData('text',JSON.stringify(result));
      let copiedRegion={
        minX:selectedRegion.minX,
        minY:selectedRegion.minY,
        maxX:selectedRegion.maxX,
        maxY:selectedRegion.maxY
      }
      setCopiedRegion(copiedRegion);
    }
    static endSelect(selectedRegion,setSelectedRegion){
        if (selectedRegion.inSelectMode){
          let temp=JSON.parse(JSON.stringify(selectedRegion));
          temp.inSelectMode=false;
          let table=document.getElementById("rosterTable");
          let cell=table.rows[selectedRegion.minY].cells[selectedRegion.minX];
          let range = document.createRange();
          let sel = window.getSelection();
          range.selectNodeContents(cell);
          sel.removeAllRanges();
          sel.addRange(range);
          setSelectedRegion(temp);
        }
    }
    
    static getCopiedRegionCssClass(cellIndex,rowIndex,copiedRegion){
      let result=[];
      if ((rowIndex===copiedRegion.minY) && (cellIndex>=copiedRegion.minX) &&(cellIndex<=copiedRegion.maxX)){
        result.push("copiedCellBorderTop");
      }
      if ((rowIndex===copiedRegion.maxY) && (cellIndex>=copiedRegion.minX) &&(cellIndex<=copiedRegion.maxX)){
        result.push("copiedCellBorderBottom");
      }
      if ((cellIndex===copiedRegion.maxX) && (rowIndex>=copiedRegion.minY) &&(rowIndex<=copiedRegion.maxY)){
        result.push("copiedCellBorderRight");
      }
      if ((cellIndex===copiedRegion.minX) && (rowIndex>=copiedRegion.minY) &&(rowIndex<=copiedRegion.maxY)){
        result.push("copiedCellBorderLeft");
      }
      return result;
    }    
    static getSelectedRegionCssClass(cellIndex,rowIndex,selectedRegion){
        let result=[];
        if ((rowIndex===selectedRegion.minY) && (cellIndex>=selectedRegion.minX) &&(cellIndex<=selectedRegion.maxX)){
          result.push("selectCellBorderTop");
        }
        if ((rowIndex===selectedRegion.maxY) && (cellIndex>=selectedRegion.minX) &&(cellIndex<=selectedRegion.maxX)){
          result.push("selectCellBorderBottom");
        }
        if ((cellIndex===selectedRegion.maxX) && (rowIndex>=selectedRegion.minY) &&(rowIndex<=selectedRegion.maxY)){
          result.push("selectCellBorderRight");
        }
        if ((cellIndex===selectedRegion.minX) && (rowIndex>=selectedRegion.minY) &&(rowIndex<=selectedRegion.maxY)){
          result.push("selectCellBorderLeft");
        }
        return result;
    }
    static pasteCopiedData(clipboardData,selectedRegion,copiedRegion,setCopiedRegion,setRosterData,systemParam,rosterData){
      let copiedData=JSON.parse(clipboardData.getData('text'));
      let table=document.getElementById("rosterTable");
      let cell=table.rows[selectedRegion.minY].cells[selectedRegion.minX];
      //cell.textContent=copiedData[0][0];
      //cell.blur();
      let range = document.createRange();
      let sel = window.getSelection();
      range.selectNodeContents(cell);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("insertText",false,copiedData[0][0]);
      
      cell=table.rows[selectedRegion.minY].cells[selectedRegion.minX+1];
      range.selectNodeContents(cell);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("insertText",false,copiedData[0][0]);
      
      cell=table.rows[selectedRegion.minY].cells[selectedRegion.minX+1];
      range.selectNodeContents(cell);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("insertText",false,copiedData[0][0]);

     /*
      let destItoIdList=[],srcItoIdList=[],row;
      let destCellY=selectedRegion.minY,destCellX=selectedRegion.minX;
			let destWidth=selectedRegion.maxX-selectedRegion.minX+1;
			let destHeight=selectedRegion.maxY-selectedRegion.minY+1;
      let destStartCellIndex=selectedRegion.minX;

      let srcWidth=copiedRegion.maxX-copiedRegion.minX+1;
			let srcHeight=copiedRegion.maxY-copiedRegion.minY+1;

      let srcStartCellIndex=copiedRegion.minX-systemParam.noOfPrevDate;
      let srcEndCellIndex=srcWidth+srcStartCellIndex;
      
      let table=document.getElementById("rosterTable");
      let tempRosterData=JSON.parse(JSON.stringify(rosterData));
      let horizontalCopyTime=Math.floor(destWidth/srcWidth);
			let verticalCopyTime=Math.floor(destHeight/srcHeight);
			
			if (verticalCopyTime===0)
				verticalCopyTime=1;
			if (horizontalCopyTime===0)
				horizontalCopyTime=1;

      for (let y=copiedRegion.minY;y<=copiedRegion.maxY;y++){
        row=table.rows[y];
        srcItoIdList.push(row.id.replace("_roster",""));
      }      
      for (let y=selectedRegion.minY;y<=selectedRegion.maxY;y++){
        row=table.rows[y];
        destItoIdList.push(row.id.replace("_roster",""));
      }
      
      for (let i=0;i<srcItoIdList.length;i++){
        let destRow=document.getElementById(destItoIdList[i]+"_roster");
        let srcShiftList=tempRosterData[srcItoIdList[i]].shiftList;
        let destCellIndex=selectedRegion.minX;
        
        for (let j=srcStartCellIndex;j<srcEndCellIndex;j++){
          let destCell=destRow.cells[destCellIndex++];
          let range = document.createRange();
          let sel = window.getSelection();
          destCell.focus();
          range.selectNodeContents(destCell);
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand("insertText",false,srcShiftList[j]);
          destCell.blur();
        }        
      }
      setCopiedRegion({
        minX:-1,
        minY:-1,
        maxX:-1,
        maxY:-1
      })
      setRosterData(tempRosterData);
      //console.log(srcItoIdList,destItoIdList);
      */
    }
   static startSelect(theCell,selectedRegion,setSelectedRegion){
    let row=theCell.parentElement;
    let temp=JSON.parse(JSON.stringify(selectedRegion));
    temp.firstX=theCell.cellIndex;
    temp.firstY=row.rowIndex;
    temp.minX=theCell.cellIndex;
    temp.minY=row.rowIndex;
    temp.maxX=theCell.cellIndex;
    temp.maxY=row.rowIndex;
    temp.inSelectMode=true;
    console.log("temp="+JSON.stringify(temp));
    setSelectedRegion(temp);
  }
  static updateSelect(theCell,selectedRegion,setSelectedRegion){
    if (selectedRegion.inSelectMode){
      let cellIndex=theCell.cellIndex;
			let isChanged=false;
			let newMaxX=selectedRegion.maxX,newMinX=selectedRegion.minX;
			let newMaxY=selectedRegion.maxY,newMinY=selectedRegion.minY;
			let row=theCell.parentElement;
			let rowIndex=row.rowIndex;

      if (cellIndex<selectedRegion.firstX)
			{
				newMinX=cellIndex;
				isChanged=true;
			}
			else
			{
				if (cellIndex>selectedRegion.firstX)
				{
					newMaxX=cellIndex;
					isChanged=true;
				}
				else
				{
					newMinX=selectedRegion.firstX;
					newMaxX=selectedRegion.firstX;
					isChanged=true;
				}	
			}
			if (rowIndex>selectedRegion.firstY)
			{
				newMaxY=rowIndex;
				isChanged=true;
			}
			else
			{
				if (rowIndex<selectedRegion.firstY)
				{
					newMinY=rowIndex;
					isChanged=true;
				}
				else
				{
					newMinY=selectedRegion.firstY;
					newMaxY=selectedRegion.firstY;
					isChanged=true;
				}	
			}
      if (isChanged){
        //console.log("isChanged=true");
        let temp=JSON.parse(JSON.stringify(selectedRegion))
        temp.minX=newMinX;
				temp.maxX=newMaxX;
				
				temp.minY=newMinY;
			  temp.maxY=newMaxY;
        setSelectedRegion(temp);
      }
    }
  }   
}