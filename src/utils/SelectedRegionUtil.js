export default class SelectedRegionUtil{
    static copySelectedRegion(selectedRegion,setSelectedRegion){
      if (selectedRegion.inSelectMode){
        let temp={...selectedRegion};
        temp.inCopyMode=true;
        setSelectedRegion(temp);
      }
    }
    static endSelect(selectedRegion,setSelectedRegion){
        if (selectedRegion.inSelectMode){
          let temp=JSON.parse(JSON.stringify(selectedRegion));
          temp.inSelectMode=false;
          setSelectedRegion(temp);
        }
    }
    static getCopedRegionCssClass(cellIndex,rowIndex,selectedRegion){
      let result=[];
      if ((rowIndex===selectedRegion.minY) && (cellIndex>=selectedRegion.minX) &&(cellIndex<=selectedRegion.maxX)){
        result.push("copiedCellBorderTop");
      }
      if ((rowIndex===selectedRegion.maxY) && (cellIndex>=selectedRegion.minX) &&(cellIndex<=selectedRegion.maxX)){
        result.push("copiedCellBorderBottom");
      }
      if ((cellIndex===selectedRegion.maxX) && (rowIndex>=selectedRegion.minY) &&(rowIndex<=selectedRegion.maxY)){
        result.push("copiedCellBorderRight");
      }
      if ((cellIndex===selectedRegion.minX) && (rowIndex>=selectedRegion.minY) &&(rowIndex<=selectedRegion.maxY)){
        result.push("copiedCellBorderBottom");
      }
      return result.join(' ');
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
        return result.join(' ');
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