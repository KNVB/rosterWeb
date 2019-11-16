import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { TransferObjectService } from 'src/app/services/transfer-object.service';

@Component({
  selector: '[app-date-row]',
  templateUrl: './date-row.component.html',
  styleUrls: ['./date-row.component.css']
})
export class DateRowComponent implements OnInit {
  @Input() calendarObjList;
  public cursorColumnIndex=-1;
  toDayDate = new Date();
  subscription;
  constructor(private el: ElementRef,private transferObjectService: TransferObjectService) { }

  ngOnInit() {
    this.subscription = this.transferObjectService.accessObj().subscribe((res: number) => {
      console.log("Received:"+res);
      this.cursorColumnIndex=res;
    });
  }
  isToDay(calendarObj) {
    let result = false;
    if (calendarObj !== null) {
      if ((calendarObj.solarDate === this.toDayDate.getDate())  &&
      (calendarObj.solarYear === this.toDayDate.getFullYear()) &&
      (calendarObj.solarMonth === this.toDayDate.getMonth() + 1)) {
        result = true;
      }
    }
    return result;
  }
  isCursorColumn(calendarObj) {
    let result = false;
    if (calendarObj !== null) {
      //this.el.nativeElement.cells[this.cursorColumnIndex].className='highlightCursor';
      console.log(this.el.nativeElement.cells[this.cursorColumnIndex]);
    }
  }
}
