import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let ShowRosterComponent = class ShowRosterComponent {
    constructor(titleService) {
        this.titleService = titleService;
    }
    ngOnInit() {
        this.titleService.setTitle('Roster Viewer');
    }
};
ShowRosterComponent = tslib_1.__decorate([
    Component({
        selector: 'app-show-roster',
        templateUrl: './show-roster.component.html',
        styleUrls: ['./show-roster.component.css']
    })
], ShowRosterComponent);
export { ShowRosterComponent };
//# sourceMappingURL=show-roster.component.js.map