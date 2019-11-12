import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';
import { MonthlyCalendar } from 'src/app/classes/monthly-calendar';


@Component({
  selector: 'app-roster-table',
  templateUrl: './roster-table.component.html',
  styleUrls: ['./roster-table.component.css']
})
export class RosterTableComponent implements OnInit {
  monthlyCalendar: MonthlyCalendar;
  constructor(private calendarService: CalendarService) {
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
