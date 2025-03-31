import {Component} from '@angular/core';
import {IEvent} from "@tenant/event/domain";
import {NgIf} from "@angular/common";

@Component({
  selector: 'event-short-details-component',
  standalone: true,
  imports: [
    NgIf
  ],
  template: `
	  @if (event) {

		  <ul class="list-group">
			  <li class="list-group-item">
				  <strong class="dark:text-white">Start:</strong>
				  <p class="m-0">{{ event.start }}</p>
			  </li>
			  <li class="list-group-item">
				  <strong class="dark:text-white">End:</strong>
				  <p class="m-0">{{ event.end }}</p>
			  </li>
			  <li class="list-group-item">
				  <strong class="dark:text-white">Description:</strong>
				  <p class="m-0">{{ event.note }}</p>
			  </li>
		  </ul>
	  }
  `
})
export class EventShortDetailsComponent {

  public event: undefined | IEvent;

}
