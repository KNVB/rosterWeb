import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowRosterRoutingModule } from './show-roster-routing.module';
import { ShowRosterComponent } from './show-roster.component';
import { RosterTableComponent } from '../components/roster-table/roster-table.component';
import { HttpClientModule } from '@angular/common/http';
import { MonthPickerComponent } from '../components/month-picker/month-picker.component';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MaterialModule } from '../material.module';
let ShowRosterModule = class ShowRosterModule {
};
ShowRosterModule = tslib_1.__decorate([
    NgModule({
        declarations: [MonthPickerComponent,
            ShowRosterComponent,
            RosterTableComponent],
        imports: [
            CommonModule,
            ShowRosterRoutingModule,
            HttpClientModule,
            MatDatepickerModule,
            MatFormFieldModule,
            MatNativeDateModule,
            MatInputModule,
            MaterialModule,
        ]
    })
], ShowRosterModule);
export { ShowRosterModule };
//# sourceMappingURL=show-roster.module.js.map