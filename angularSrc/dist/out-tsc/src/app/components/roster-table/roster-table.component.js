import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let RosterTableComponent = class RosterTableComponent {
    constructor(calendarService) {
        this.calendarService = calendarService;
        this.getData(null, null);
    }
    ngOnInit() {
    }
    getData(year, month) {
        this.calendarService.getMonthlyCalendar(year, month).subscribe((res) => {
            this.monthlyCalendar = res;
            // this.transferObjectService.sendObj(res);
        });
    }
    nextMonth() {
        let month = this.monthlyCalendar.month;
        let year = this.monthlyCalendar.year;
        month++;
        if (month > 12) {
            month = 1;
            year++;
        }
        this.getData(year, month);
    }
    prevMonth() {
        let month = this.monthlyCalendar.month;
        let year = this.monthlyCalendar.year;
        month--;
        if (month < 1) {
            month = 12;
            year--;
        }
        this.getData(year, month);
    }
};
RosterTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-roster-table',
        templateUrl: './roster-table.component.html',
        styleUrls: ['./roster-table.component.css']
    })
], RosterTableComponent);
export { RosterTableComponent };
//# sourceMappingURL=roster-table.component.js.map