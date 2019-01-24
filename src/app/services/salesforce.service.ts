import { Injectable } from '@angular/core';
import { jsforce } from 'jsforce';

@Injectable({ providedIn: 'root' })
export class SalesforceService {
  conn = new jsforce.Connection();
}
