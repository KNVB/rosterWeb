import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let AdminComponent = class AdminComponent {
    constructor(titleService) {
        this.titleService = titleService;
    }
    ngOnInit() {
        this.titleService.setTitle('Roster Admin. Page');
    }
};
AdminComponent = tslib_1.__decorate([
    Component({
        selector: 'app-admin',
        templateUrl: './admin.component.html',
        styleUrls: ['./admin.component.css']
    })
], AdminComponent);
export { AdminComponent };
//# sourceMappingURL=admin.component.js.map