import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {ServiceRepository} from '@service/repository/service.repository';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Service from '@service/domain';
import {ILanguageVersion} from '@service/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LanguagePipe} from "@utility/pipes/language.pipe";
import {WeekDayPipe} from "@utility/pipes/week-day.pipe";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
  selector: 'service-detail-page',
  template: `
    <utility-back-link-component url="../../"></utility-back-link-component>
    <ng-container *ngIf="service$ | async as service; else LoadingTemplate">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-8">
          <div class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4  mt-4">
            <div class="flex">
                <span class="hidden sm:block">
                  <a type="button"
                     [routerLink]="['../../', 'form', service._id]"
                     class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-beecolor-900 shadow-sm ring-1 ring-inset ring-beecolor-300 hover:bg-beecolor-50">
                    <i class="bi bi-pencil me-2"></i>
                    Edit
                  </a>
                </span>

              <span class="ml-3 hidden sm:block">
                  <button type="button"
                          (click)="repository.delete(service._id)"
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
                  <a [routerLink]="['../../', 'form', service._id]" class="block px-4 py-2 text-sm text-beecolor-700"
                     role="menuitem" tabindex="-1"
                     id="mobile-menu-item-0">
                    <i class="bi bi-pencil me-2"></i>
                    Edit
                  </a>
                  <button (click)="repository.delete(service._id)" class="block px-4 py-2 text-sm text-red-500"
                          role="menuitem" tabindex="-1"
                          id="mobile-menu-item-1">
                    <i class="bi bi-trash me-2"></i>
                    Delete
                  </button>
                </ng-container>
              </utility-dropdown>
            </div>
          </div>
          <div class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4  mt-4">
            <h4>
              Permanent employees
            </h4>

            <ul *ngFor="let permanentEmployee of service.permanentEmployees" class="list-group">
              <li class="list-group-item d-flex flex-column" aria-current="true">
                <div class="d-flex w-100 justify-content-between">
                </div>
                <p class="mb-1">
                  <i class="bi bi-person"></i>
                  {{ permanentEmployee.firstName }} {{ permanentEmployee.lastName }}
                </p>
                <small>
                  {{ permanentEmployee.email }}
                </small>
                <small>
                  {{ permanentEmployee.phone }}
                </small>
              </li>
            </ul>

          </div>
          <div
            class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4  mt-4">
            <h4>
              Language Versions
            </h4>
            <ul *ngFor="let languageVersion of languageVersions(service.languageVersions)" class="list-group">
              <li class="list-group-item" aria-current="true">
                <div class="d-flex w-100 justify-content-between">
                  <small class="mb-1">
                    {{ languageVersion.language | language }}
                  </small>
                  <small
                    [class.text-red-500]="!languageVersion.active"
                    [class.text-green-500]="languageVersion.active">
                    {{ languageVersion.active ? 'active' : 'Inactive' }}
                  </small>
                </div>
                <p class="mb-1">{{ languageVersion.title }}</p>
                <small>{{ languageVersion.description }}</small>
              </li>
            </ul>

          </div>
          <div
            class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4  mt-4">
            <h4>
              Schedules
            </h4>
            <ul *ngFor="let schedule of service.schedules" class="list-group">
              <li class="list-group-item">
                <strong>startTime:</strong>
                <p class="m-0">{{ schedule.startTime }}</p>
              </li>
              <li class="list-group-item">
                <strong>startTime:</strong>
                <p class="m-0">{{ schedule.startTime }}</p>
              </li>
              <li class="list-group-item">
                <strong>workDays:</strong>
                <p class="m-0">
                    <span
                      *ngFor="let indexOfDay of schedule.workDays; let index = index">{{ index > 0 && index < (schedule?.workDays?.length ?? 0) ? ', ' : '' }}{{ indexOfDay | weekDay }}</span>
                </p>
              </li>
            </ul>

          </div>
          <div
            class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4  mt-4">
            <h4>
              Duration Versions
            </h4>
            <ul *ngFor="let durationVersion of service.durationVersions" class="list-group">
              <li class="list-group-item">
                <strong>Duration:</strong>
                <p class="m-0">{{ durationVersion.duration }} minute</p>
              </li>
              <li class="list-group-item">
                <strong>Brake:</strong>
                <p class="m-0">{{ durationVersion.break }} minute</p>
              </li>
              <li class="list-group-item">
                <strong>Prices:</strong>

                <ul *ngFor="let price of durationVersion.prices" class="list-group my-2">

                  <li class="list-group-item d-flex align-items-center justify-content-between"
                      aria-current="true">
                    <div>
                      <small class="mb-1">
                        Preferred Languages:
                      </small>
                      <p class="mb-1">
                          <span
                            *ngFor="let languageCode of price.preferredLanguages; let index = index">{{ index > 0 && index < (price?.preferredLanguages?.length ?? 0) ? ', ' : '' }}{{ languageCode | language }}</span>
                      </p>
                    </div>
                    <h5 class="m-0">
                      {{ price.price }}&nbsp;{{ price.currency }}
                    </h5>
                  </li>
                </ul>
              </li>
            </ul>

          </div>

        </div>
        <div class="col-span-12 lg:col-span-4">

          <div
            class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4  mt-4">
            <h4>
              Configuration
            </h4>

            <ul class="list-group">
              <li class="list-group-item">
                <strong>earliestDateTime:</strong>
                <p class="m-0">{{ service.configuration.earliestDateTime }}</p>
              </li>
              <li class="list-group-item">
                <strong>latestDateTime:</strong>
                <p class="m-0">{{ service.configuration.latestDateTime }}</p>
              </li>
            </ul>
          </div>

          <div
            class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4  mt-4">
            <h4>
              Prepayment Policy
            </h4>

            <ul class="list-group">
              <li class="list-group-item">
                <strong>isRequired:</strong>
                <p class="m-0">{{ service.prepaymentPolicy.isRequired }}</p>
              </li>
              <li class="list-group-item">
                <strong>isPercentage:</strong>
                <p class="m-0">{{ service.prepaymentPolicy.isPercentage }}</p>
              </li>
              <li class="list-group-item">
                <strong>value:</strong>
                <p class="m-0">{{ service.prepaymentPolicy.value }}</p>
              </li>
              <li class="list-group-item">
                <strong>minimalCancelTime:</strong>
                <p class="m-0">{{ service.prepaymentPolicy.minimalCancelTime }}</p>
              </li>
            </ul>
          </div>

          <div
            class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4  mt-4">
            <h4>
              Service
            </h4>

            <ul class="list-group">
              <li class="list-group-item">
                <strong>Active:</strong>
                <p class="m-0">{{ service.active }}</p>
              </li>
              <li class="list-group-item">
                <strong>Created at:</strong>
                <p class="m-0">{{ service.createdAt }}</p>
              </li>
              <li class="list-group-item">
                <strong>Update at:</strong>
                <p class="m-0">{{ service.updatedAt }}</p>
              </li>
            </ul>
          </div>
        </div>
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
    LanguagePipe,
    WeekDayPipe,
    LoaderComponent
  ],
  providers: [
    ServiceRepository,
  ],
  standalone: true
})
export default class Index {

  public readonly repository = inject(ServiceRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  @HostBinding()
  public readonly class = 'p-4 block';

  public readonly service$: Observable<Service.IService | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

  public languageVersions(languageVersion: any): ILanguageVersion[] {
    return Object.values(languageVersion);
  }

}
