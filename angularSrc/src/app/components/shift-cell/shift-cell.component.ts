import { Component, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { RosterRule } from 'src/app/classes/roster-rule';

@Component({
  selector: '[app-shift-cell]',
  templateUrl: './shift-cell.component.html',
  styleUrls: ['./shift-cell.component.css']
})
export class ShiftCellComponent implements OnInit {
  @Input() shiftType: string;
  @Input() rosterRule:RosterRule;
  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    
  }

}
