import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-show-roster',
  templateUrl: './show-roster.component.html',
  styleUrls: ['./show-roster.component.css']
})
export class ShowRosterComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Roster Viewer');
  }

}
