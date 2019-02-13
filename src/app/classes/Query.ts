import { QueryMapItem } from './QueryMapIItem';
import { WhereMapItem } from './WhereMapItem';
export class Query {
  soql: string;
  location: string;
  data: any;
  datamap: QueryMapItem[];
  wheremap: WhereMapItem[];

  constructor() {
    this.datamap = [];
    this.wheremap = [];

  }

}
