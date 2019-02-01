import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from '../../../services/salesforce-oauth-service';
import { DataService } from '../../../services/salesforce-data-service';
import { ExcelService } from '../../../services/excel-services';
import { OfficeDataService } from '../../../services/office-data-service'
import { environment } from '../../../../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  templateUrl: './builder.table.component.html'
})

export class TableBuilderComponent {




}
