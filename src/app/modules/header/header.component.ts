import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from '../../services/salesforce-oauth-service';
import { DataService } from '../../services/salesforce-data-service';
import { ExcelService } from '../../services/excel-services';
import { OfficeDataService } from '../../services/office-data-service'
import { environment } from '../../../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent {


}
