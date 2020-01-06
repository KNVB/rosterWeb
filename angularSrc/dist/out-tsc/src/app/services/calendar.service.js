import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
let CalendarService = class CalendarService {
    constructor(http) {
        this.http = http;
    }
    getMonthlyCalendar(year, month) {
        let requestParams = new HttpParams();
        const url = '../RestfulServices/Calendar';
        // console.log('year=' + year + ',month=' + month);
        if (year !== null) {
            console.log('hello');
            requestParams = requestParams.append('year', String(year));
        }
        if (month !== null) {
            requestParams = requestParams.append('month', String(month));
        }
        // console.dir(requestParams.get('year'));
        return this.http.post(url, requestParams).pipe(map((res) => res));
    }
};
CalendarService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], CalendarService);
export { CalendarService };
//# sourceMappingURL=calendar.service.js.map