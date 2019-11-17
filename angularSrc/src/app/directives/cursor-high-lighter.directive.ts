import { Directive, HostListener, Input } from '@angular/core';
import { RosterTableComponent } from '../components/roster-table/roster-table.component';

@Directive({
  selector: '[appCursorHighLighter]'
})
export class CursorHighLighterDirective {
  @Input() columnIndex:number;
  @Input () shiftType:string;
  @Input() id:string;
  @Input() rowComponent;
  constructor(private rosterTableComponent:RosterTableComponent) { }
  
  @HostListener('mouseover') onMouseOver() {
   if (this.shiftType!=null){  
     this.rowComponent.rowId=this.id;  
     this.rosterTableComponent.highlightColumnIndex=this.columnIndex;
   }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.shiftType!=null){    
      this.rosterTableComponent.highlightColumnIndex=-1;
    }
  }
}
