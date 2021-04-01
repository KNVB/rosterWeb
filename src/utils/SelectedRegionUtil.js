export default class SelectedRegionUtil{
    static copySelectedRegion(selectedRegion,setCopiedRegion){
      let copiedRegion={
        minX:selectedRegion.minX,
        minY:selectedRegion.minY,
        maxX:selectedRegion.maxX,
        maxY:selectedRegion.maxY
      }
      setCopiedRegion(copiedRegion);
      /*
      console.log("inSelectMode="+selectedRegion.inSelectMode);
      let temp=JSON.parse(JSON.stringify(selectedRegion));
      temp.inCopyMode=true;
      setSelectedRegion(temp);
      */
    }
    static endSelect(selectedRegion,setSelectedRegion){
        if (selectedRegion.inSelectMode){
          let temp=JSON.parse(JSON.stringify(selectedRegion));
          temp.inSelectMode=false;
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