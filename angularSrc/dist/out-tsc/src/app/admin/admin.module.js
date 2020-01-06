import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { CookieService } from 'ngx-cookie-service';
let AdminModule = class AdminModule {
};
AdminModule = tslib_1.__decorate([
    NgModule({
        declarations: [AdminComponent],
        imports: [
            CommonModule,
            AdminRoutingModule
        ],
        providers: [CookieService]
    })
], AdminModule);
export { AdminModule };
//# sourceMappingURL=admin.module.js.map