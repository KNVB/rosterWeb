import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowRosterRoutingModule} from './show-roster-routing.module';
import { ShowRosterComponent } from './show-roster.component';
import { RosterTableComponent } from '../components/roster-table/roster-table.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [ShowRosterComponent,
                 RosterTableComponent],
  imports: [
    CommonModule,
    ShowRosterRoutingModule,
    HttpClientModule 
  ]
})
export class ShowRosterModule { }
