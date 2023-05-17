import {Component, inject, ViewEncapsulation} from '@angular/core';
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
import {PopoverComponent} from "@utility/presentation/component/popover/popover.component";
import {LanguagePipe} from "@utility/pipes/language.pipe";
import {WeekDayPipe} from "@utility/pipes/week-day.pipe";

@Component({
  selector: 'service-detail-page',
  template: `
    <ng-container *ngIf="service$ | async as service; else LoadingTemplate">
      <div class="d-flex justify-content-between">
        <utility-back-link-component url="../../"></utility-back-link-component>
        <utility-popover id="list-menu">
          <i button class="bi bi-three-dots-vertical"></i>
          <ul content class="list-group border-0">
            <li
              [routerLink]="['../../', 'form', service._id]"
              close-on-self-click
              class="list-group-item list-group-item-action cursor-pointer border-0">
              <i class="bi bi-pencil"></i>
              Edit
            </li>
            <li
              (click)="repository.delete(service._id)"
              close-on-self-click
              class="list-group-item list-group-item-action cursor-pointer border-0">
              <i class="bi bi-trash"></i>
              Delete
            </li>
          </ul>
        </utility-popover>
      </div>
      <div class="row">
        <div class="col-md-8">

          <utility-card-component class="mt-3 border">
            <utility-body-card-component>
              <strong>Permanent employees</strong>
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component class="mt-3"
                                  *ngFor="let permanentEmployee of service.permanentEmployees">
            <utility-body-card-component class="p-0">
              <ul class="list-group">
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
            </utility-body-card-component>
          </utility-card-component>

          <hr class="my-4">

          <utility-card-component class="border">
            <utility-body-card-component>
              <strong>Language Versions</strong>
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component class="mt-3"
                                  *ngFor="let languageVersion of languageVersions(service.languageVersions)">
            <utility-body-card-component class="p-0">
              <ul class="list-group">
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
            </utility-body-card-component>
          </utility-card-component>

          <hr class="my-4">

          <utility-card-component class="border">
            <utility-body-card-component>
              <strong>schedules</strong>
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component *ngFor="let schedule of service.schedules" class="mt-3">
            <utility-body-card-component class="p-0">
              <ul class="list-group">
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
            </utility-body-card-component>
          </utility-card-component>

          <hr class="my-4">

          <utility-card-component class="border">
            <utility-body-card-component>
              <strong>Duration Versions</strong>
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component *ngFor="let durationVersion of service.durationVersions" class="mt-3">
            <utility-body-card-component class="p-0">
              <ul class="list-group">
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
            </utility-body-card-component>
          </utility-card-component>
        </div>
        <div class="col-md-4">
          <utility-card-component class="mt-3 border">
            <utility-body-card-component>
              <strong>Configuration</strong>
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component class="mt-3">
            <utility-body-card-component class="p-0">
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
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component class="mt-3 border">
            <utility-body-card-component>
              <strong>Prepayment Policy</strong>
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component class="mt-3">
            <utility-body-card-component class="p-0">
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
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component class="mt-3 border">
            <utility-body-card-component>
              <strong>Service</strong>
            </utility-body-card-component>
          </utility-card-component>
          <utility-card-component class="mt-3">
            <utility-body-card-component class="p-0">
              <strong></strong>
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
            </utility-body-card-component>
          </utility-card-component>
        </div>
      </div>
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
    NgForOf,
    PopoverComponent,
    LanguagePipe,
    WeekDayPipe
  ],
  providers: [
    ServiceRepository,
  ],
  standalone: true
})
export default class Index {

  public readonly repository = inject(ServiceRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly service$: Observable<Service.IService | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

  public languageVersions(languageVersion: any): ILanguageVersion[] {
    return Object.values(languageVersion);
  }

}
