import { Component, OnChanges,  OnInit, Input } from '@angular/core';
import { MonthlyCalendar } from 'src/app/classes/monthly-calendar';
import { RosterTable } from 'src/app/classes/roster-table';
import { RosterService } from 'src/app/services/roster.service';
import { ITORoster } from 'src/app/classes/itoroster';


@Component({
  selector: '[app-roster-body]',
  templateUrl: './roster-body.component.html',
  styleUrls: ['./roster-body.component.css']
})
export class RosterBodyComponent implements OnInit, OnChanges {
  @Input() monthlyCalendar: MonthlyCalendar;
  itoRosterList: ITORoster[];
  constructor(private rosterService: RosterService) { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.monthlyCalendar !== undefined) {
      this.rosterService.getRosterTable(this.monthlyCalendar.year, this.monthlyCalendar.month).subscribe((res: any) => {
        this.itoRosterList = res;
      });
    }
  }
}
