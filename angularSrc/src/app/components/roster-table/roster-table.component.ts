import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';
import { MonthlyCalendar } from 'src/app/classes/monthly-calendar';
import { RosterService } from 'src/app/services/roster.service';
import { RosterRule } from 'src/app/classes/roster-rule';


@Component({
  selector: 'app-roster-table',
  templateUrl: './roster-table.component.html',
  styleUrls: ['./roster-table.component.css']
})
export class RosterTableComponent implements OnInit {
  monthlyCalendar: MonthlyCalendar;
  rosterRule: RosterRule;
  toDayDate = new Date();
  constructor(private calendarService: CalendarService,private rosterService: RosterService) {
    this.rosterService.getRosterRule().subscribe((res: RosterRule) => {
      this.rosterRule = new RosterRule();
      this.rosterRule.essentialShiftList = res.essentialShiftList;
      this.rosterRule.maxConsecutiveWorkingDay = res.maxConsecutiveWorkingDay;
      this.rosterRule.shiftHourCount = res.shiftHourCount;
      this.rosterRule.shiftTimeSlot = res.shiftTimeSlot;
      this.rosterRule.shiftCssClassName = res.shiftCssClassName;
    });
    this.getData(null, null);
  }

  ngOnInit() {
  }
  getData(year: number, month: number) {
    this.calendarService.getMonthlyCalendar(year, month).subscribe((res: MonthlyCalendar) => {
      this.monthlyCalendar = res;
    });
  }
  nextMonth() {
    let month = this.monthlyCalendar.month;
    let year = this.monthlyCalendar.year;
    month++;
    if (month > 12 ) {
      month = 1;
      year++;
    }
    this.getData(year, month);
  }
  prevMonth() {
    let month = this.monthlyCalendar.month;
    let year = this.monthlyCalendar.year;
    month--;
    if (month < 1 ) {
      month = 12;
      year--;
    }
    this.getData(year, month);
  }
}
