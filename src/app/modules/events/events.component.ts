import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(public eventService: EventService) { }

  ngOnInit() {
  }

}
