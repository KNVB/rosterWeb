import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TransferObjectService {
  private subject = new Subject();
  constructor() { }
  sendObj(obj: any) {
    this.subject.next(obj);
  }

  accessObj() {
    return this.subject.asObservable();
  }

}
