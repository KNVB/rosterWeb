import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MonthlyCalendar } from '../classes/monthly-calendar';
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) { }
  getMonthlyCalendar(year: number, month: number): Observable<MonthlyCalendar> {
    const formData = new FormData();
    const url = '../../RestfulServices/Calendar';
    if ((year !== null) || (month !== null)) {
      formData.append('year', year.toString());
      formData.append('month', month.toString());
    }
    return this.http.post(url , formData).pipe(map((res: MonthlyCalendar) => res));
  }
}
