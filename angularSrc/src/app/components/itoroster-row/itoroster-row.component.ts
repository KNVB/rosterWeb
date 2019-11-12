import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[app-itoroster-row]',
  templateUrl: './itoroster-row.component.html',
  styleUrls: ['./itoroster-row.component.css']
})
export class ITORosterRowComponent implements OnInit {
  @Input() noOfWorkingDay: number;
  constructor() { }

  ngOnInit() {
  }

}
