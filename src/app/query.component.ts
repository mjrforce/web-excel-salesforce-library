import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { DataService } from './services/salesforce-data-service';
import { ExcelService } from './services/excel-service';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';
import { ErrorService} from './services/error-service';

declare const WESLI_OAuth_Service: any;

@Component({
  selector: 'query-component',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})

export class QueryComponent {

  constructor(
    private ngZone: NgZone,
    private dataService: DataService,
    private excelService: ExcelService,
    private errorService: ErrorService,
    @Inject(APP_BASE_HREF) private baseHref: string) {

  }
 
  objects = [];
  fields = [];
  searchText = '';
  searchObj = '';
  selectedObject = '';
  SOQL = 'SELECT Name, Title, Phone FROM contact ';
  errormsg = '';
  apiCount = 0;
  filteredItems = [];
  savedQueryList = [];
  isAll = false;
  isAPIName = false;
  
  ngOnInit() {  
      this.ngZone.run(() => {
        this.getAllObjects();
        WESLI_OAuth_Service.getRoutines(function (response: any, event: any) {
          this.savedQueryList = response;
        }.bind(this));
      });
  }

  get hasError(): boolean{
     return this.errorService.getHasError();
  }

  get errorMsg(): string{
     return this.errorService.errorMessage;
 }

  clearError(){
    this.ngZone.run(() => {
      this.errorService.clearError();
    });
  }

  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  async useQuery(docId: string){
      var routine = null;
      for(var i=0; i<this.savedQueryList.length; i++){
        if(this.savedQueryList[i].uniqueId == docId){
            routine = this.savedQueryList[i];
            for(var j=0; j<routine.queries.length; j++){
              this.run(this.htmlDecode(routine.queries[j])).catch(function(reason){
                this.ngZone.run(() => {
                  this.errorService.setError(reason);
                });
              }.bind(this));
            }   
            break;
        }   
      }
  }

  async run(soql?:string) {
    this.excelService.fixQuery(soql || this.SOQL).then(function (data) {
      this.dataService.query(data).then(function (data) {
        this.excelService.createTable(data);
      }.bind(this));
    }.bind(this));
  }

   get filteredObjects(){
     return this.objects.filter(function(val){
       var str = this.searchObj || '';
       str = str.toLowerCase();
       return str.length == 0 || val.fieldLabel.toLowerCase().indexOf(str) > -1 || val.apiName.toLowerCase().indexOf(str) > -1; 
     }.bind(this))
   }

   get filteredFields(){
    return this.fields.filter(function(val){
      var str = this.searchText || '';
      str = str.toLowerCase();
      return str.length == 0 || val.fieldLabel.toLowerCase().indexOf(str) > -1 || val.apiName.toLowerCase().indexOf(str) > -1; 
    }.bind(this))
  }
   
   checkUnCheckAll(){
    this.ngZone.run(() => {
       this.fields.forEach(function (item, index) { 
           item.isSelected = this.isAll;
       }.bind(this));
       
       this.updateSOQL();
      });
   } 

  updateSOQL(){ 
    this.ngZone.run(() => {
    this.SOQL = '';
    
    this.fields.forEach(function (item, index) {

        if(item.isSelected)
        {
            this.SOQL =  this.SOQL + ' '+ item.apiName + ', ' ;
        }
    }.bind(this));
    
    if(this.SOQL != '')
    {
        this.SOQL = this.SOQL.replace(/,\s*$/, "");
        this.SOQL = ' SELECT ' + this.SOQL + ' FROM '+ this.selectedObject ;
    }
  });
}

getAllFields() {
  this.fields = [];
  this.apiCount = this.apiCount + 1;
  this.dataService.describe(this.selectedObject).then(function (data) {
     data.fields.forEach(function(item, index){
       this.fields.push(this.createJSONData(item.label, item.name));
     }.bind(this))
  }.bind(this));
}

  getAllObjects() {
    
    this.objects = [];
    this.dataService.globalDescribe().then(function (data) {

      data.sobjects.forEach(function (item, index) {
        if (item.queryable == true && item.searchable == true) {
          this.objects.push(this.createJSONData(item.label, item.name));
        }
      }.bind(this));
    }.bind(this));
  }

  createJSONData(fLabel: string, fAPI: string): any {
    return { "fieldLabel": fLabel, "apiName": fAPI, "isSelected": false };
  }

}
