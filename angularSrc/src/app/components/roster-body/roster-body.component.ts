import { Component, OnChanges,  OnInit, Input } from '@angular/core';
import { ITORoster } from 'src/app/classes/itoroster';
import { MonthlyCalendar } from 'src/app/classes/monthly-calendar';
import { RosterRule } from 'src/app/classes/roster-rule';
import { RosterService } from 'src/app/services/roster.service';



@Component({
  selector: '[app-roster-body]',
  templateUrl: './roster-body.component.html',
  styleUrls: ['./roster-body.component.css']
})
export class RosterBodyComponent implements OnInit, OnChanges {
  @Input() monthlyCalendar: MonthlyCalendar;
  @Input()rosterRule: RosterRule;
  itoRosterList: ITORoster[];
  
  constructor(private rosterService: RosterService) {
  }

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
