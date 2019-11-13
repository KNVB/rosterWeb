export class RosterRule {
  public essentialShiftList: string[];
  public maxConsecutiveWorkingDay = 0;
  public shiftHourCount: string[];
  public shiftCssClassName: string[];
  public shiftTimeSlot: string[];

  constructor() {}

  public getHourCountByShifType(shiftType: string){
    return this.shiftHourCount[shiftType];
  }
  public getCssClassNameByShiftType(shiftType: string){
    if ((shiftType!=null)  && (shiftType in this.shiftCssClassName))
      return this.shiftCssClassName[shiftType];
    else
      return "";  
  }
}
