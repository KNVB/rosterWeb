import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowRosterComponent  } from './show-roster.component';

const routes: Routes = [
  {
    path: 'showRoster',
    component: ShowRosterComponent,
    children: [
      {
        path: '',
        redirectTo: '/showRoster',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: '/showRoster',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowRosterRoutingModule { }
