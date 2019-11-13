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
  itoRosterList: ITORoster[];
  rosterRule: RosterRule;
  constructor(private rosterService: RosterService) {
    this.rosterService.getRosterRule().subscribe((res: RosterRule) => {
      this.rosterRule = new RosterRule();
      this.rosterRule.essentialShiftList = res.essentialShiftList;
      this.rosterRule.maxConsecutiveWorkingDay = res.maxConsecutiveWorkingDay;
      this.rosterRule.shiftHourCount = res.shiftHourCount;
      this.rosterRule.shiftTimeSlot = res.shiftTimeSlot;
      this.rosterRule.shiftCssClassName = res.shiftCssClassName;
    });
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
