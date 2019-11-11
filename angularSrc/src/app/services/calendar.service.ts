import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MonthlyCalendar } from '../classes/monthly-calendar';
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) { }
  getMonthlyCalendar(year: number, month: number): Observable<MonthlyCalendar> {
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
    return this.http.post(url , requestParams).pipe(map((res: MonthlyCalendar) => res));
  }
}
