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
          <div
            class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
            <h4>
              Permanent employees
            </h4>

            <ul *ngFor="let permanentEmployee of service.permanentEmployees" class="list-group">
              <li class="list-group-item d-flex flex-column" aria-current="true">
                <div class="d-flex w-100 justify-content-between">
                </div>
                <p class="mb-1">
                  <i class="bi bi-person"></i>
                  {{ permanentEmployee.employee.firstName }} {{ permanentEmployee.employee.lastName }}
                </p>
                <small>
                  {{ permanentEmployee.employee.email }}
                </small>
                <small>
                  {{ permanentEmployee.employee.phone }}
                </small>
              </li>
            </ul>

          </div>
          <div
            class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
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
                    [class.text-danger]="!languageVersion.active"
                    [class.text-success]="languageVersion.active">
                    {{ languageVersion.active ? 'active' : 'Inactive' }}
                  </small>
                </div>
                <p class="mb-1">{{ languageVersion.title }}</p>
                <small>{{ languageVersion.description }}</small>
              </li>
            </ul>

          </div>
          <div
            class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
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
            class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
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
            class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
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
            class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
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
            class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
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

    <!--    <div class="lg:flex lg:items-center lg:justify-between">-->
    <!--      <div class="min-w-0 flex-1">-->
    <!--        <h2-->
    <!--          class="text-2xl font-bold leading-7 text-neutral-900 dark:text-neutral-200 sm:truncate sm:text-3xl sm:tracking-tight">-->
    <!--          {{ employe.firstName }}&nbsp;{{ employe.lastName }}-->
    <!--        </h2>-->
    <!--        <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">-->
    <!--          <div class="mt-2 flex items-center text-sm text-neutral-500">-->
    <!--            <i class="bi bi-at"></i>-->
    <!--            {{ employe.email || 'No data' }}-->
    <!--          </div>-->
    <!--          <div class="mt-2 flex items-center text-sm text-neutral-500">-->
    <!--            <i class="bi bi-phone"></i>-->
    <!--            {{ employe.phone || 'No data' }}-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="mt-5 flex lg:ml-4 lg:mt-0">-->
    <!--            <span class="hidden sm:block">-->
    <!--              <a type="button"-->
    <!--                 [routerLink]="['../../', 'form', service._id]"-->
    <!--                 class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">-->
    <!--                <i class="bi bi-pencil me-2"></i>-->
    <!--                Edit-->
    <!--              </a>-->
    <!--            </span>-->

    <!--        <span class="ml-3 hidden sm:block">-->
    <!--              <button type="button"-->
    <!--                      (click)="repository.delete(service._id)"-->
    <!--                      class="-->
    <!--                      inline-flex-->
    <!--                      items-center-->
    <!--                      rounded-md-->
    <!--                      bg-white-->
    <!--                      px-3-->
    <!--                      py-2-->
    <!--                      text-sm-->
    <!--                      font-semibold-->
    <!--                      text-red-500-->
    <!--                      shadow-sm-->
    <!--                      ring-1-->
    <!--                      ring-inset-->
    <!--                      ring-neutral-300-->
    <!--                      hover:bg-neutral-50">-->
    <!--                <i class="bi bi-trash me-2"></i>-->
    <!--                Delete-->
    <!--              </button>-->
    <!--            </span>-->

    <!--        <utility-dropdown [smHidden]="true">-->
    <!--          <ng-container content>-->
    <!--            <a [routerLink]="['../../', 'form', service._id]" class="block px-4 py-2 text-sm text-neutral-700"-->
    <!--               role="menuitem" tabindex="-1"-->
    <!--               id="mobile-menu-item-0">-->
    <!--              <i class="bi bi-pencil me-2"></i>-->
    <!--              Edit-->
    <!--            </a>-->
    <!--            <button (click)="repository.delete(service._id)" class="block px-4 py-2 text-sm text-red-500"-->
    <!--                    role="menuitem" tabindex="-1"-->
    <!--                    id="mobile-menu-item-1">-->
    <!--              <i class="bi bi-trash me-2"></i>-->
    <!--              Delete-->
    <!--            </button>-->
    <!--          </ng-container>-->
    <!--        </utility-dropdown>-->
    <!--      </div>-->
    <!--    </div>-->
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
