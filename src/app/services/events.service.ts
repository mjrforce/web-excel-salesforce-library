import { Injectable } from '@angular/core';
import { Event } from '../classes/Event';
@Injectable({ providedIn: 'root' })
export class EventService {
  events: Event[] = [];

  add(Event: Event) {
    this.events.push(Event);
  }

  clear() {
    this.events = [];
  }
}
