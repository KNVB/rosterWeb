import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
let AdminGuard = class AdminGuard {
    constructor(router, cookieService) {
        this.router = router;
        this.cookieService = cookieService;
    }
    canActivate(next, state) {
        return true;
    }
};
AdminGuard = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], AdminGuard);
export { AdminGuard };
//# sourceMappingURL=admin.guard.js.map