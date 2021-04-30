import CopiedRegion from './CopiedRegion';
import SelectedRegion from './SelectedRegion';
export default class SelectedRegionUtil{
    constructor(rosterTableData){
        let selectedRegion=new SelectedRegion();
        let copiedRegion=new CopiedRegion();
        const itoCount=Object.keys(rosterTableData.rosterList).length;
        const monthLength=rosterTableData.monthlyCalendar.calendarDateList.length;
        this.clearCopiedRegion=()=>{
          copiedRegion={
            minX:-1,
            minY:-1,
            maxX:-1,
            maxY:-1
          }
        }
        this.copySelectedRegion=(clipboardData)=>{
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
          copiedRegion={
            minX:selectedRegion.minX,
            minY:selectedRegion.minY,
            maxX:selectedRegion.maxX,
            maxY:selectedRegion.maxY
          }          
        }
        this.endSelect=()=>{
            //console.log(selectedRegion.inSelectMode);
            if (selectedRegion.inSelectMode){
              selectedRegion.inSelectMode=false;
            }
            return this;            
        }
        this.getBorderClass=(cellIndex,rowIndex)=>{
            let result=getCopiedRegionCssClass(cellIndex,rowIndex);
            if (result.length>0){
                return result.join(' ');
            } else {
                return getSelectedRegionBorderClass(cellIndex,rowIndex).join(' ');
            }
        }
        this.pasteCopiedRegion=(clipboardData,rosterList)=>{
          let copiedData=JSON.parse(clipboardData.getData('application/json'));
          let destX=selectedRegion.maxX,destY=selectedRegion.maxY+copiedData.length;
          let cell,itoId,range,row,selection;
          let table=document.getElementById("rosterTable");
          let temp=JSON.parse(JSON.stringify(rosterList.presentValue));
          cell=table.rows[destY-1].cells[destX];
          if ((cell)&&(cell.classList.contains("shiftCell"))){
            destY=selectedRegion.minY;
            for(let y=0;y<copiedData.length;y++){
                row=table.rows[destY++];
                itoId=row.id;
                destX=selectedRegion.minX;               
                for (let x=0;x<copiedData[y].length;x++){
                  temp[itoId].shiftList[destX++]=copiedData[y][x];
                  rosterList.set(JSON.parse(JSON.stringify(temp)));
                }
            }
            cell=table.rows[selectedRegion.minY].cells[selectedRegion.minX];            
            range = document.createRange();
            range.selectNodeContents(cell);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            selectedRegion.maxX=destX-1;
            selectedRegion.maxY=destY-1;
          }
        }
        this.selectNextCell=(e,xOffset,yOffset)=>{
            let index,maxRowCount,newX,newY;
            let nextCell,orgIndex,theCell,x,y;
        
            e.preventDefault();
            if (selectedRegion.minX<selectedRegion.firstX)
                    x=selectedRegion.minX;
                else
                    x=selectedRegion.maxX;
                if (selectedRegion.minY<selectedRegion.firstY)
                    y=selectedRegion.minY;
                else
                    y=selectedRegion.maxY;
            
            
            let minRowNo=3,maxRowNo=itoCount+minRowNo-1;
            let minCellIndex=1,maxCellIndex=minCellIndex+monthLength-1;    
            newX=x+xOffset;
            newY=y+yOffset;
            
            if (newY<minRowNo){
              newY=maxRowNo;
            }else {
              if (newY>maxRowNo){
                newY=minRowNo;
              }
            }
            if (newX<minCellIndex){
              newX=maxCellIndex
            }else {
              if (newX>maxCellIndex){
                newX=minCellIndex;
              }
            }
            console.log(`newY=${newY},newX=${newX}`);
            let table=document.getElementById("rosterTable");
            let cell=table.rows[newY].cells[newX];
        
            selectedRegion.firstX=newX;
            selectedRegion.firstY=newY;
            selectedRegion.minX=newX;
            selectedRegion.minY=newY;
            selectedRegion.maxX=newX;
            selectedRegion.maxY=newY;
            selectedRegion.inSelectMode=false;
        
            let range = document.createRange();
            range.selectNodeContents(cell);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        this.startSelect=(theCell)=>{
            let row=theCell.parentElement;
            selectedRegion.firstX=theCell.cellIndex;
            selectedRegion.firstY=row.rowIndex;
            selectedRegion.minX=theCell.cellIndex;
            selectedRegion.minY=row.rowIndex;
            selectedRegion.maxX=theCell.cellIndex;
            selectedRegion.maxY=row.rowIndex;
            selectedRegion.inSelectMode=true;
            console.log("selectedRegion="+JSON.stringify(selectedRegion));
            
            let range = document.createRange();
            range.selectNodeContents(theCell);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            return this;
        }
        this.updateSelect=(theCell)=>{
            //console.log(selectedRegion.inSelectMode);
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
                    //let temp=JSON.parse(JSON.stringify(selectedRegion))
                    selectedRegion.minX=newMinX;
                    selectedRegion.maxX=newMaxX;

                    selectedRegion.minY=newMinY;
                    selectedRegion.maxY=newMaxY;
                }
            }
            return this;
        }
        let getCopiedRegionCssClass=(cellIndex,rowIndex)=>{
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
        let getSelectedRegionBorderClass=(cellIndex,rowIndex)=>{
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
    }
   
}