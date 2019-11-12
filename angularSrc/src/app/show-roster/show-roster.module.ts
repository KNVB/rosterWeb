import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowRosterRoutingModule} from './show-roster-routing.module';
import { ShowRosterComponent } from './show-roster.component';
import { RosterTableComponent } from '../components/roster-table/roster-table.component';
import { HttpClientModule } from '@angular/common/http';
import { MonthPickerComponent } from '../components/month-picker/month-picker.component';
import { MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule } from '@angular/material';
import { MaterialModule } from '../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RosterBodyComponent} from '../components/roster-body/roster-body.component';
import {ITORosterRowComponent} from '../components/itoroster-row/itoroster-row.component';
@NgModule({
  declarations: [MonthPickerComponent,
                 ShowRosterComponent,
                 ITORosterRowComponent,
                 RosterBodyComponent,
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
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ShowRosterModule { }
