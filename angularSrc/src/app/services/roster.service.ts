import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RosterTable } from '../classes/roster-table';
import { RosterRule } from '../classes/roster-rule';
@Injectable({
  providedIn: 'root'
})
export class RosterService {

  constructor(private http: HttpClient) { }
  getRosterTable(year: number, month: number): Observable<RosterTable>{
    let requestParams = new HttpParams();
    const url = '../RestfulServices/Roster/getRosterTable';
    // console.log('year=' + year + ',month=' + month);
    if (year !== null) {
      requestParams = requestParams.append('year', String(year));
    }
    if (month !== null) {
      requestParams = requestParams.append('month', String(month));
    }
    return this.http.post(url , requestParams).pipe(map((res: RosterTable) => res));
  }
  getRosterRule(): Observable<RosterRule>{
    const url = '../RestfulServices/Roster/getRosterRule';
    let requestParams = new HttpParams();
    return this.http.post(url , requestParams).pipe(map((res: RosterRule) => res));
  }
}
