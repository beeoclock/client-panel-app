import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Event from '@event/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {EventRepository} from '@event/repository/event.repository';

@Component({
  selector: 'event-detail-page',
  template: `
    <ng-container *ngIf="event$ | async as event; else LoadingTemplate">
      <div class="d-flex justify-content-between">
        <utility-back-link-component url="../../"></utility-back-link-component>
        <a class="btn btn-primary" [routerLink]="['../../', 'form', event._id]">
          <i class="bi bi-pencil-fill me-3"></i>
          Edit
        </a>
      </div>
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <h5>Event</h5>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Title:</strong>
              <p class="m-0">{{ event.title }}</p>
            </li>
            <li class="list-group-item">
              <strong>Start:</strong>
              <p class="m-0">{{ event.start }}</p>
            </li>
            <li class="list-group-item">
              <strong>End:</strong>
              <p class="m-0">{{ event.end }}</p>
            </li>
            <li class="list-group-item">
              <strong>Languages:</strong>
              <p class="m-0">{{ event.languageCodes.join(', ') }}</p>
            </li>
            <li class="list-group-item">
              <strong>Description:</strong>
              <p class="m-0">{{ event.description }}</p>
            </li>
          </ul>
          <h5 class="mt-4">Attendees</h5>
          <ul class="list-group">
            <li *ngFor="let attendant of event.attendees" class="list-group-item">
              <strong>E-mail:</strong>
              <p class="m-0">{{ attendant.email }}</p>
            </li>
          </ul>
        </utility-body-card-component>
      </utility-card-component>
    </ng-container>
    <ng-template #LoadingTemplate>
      <div spinner></div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    NgIf,
    AsyncPipe,
    SpinnerComponent,
    BackLinkComponent,
    BodyCardComponent,
    BackLinkComponent,
    ButtonComponent,
    RouterLink,
    NgForOf
  ],
  standalone: true
})
export default class Index {

  public readonly eventFormAdapt = inject(EventRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly event$: Observable<Event.IEvent | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.eventFormAdapt.item(id)).data;
    }),
  );

}
