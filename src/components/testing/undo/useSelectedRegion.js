import {useCallback,useEffect,useState } from "react";
import CopiedRegion from './CopiedRegion';
import SelectedRegion from './SelectedRegion';
export default function useSelectedRegion(){
  const [selectedRegion,setSelectedRegion]=useState(new SelectedRegion());
  const [copiedRegion,setCopiedRegion]=useState(new CopiedRegion());
  const copySelectedRegion=(clipboardData)=>{
    let table=document.getElementById("rosterTable");
    let result=[],col,row;
    
    for (let y=selectedRegion.minY;y<=selectedRegion.maxY;y++){
        row=table.rows[y];
        col=[];
        for (let x=selectedRegion.minX;x<=selectedRegion.maxX;x++){
          //console.log(itoId,rosterData[itoId].shiftList[x-systemParam.noOfPrevDate]);
          col.push(row.cells[x].textContent);
        }
        result.push(col);
    }
    clipboardData.setData('application/json',JSON.stringify(result));
    let copiedRegion={
      minX:selectedRegion.minX,
      minY:selectedRegion.minY,
      maxX:selectedRegion.maxX,
      maxY:selectedRegion.maxY
    }
    setCopiedRegion(copiedRegion);
  } 

  const endSelect=()=>{
    if (selectedRegion.inSelectMode){
      let temp=JSON.parse(JSON.stringify(selectedRegion));
      temp.inSelectMode=false;
      setSelectedRegion(temp);
    }
  }
  const getBorderClass=(cellIndex,rowIndex)=>{
    let result=getCopiedRegionCssClass(cellIndex,rowIndex);
    if (result.length>0){
      return result.join(' ');
    } else {
      return getSelectedRegionBorderClass(cellIndex,rowIndex).join(' ');
    }
  }
  const getCopiedRegionCssClass=(cellIndex,rowIndex)=>{
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
  const getSelectedRegionBorderClass=(cellIndex,rowIndex)=>{
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
  const pasteCopiedRegion=(clipboardData,rosterList,undoUtil)=>{
    let copiedData=JSON.parse(clipboardData.getData('application/json'));
    let destX=selectedRegion.maxX,destY=selectedRegion.maxY+copiedData.length;
    let cell,itoId,range,row,selection;
    let table=document.getElementById("rosterTable");
    let temp=JSON.parse(JSON.stringify(rosterList.present));
    cell=table.rows[destY-1].cells[destX];
    if ((cell)&&(cell.classList.contains("shiftCell"))){
      destY=selectedRegion.minY;
      for(let y=0;y<copiedData.length;y++){
          row=table.rows[destY++];
          itoId=row.id;
          destX=selectedRegion.minX;
          for (let x=0;x<copiedData[y].length;x++){
            temp[itoId].shiftList[destX++]=copiedData[y][x];
            undoUtil.set(temp);
          }
      }
      cell=table.rows[selectedRegion.minY].cells[selectedRegion.minX];
      range = document.createRange();
      range.selectNodeContents(cell);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      temp=JSON.parse(JSON.stringify(selectedRegion));
      temp.maxX=destX-1;
      temp.maxY=destY-1;      
      setSelectedRegion(temp);
    } else {
      console.log("hi");
    }

  }
  const startSelect=(theCell)=>{
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
  const updateSelect=(theCell)=>{
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
  return [startSelect,endSelect,updateSelect,copiedRegion,copySelectedRegion,getBorderClass,pasteCopiedRegion,selectedRegion]
}