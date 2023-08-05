import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {Select, Store} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {TranslateModule} from "@ngx-translate/core";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";

@Component({
  selector: 'event-detail-page',
  template: `
    <utility-back-link-component></utility-back-link-component>
    <ng-container *ngIf="item$ | async as event; else LoadingTemplate">
      <div
        class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
        <div class="lg:flex lg:items-center lg:justify-between">
          <div class="min-w-0 flex-1">
            <h2
              class="text-2xl font-bold leading-7 text-beeColor-900 dark:text-beeDarkColor-200 sm:truncate sm:text-3xl sm:tracking-tight">
              {{ event.start | date }} - {{ event.end | date }}
            </h2>
            <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div class="mt-2 flex items-center text-sm text-beeColor-500">
                <i class="bi bi-egg me-2"></i>
                {{ event.createdAt | date }}
              </div>
            </div>
          </div>
          <div class="mt-5 flex lg:ml-4 lg:mt-0">
            <span class="hidden sm:block">
              <edit-link-component></edit-link-component>
            </span>

            <span class="ml-3 hidden sm:block">
              <delete-button (event)="delete(event._id!)"></delete-button>
            </span>

            <utility-dropdown [smHidden]="true">
              <ng-container content>
                <a routerLink="form" class="block px-4 py-2 text-sm text-beeColor-700"
                   role="menuitem" tabindex="-1"
                   id="mobile-menu-item-0">
                  <i class="bi bi-pencil me-2"></i>
                  {{ 'general.edit' | translate }}
                </a>
                <button (click)="delete(event._id!)" class="block px-4 py-2 text-sm text-red-500"
                        role="menuitem" tabindex="-1"
                        id="mobile-menu-item-1">
                  <i class="bi bi-trash me-2"></i>
                  {{ 'general.delete' | translate }}
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
            <p class="m-0">{{ attendant.customer.email }}</p>
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
    DeleteButtonComponent,
    RouterLink,
    NgForOf,
    DropdownComponent,
    LoaderComponent,
    DatePipe,
    TranslateModule,
    EditLinkComponent
  ],
  standalone: true
})
export default class Index {

  // TODO add base index of details with store and delete method

  @Select(EventState.itemData)
  public readonly item$!: Observable<IEvent>;

  @HostBinding()
  public readonly class = 'p-4 block';

  public readonly store = inject(Store);

  public delete(id: string): void {
    this.store.dispatch(new EventActions.DeleteItem(id));
  }

}
