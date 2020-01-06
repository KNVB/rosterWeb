import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './admin.guard';
const routes = [
    {
        path: 'admin',
        canActivate: [AdminGuard],
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: '/admin',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: '/admin',
                pathMatch: 'full'
            }
        ]
    }
];
let AdminRoutingModule = class AdminRoutingModule {
};
AdminRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], AdminRoutingModule);
export { AdminRoutingModule };
//# sourceMappingURL=admin-routing.module.js.map