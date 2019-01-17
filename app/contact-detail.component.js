System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var ContactDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ContactDetailComponent = (function () {
                function ContactDetailComponent() {
                }
                ContactDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'contact-detail',
                        inputs: ['contact'],
                        template: "\n        <div *ngIf=\"contact\">\n            <h2>{{contact.FirstName}} {{contact.LastName}} Details</h2>\n            <div>\n                <div><label>id: </label>{{contact.Id}}</div>\n                <div>\n                    <label>First Name:</label>\n                    <input type=\"text\" [(ngModel)]=\"contact.FirstName\"/>\n                </div>\n                <div>\n                    <label>Last Name:</label>\n                    <input type=\"text\" [(ngModel)]=\"contact.LastName\"/>\n                </div>\n                <div>\n                    <label>Phone:</label>\n                    <input type=\"text\" [(ngModel)]=\"contact.Phone\"/>\n                </div>\n            </div>\n        </div>\n    ",
                        styles: ["\n        label {display:inline-block; width:100px; padding:8px}\n        h2 {margin-top:0; font-weight:300}\n        input[type=text] {-webkit-appearance:none; width:150px; height:24px; padding:4px 8px; font-size:14px; line-height:1.42857143; border:1px solid #ccc; border-radius:2px;-webkit-box-shadow:none; box-shadow:none}\n    "],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ContactDetailComponent);
                return ContactDetailComponent;
            }());
            exports_1("ContactDetailComponent", ContactDetailComponent);
        }
    }
});
//# sourceMappingURL=contact-detail.component.js.map