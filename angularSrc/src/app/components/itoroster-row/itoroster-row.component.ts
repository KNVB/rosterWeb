import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { ITORoster } from 'src/app/classes/itoroster';

@Component({
  selector: '[app-itoroster-row]',
  templateUrl: './itoroster-row.component.html',
  styleUrls: ['./itoroster-row.component.css']
})
export class ITORosterRowComponent implements OnInit, OnChanges {
 
  @Input() itoRoster:ITORoster;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.itoRoster !== undefined) {
      
    }
  }
}
