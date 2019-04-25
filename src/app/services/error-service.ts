import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';


@Injectable({ providedIn: 'root' })
export class ErrorService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string) { }
  errorMessage = '';

  setError(error){
    
    this.errorMessage = error.message;
    console.log(error.stack);
  }

  clearError(){
    this.errorMessage = '';
  }

  getHasError(): boolean{
    return this.errorMessage != '';
  }

}

