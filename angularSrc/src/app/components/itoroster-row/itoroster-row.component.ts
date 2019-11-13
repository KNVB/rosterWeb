import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { ITORoster } from 'src/app/classes/itoroster';
import { ITOShiftCount } from 'src/app/classes/itoshift-count';
import { RosterRule } from 'src/app/classes/roster-rule';
@Component({
  selector: '[app-itoroster-row]',
  templateUrl: './itoroster-row.component.html',
  styleUrls: ['./itoroster-row.component.css']
})
export class ITORosterRowComponent implements OnInit, OnChanges {
  @Input() itoRoster: ITORoster;
  @Input() noOfWorkingDay: number;
  @Input() rosterRule: RosterRule;
  shiftCount = new ITOShiftCount();
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    if ((this.itoRoster !== undefined) && (this.rosterRule !== undefined)){
      this.shiftCount.actualHour = this.getActualHour(this.itoRoster.shiftList, this.rosterRule);
      this.shiftCount.totalHour = this.itoRoster.workingHourPerDay * this.noOfWorkingDay;
      this.shiftCount.lastMonthBalance = this.itoRoster.lastMonthBalance;
      this.shiftCount.thisMonthHourTotal = this.shiftCount.actualHour - this.shiftCount.totalHour;
      this.shiftCount.thisMonthBalance =  this.shiftCount.thisMonthHourTotal - this.shiftCount.lastMonthBalance;
      console.log(this.rosterRule.getHourCountByShifType('a'));
     /*
      this.shiftCount.aShiftCount = this.getShiftCount(this.itoRoster.shiftList, 'a');
      this.shiftCount.bxShiftCount = this.getShiftCount(this.itoRoster.shiftList, 'b');
      this.shiftCount.cShiftCount = this.getShiftCount(this.itoRoster.shiftList, 'c');
      this.shiftCount.dxShiftCount = this.getShiftCount(this.itoRoster.shiftList, 'd');
      this.shiftCount.noOfWorkingDay = this.getNoOfWorkingDay(this.itoRoster.shiftList);
      */
    }
  }
  private getActualHour(shiftList, rosterRule) {
    let actualHour = 0;
    Object.keys(shiftList).forEach((key) => {
        if (shiftList[key] !== 'null') {
          actualHour += parseFloat(rosterRule.shiftHourCount[shiftList[key]]);
        }
    });
    return actualHour;
  }
  public getNoOfWorkingDay(shiftList) {
    let noOfWorkingDay = 0;
    Object.keys(shiftList).forEach((key) => {
      if ((shiftList[key] !== 'O') && (shiftList[key] !== 'null')) {
        noOfWorkingDay++;
      }
    });
    return noOfWorkingDay;
  }
  private getShiftCount(shiftList, shiftType: string) {
    let result = 0;
    Object.keys(shiftList).forEach((key) => {
      const shift = shiftList[key];
      if ((shiftType === 'b') || (shiftType === 'd')) {
        if (shift.startsWith(shiftType)) {
          result++;
        }
      } else {
        if (shift === shiftType) {
          result++;
        }
      }
    });
    return result;
  }
}
