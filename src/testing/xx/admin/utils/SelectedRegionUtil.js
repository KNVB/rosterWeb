import CopiedRegion from './CopiedRegion';
import ITOShiftStatUtil from '../../utils/ITOShiftStatUtil';
import SelectedRegion from './SelectedRegion';
export default class SelectedRegionUtil{
    constructor(bodyRowCount,monthLength,noOfPrevDate){
        let {getITOStat}=ITOShiftStatUtil();
        let copiedRegion=new CopiedRegion();
        let selectedRegion=new SelectedRegion();
        this.hasCopiedRegion=false;
        this.clearCopiedRegion=()=>{
            copiedRegion={
              minX:-1,
              minY:-1,
              maxX:-1,
              maxY:-1
            }
            this.hasCopiedRegion=false;
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
          //console.log("SelectedRegionUtil:copySelectedRegion:"+JSON.stringify(result));
          clipboardData.setData('application/json',JSON.stringify(result));
          copiedRegion={
            minX:selectedRegion.minX,
            minY:selectedRegion.minY,
            maxX:selectedRegion.maxX,
            maxY:selectedRegion.maxY
          }
          this.hasCopiedRegion=true;
        }
        this.deleteData=(activeShiftInfoList,noOfWorkingDay,itoRosterList)=>{
          let itoId,row,table=document.getElementById("rosterTable");
          let temp=JSON.parse(JSON.stringify(itoRosterList.presentValue));
          let tempArray,dataType;
          for (let y=selectedRegion.minY;y<=selectedRegion.maxY;y++){
            row=table.rows[y]
            tempArray=row.id.split(":");
            itoId=tempArray[0];
            dataType=tempArray[1];
            for (let x=selectedRegion.minX;x<=selectedRegion.maxX;x++){
              switch(dataType){
                case 'shift':
                  temp[itoId].shiftList[x-noOfPrevDate]='';
                  temp[itoId]=getITOStat(activeShiftInfoList,noOfWorkingDay, temp[itoId]);
                  break;
                case 'preferredShift':
                  if (temp[itoId].preferredShiftList[x-noOfPrevDate]){
                    delete temp[itoId].preferredShiftList[x-noOfPrevDate];
                  }
                  break
                default:
                  break;  
              }
              itoRosterList.set(temp);
            }
          }
        }
        this.endSelect=()=>{
            if (selectedRegion.inSelectMode){
              selectedRegion.inSelectMode=false;
              let table=document.getElementById("rosterTable");
              let cell=table.rows[selectedRegion.minY].cells[selectedRegion.minX];
              /****************************************************************/
              /*The following steps trigger the onblur event of the 'theCell'.*/
              /****************************************************************/
              
              let range = document.createRange();
              range.selectNodeContents(cell);
              let selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);
              
              console.log("SelectedRegion.endSelect:"+JSON.stringify(selectedRegion));
            }
        }
        this.getBorderClass=(cellIndex,rowIndex)=>{
            //let headerRowCount=document.getElementById("rosterTable").tHead.children.length;
            let result=getCopiedRegionCssClass(cellIndex,rowIndex);
            if (result.length>0){
              return result.join(' ');
            } else {
              return getSelectedRegionBorderClass(cellIndex,rowIndex).join(' ');
            }
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
        this.isInSelectMode=()=>{
          return selectedRegion.inSelectMode
        }
        this.pasteCopiedRegion=(clipboardData,activeShiftInfoList,noOfWorkingDay,itoRosterList,noOfPrevDate)=>{
          if (this.hasCopiedRegion){
            let copiedData=JSON.parse(clipboardData.getData('application/json'));
            let destX,destY=selectedRegion.minY,itoId;
            let table=document.getElementById("rosterTable");
            let temp=JSON.parse(JSON.stringify(itoRosterList.presentValue));
            let tempArray,rowType;
            for (let y=0;y<copiedData.length;y++){
              let row=table.rows[destY++];
              if ((row) && (row.id.indexOf(':')>-1)){
                tempArray=row.id.split(":");
                itoId=tempArray[0];
                rowType=tempArray[1];
                destX=selectedRegion.minX-noOfPrevDate;
                for (let x=0;x<copiedData[y].length;x++){
                  switch(rowType){
                    case 'shift':
                      temp[itoId].shiftList[destX++]=copiedData[y][x];
                      temp[itoId]=getITOStat(activeShiftInfoList,noOfWorkingDay, temp[itoId]);
                      break;
                    case 'preferredShift':
                      temp[itoId].preferredShiftList[destX++]=copiedData[y][x];
                      break;
                    default:break  
                  }
                  itoRosterList.set(temp);
                }
              }
            }
            selectedRegion.maxX=destX+noOfPrevDate-1;
            selectedRegion.maxY=destY-1;
          }
        }
        this.selectNextCell=(e,xOffset,yOffset)=>{
            let newX,newY;
            let x,y;
        
            e.preventDefault();
            if (selectedRegion.minX<selectedRegion.firstX)
                x=selectedRegion.minX;
            else
                x=selectedRegion.maxX;
            if (selectedRegion.minY<selectedRegion.firstY)
                y=selectedRegion.minY;
            else
                y=selectedRegion.maxY;
                
            /********************************************************************************/
            /* This part is related to the boundary of keyboard navigation.                 */
            /* if the table structure changed,Please change the below code accordingly.     */
            /********************************************************************************/
            let headerRowCount=document.getElementById("rosterTable").tHead.children.length;
            let minRowNo=headerRowCount,maxRowNo=bodyRowCount+minRowNo-1;
            let minCellIndex=noOfPrevDate+1,maxCellIndex=minCellIndex+monthLength-1;
            
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
            //console.log(`newY=${newY},newX=${newX}`);
            let table=document.getElementById("rosterTable");
            let cell=table.rows[newY].cells[newX];
            
            this.startSelect(cell);
            this.endSelect();
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
        }
        this.updateSelect=(theCell)=>{
            if (selectedRegion.inSelectMode){
                let cellIndex=theCell.cellIndex;
                let isChanged=false;
                let newMaxX=selectedRegion.maxX,newMinX=selectedRegion.minX;
                let newMaxY=selectedRegion.maxY,newMinY=selectedRegion.minY;
                let row=theCell.parentElement;
                let rowIndex=row.rowIndex;
        
                if (cellIndex<selectedRegion.firstX){
                    newMinX=cellIndex;
                    isChanged=true;
                } else{
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
                  selectedRegion.minX=newMinX;
                  selectedRegion.maxX=newMaxX;                        
                  selectedRegion.minY=newMinY;
                  selectedRegion.maxY=newMaxY;                
                }
            }
        }    
    }
}