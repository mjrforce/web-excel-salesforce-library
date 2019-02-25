
import { fielditem } from './fielditem';
export class qform {
  soql: string;
  object: string;
  fields: fielditem[];
  objects: [];

  constructor() {
    this.fields = [];
    this.objects = [];
  }

}
