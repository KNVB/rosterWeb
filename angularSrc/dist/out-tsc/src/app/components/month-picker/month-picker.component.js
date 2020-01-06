import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let MonthPickerComponent = class MonthPickerComponent {
    constructor() { }
    ngOnInit() {
    }
    chosenMonthHandler(event, datepicker) {
        const month = event.getMonth();
        console.log(this.monthlyCalendar.monthNames[month]);
    }
};
tslib_1.__decorate([
    Input()
], MonthPickerComponent.prototype, "monthlyCalendar", void 0);
MonthPickerComponent = tslib_1.__decorate([
    Component({
        selector: 'app-month-picker',
        templateUrl: './month-picker.component.html',
        styleUrls: ['./month-picker.component.css']
    })
], MonthPickerComponent);
export { MonthPickerComponent };
//# sourceMappingURL=month-picker.component.js.map