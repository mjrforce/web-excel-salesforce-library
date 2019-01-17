System.register(['angular2/core', './contact-detail.component', './force'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, contact_detail_component_1, force;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (contact_detail_component_1_1) {
                contact_detail_component_1 = contact_detail_component_1_1;
            },
            function (force_1) {
                force = force_1;
            }],
        execute: function() {
            ;
            AppComponent = (function () {
                function AppComponent() {
                    var _this = this;
                    force.init({
                        appId: "3MVG9sG9Z3Q1Rlbc4tkIx2fI3ZUDVyYt86Ypl8ZqBXTpzPbQNHxq7gpwKcN75BB.fpgHxzSWgwgRY6nVfvBUe",
                        proxyURL: "https://dev-cors-proxy.herokuapp.com/"
                    });
                    force.login().then(function () {
                        force.query("select id, firstname, lastname, phone from contact").then(function (result) { return _this.contacts = result.records; });
                    });
                }
                AppComponent.prototype.onSelect = function (contact) {
                    this.selectedContact = contact;
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <header><h1>Salesforce Contacts</h1></header>\n        <div class=\"content\">\n            <ul class=\"contacts\">\n                <li *ngFor=\"#contact of contacts\" (click)=\"onSelect(contact)\" [class.selected]=\"contact === selectedContact\">\n                    {{contact.FirstName}} {{contact.LastName}}\n                </li>\n            </ul>\n            <contact-detail [contact]=\"selectedContact\"></contact-detail>\n        </div>",
                        styles: ["\n        header {background-color:#03A9F4; padding:14px; margin-bottom:12px; box-shadow:0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)}\n        h1 {font-weight:300}\n        header > h1 {font-weight:300; font-size:24px; margin:0; color: #FFFFFF}\n        .content {display:flex}\n        .contacts {list-style-type: none; width: 220px; margin: 0 24px 0 -24px}\n        .contacts li {padding:4px 8px; cursor:pointer}\n        .contacts li:hover {color:#369; background-color:#EEE}\n        .selected { background-color:#EEE; color:#369}\n    "],
                        directives: [contact_detail_component_1.ContactDetailComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map