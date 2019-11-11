import { Component, Input, OnInit } from '@angular/core';
import { MonthlyCalendar } from 'src/app/classes/monthly-calendar';
import {MatDatepicker} from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {Moment} from 'moment';
import { TransferObjectService } from 'src/app/services/transfer-object.service';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})



export class MonthPickerComponent implements OnInit {
  monthlyCalendar: MonthlyCalendar;
  date = new FormControl(moment());
  subscription;
  constructor(private transferObjectService: TransferObjectService) { }

  ngOnInit() {
    this.subscription = this.transferObjectService.accessObj().subscribe((res: MonthlyCalendar) => {
      this.monthlyCalendar = res;
      this.date = new FormControl(moment()
                                  .year(this.monthlyCalendar.year)
                                  .month(this.monthlyCalendar.month - 1)
                                  .date(1));
    });

  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
}
