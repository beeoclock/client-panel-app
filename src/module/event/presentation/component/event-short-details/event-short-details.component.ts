import {Component} from '@angular/core';
import {IEvent} from "@event/domain";
import {NgIf} from "@angular/common";

@Component({
  selector: 'event-short-details-component',
  standalone: true,
  imports: [
    NgIf
  ],
  template: `
    <ul class="list-group" *ngIf="event">
      <li class="list-group-item">
        <strong>Start:</strong>
        <p class="m-0">{{ event.start }}</p>
      </li>
      <li class="list-group-item">
        <strong>End:</strong>
        <p class="m-0">{{ event.end }}</p>
      </li>
      <li class="list-group-item">
        <strong>Description:</strong>
        <p class="m-0">{{ event.description }}</p>
      </li>
    </ul>
  `
})
export class EventShortDetailsComponent {

  public event: undefined | IEvent;

}
