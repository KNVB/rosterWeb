import { Component, OnInit, Input } from '@angular/core';
import { RosterRule } from 'src/app/classes/roster-rule';

@Component({
  selector: 'app-shift-info-table',
  templateUrl: './shift-info-table.component.html',
  styleUrls: ['./shift-info-table.component.css']
})
export class ShiftInfoTableComponent implements OnInit {
@Input() rosterRule: RosterRule;
  constructor() { }

  ngOnInit() {
  }

}
