import { Component,  OnInit, Input } from '@angular/core';
import { MonthlyCalendar } from 'src/app/classes/monthly-calendar';
import { RosterTable } from 'src/app/classes/roster-table';


@Component({
  selector: '[app-roster-body]',
  templateUrl: './roster-body.component.html',
  styleUrls: ['./roster-body.component.css']
})
export class RosterBodyComponent implements OnInit {
  @Input() monthlyCalendar: MonthlyCalendar;
  @Input() itoRosterList;
  constructor() { }

  ngOnInit() {
  }
}
