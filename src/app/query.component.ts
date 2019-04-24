import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { ExcelService } from './services/excel-service';

import { environment } from '../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';
import { QUERIES } from '@angular/core/src/render3/interfaces/view';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { isForInStatement } from 'typescript';


declare const Excel: any;
declare const WESLI_OAuth_Service: any;

@Component({
  selector: 'query-component',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})

export class QueryComponent {

  constructor(
    private authService: OAuthService,
    private ngZone: NgZone,
    private dataService: DataService,
    private officeService: OfficeDataService,
    private excelService: ExcelService,
    @Inject(APP_BASE_HREF) private baseHref: string) {

  }
 
  objects = [];
  fields = [];
  searchText = '';
  selectedObject = '';
  txtSearchRecords = '';
  queryName = '';
  SOQL = 'SELECT Name, Title, Phone FROM contact ';
  output = [];
  columnLabel = [];
  msg = '';
  pageSize = 10 ;
  currentPage = 0; 
  orderByColumn = '';
  reverse = true;
  apiCount = 0;
  pagedItems = [];
  filteredItems = [];
  showSaveModal = false;
  savedQueryList = [];
  searchObj = '';
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

  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  async useQuery(docId: string){
      console.log('Doc Id: ' + docId);

      var routine = null;

      for(var i=0; i<this.savedQueryList.length; i++){
        if(this.savedQueryList[i].uniqueId == docId){
            routine = this.savedQueryList[i];
            console.log('Routing: ' + JSON.stringify(routine));
            for(var j=0; j<routine.queries.length; j++){
              console.log('Query: ' + j);
              this.run(this.htmlDecode(routine.queries[j]));
            }   
            break;
        }   
      }
  }

  async run(soql?:string) {
    console.log('running ' + (soql || this.SOQL));
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
   
   sortColumn(txt){ 
       this.orderByColumn = txt;
       this.reverse = !this.reverse;
   }

   incr(){
       if(this.currentPage < this.pagedItems.length)
       {
           this.currentPage = this.currentPage+1;
       } 
   }

   decr(){
       if(this.currentPage > 0)
       {
           this.currentPage = this.currentPage-1;
       } 
   }
   
   checkUnCheckAll(){
    this.ngZone.run(() => {
       this.fields.forEach(function (item, index) { 
           item.isSelected = this.isAll;
       }.bind(this));
       
       this.updateSOQL();
      });
   } 

  groupToPages(){
    this.pagedItems = []; 
    for (var i = 0; i < this.filteredItems.length; i++) {
        if (i % this.pageSize === 0) {
            this.pagedItems[Math.floor(i / this.pageSize)] = [ this.filteredItems[i] ];
        } else {
            this.pagedItems[Math.floor(i / this.pageSize)].push(this.filteredItems[i]);
        }
    }
  };

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
    this.apiCount = this.apiCount + 1;
    this.objects = [];
    this.dataService.globalDescribe().then(function (data) {

      data.sobjects.forEach(function (item, index) {
        if (item.queryable == true && item.searchable == true) {
          this.objects.push(this.createJSONData(item.label, item.name));
        }
      }.bind(this));
    }.bind(this));
  }

  showSavedModal(){
    this.showSaveModal = true;
  }

  createJSONData(fLabel: string, fAPI: string): any {
    return { "fieldLabel": fLabel, "apiName": fAPI, "isSelected": false };
  }

}
