import { Directive, HostListener, ElementRef } from '@angular/core';
import { TransferObjectService } from '../services/transfer-object.service';

@Directive({
  selector: '[appCursorHighLighter]'
})
export class CursorHighLighterDirective {
  
  constructor(private el: ElementRef,
              private transferObjectService: TransferObjectService ) { }
  @HostListener('mouseover') onMouseOver() {
   console.log('Hello'); 
    this.transferObjectService.sendObj(this.el.nativeElement.cellIndex);
    //=this.el.nativeElement.cellIndex;
  }

}
