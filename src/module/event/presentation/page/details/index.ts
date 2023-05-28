import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Event from '@event/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {EventRepository} from '@event/repository/event.repository';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
  selector: 'event-detail-page',
  template: `
    <utility-back-link-component url="../../"></utility-back-link-component>
    <ng-container *ngIf="event$ | async as event; else LoadingTemplate">
      <div class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
        <div class="lg:flex lg:items-center lg:justify-between">
          <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-beecolor-900 dark:text-beecolor-200 sm:truncate sm:text-3xl sm:tracking-tight">
              {{ event.start | date }} - {{ event.end | date }}
            </h2>
            <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div class="mt-2 flex items-center text-sm text-beecolor-500">
                <i class="bi bi-egg me-2"></i>
                {{ event.createdAt | date }}
              </div>
            </div>
          </div>
          <div class="mt-5 flex lg:ml-4 lg:mt-0">
            <span class="hidden sm:block">
              <a type="button"
                 [routerLink]="['../../', 'form', event._id]"
                 class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-beecolor-900 shadow-sm ring-1 ring-inset ring-beecolor-300 hover:bg-beecolor-50">
                <i class="bi bi-pencil me-2"></i>
                Edit
              </a>
            </span>

            <span class="ml-3 hidden sm:block">
              <button type="button"
                      (click)="repository.delete(event._id)"
                      class="
                      inline-flex
                      items-center
                      rounded-md
                      bg-white
                      px-3
                      py-2
                      text-sm
                      font-semibold
                      text-red-500
                      shadow-sm
                      ring-1
                      ring-inset
                      ring-beecolor-300
                      hover:bg-beecolor-50">
                <i class="bi bi-trash me-2"></i>
                Delete
              </button>
            </span>

            <utility-dropdown [smHidden]="true">
              <ng-container content>
                <a [routerLink]="['../../', 'form', event._id]" class="block px-4 py-2 text-sm text-beecolor-700" role="menuitem" tabindex="-1"
                   id="mobile-menu-item-0">
                  <i class="bi bi-pencil me-2"></i>
                  Edit
                </a>
                <button (click)="repository.delete(event._id)" class="block px-4 py-2 text-sm text-red-500" role="menuitem" tabindex="-1"
                        id="mobile-menu-item-1">
                  <i class="bi bi-trash me-2"></i>
                  Delete
                </button>
              </ng-container>
            </utility-dropdown>
          </div>
        </div>
        <hr class="my-6">
        <h5>Attendees</h5>
        <ul class="list-group">
          <li *ngFor="let attendant of event.attendees" class="list-group-item">
            <strong>E-mail:</strong>
            <p class="m-0">{{ attendant.email }}</p>
          </li>
        </ul>
      </div>
    </ng-container>
    <ng-template #LoadingTemplate>
      <utility-loader></utility-loader>
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
    NgForOf,
    DropdownComponent,
    LoaderComponent,
    DatePipe
  ],
  standalone: true
})
export default class Index {

  public readonly repository = inject(EventRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  @HostBinding()
  public readonly class = 'p-4 block';

  public readonly event$: Observable<Event.IEvent | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

}
