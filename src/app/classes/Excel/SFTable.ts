import { EventManagerPlugin } from '@angular/platform-browser/src/dom/events/event_manager';

export class SFTable {

   query: String;
   live: Boolean;
   platformEvent: String;
   eventMap: Map<String, String>;
   queryMap: Map<String, String>;
   position: String;

   constructor() {
      this.eventMap = new Map<String, String>();
      this.queryMap = new Map<String, String>();

   }
}
