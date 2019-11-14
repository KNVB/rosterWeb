export class RosterRule {
  public essentialShiftList = [];
  public maxConsecutiveWorkingDay = 0;

  private shiftInfoList = [];
  private shiftHourCount = {};
  private shiftCssClassName = {};
  private shiftTimeSlot = {};

  constructor() {}
  public setShiftInfoList(shiftInfoList) {
    this.shiftInfoList = shiftInfoList;

    this.shiftInfoList.forEach((shiftInfo) => {

      if (shiftInfo.essential) {
        this.essentialShiftList.push(shiftInfo.shiftType);
      }
      this.shiftHourCount[shiftInfo.shiftType] = shiftInfo.shiftDuration;
      this.shiftCssClassName[shiftInfo.shiftType] = shiftInfo.cssClassName;
      this.shiftTimeSlot[shiftInfo.shiftType] = shiftInfo.timeSlot;
    });
  }
  public getShiftInfoList() {
    return this.shiftInfoList;
  }
  public getHourCountByShifType(shiftType: string) {
    return this.shiftHourCount[shiftType];
  }
  public getCssClassNameByShiftType(shiftType: string){
    if ((shiftType != null)  && (shiftType in this.shiftCssClassName)) {
      return this.shiftCssClassName[shiftType];
    } else {
      return '';
    }
  }
}
