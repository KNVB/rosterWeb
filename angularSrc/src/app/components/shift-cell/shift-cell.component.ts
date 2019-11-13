import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[app-shift-cell]',
  templateUrl: './shift-cell.component.html',
  styleUrls: ['./shift-cell.component.css']
})
export class ShiftCellComponent implements OnInit {
  @Input() shiftType: string;
  constructor() { }

  ngOnInit() {
  }

}
