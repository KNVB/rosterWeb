import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShowRosterComponent } from './show-roster.component';
const routes = [
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
let ShowRosterRoutingModule = class ShowRosterRoutingModule {
};
ShowRosterRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], ShowRosterRoutingModule);
export { ShowRosterRoutingModule };
//# sourceMappingURL=show-roster-routing.module.js.map