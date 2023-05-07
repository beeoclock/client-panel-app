import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ServiceRepository} from '@service/repository/service.repository';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
              (click)="delete(service._id)"
              close-on-self-click
              class="list-group-item list-group-item-action cursor-pointer border-0">
              <i class="bi bi-trash"></i>
              Delete
            </li>
          </ul>
        </utility-popover>
      </div>
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <strong>languageVersions</strong>
          <ul *ngFor="let languageVersion of languageVersions(service.languageVersions)" class="list-group mt-4">
            <li class="list-group-item">
              <strong>Language:</strong>
              <p class="m-0">{{ languageVersion.language }}</p>
            </li>
            <li class="list-group-item">
              <strong>Title:</strong>
              <p class="m-0">{{ languageVersion.title }}</p>
            </li>
            <li class="list-group-item">
              <strong>Description:</strong>
              <p class="m-0">{{ languageVersion.description }}</p>
            </li>
            <li class="list-group-item">
              <strong>Active:</strong>
              <p class="m-0">{{ languageVersion.active }}</p>
            </li>
          </ul>
        </utility-body-card-component>
      </utility-card-component>
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <strong>schedules</strong>
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
              <p class="m-0">{{ schedule.workDays?.join(', ') }}</p>
            </li>
          </ul>
        </utility-body-card-component>
      </utility-card-component>
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <strong>durationVersions</strong>
          <ul *ngFor="let durationVersion of service.durationVersions" class="list-group">
            <li class="list-group-item">
              <strong>Duration:</strong>
              <p class="m-0">{{ durationVersion.duration }}</p>
            </li>
            <li class="list-group-item">
              <strong>Title:</strong>
              <p class="m-0">{{ durationVersion.break }}</p>
            </li>
            <li class="list-group-item">
              <strong>Active:</strong>
              <p class="m-0">{{ durationVersion.active }}</p>
            </li>
            <li class="list-group-item">
              <strong>Prices:</strong>

              <ul *ngFor="let price of durationVersion.prices" class="list-group">
                <li class="list-group-item">
                  <strong>price:</strong>
                  <p class="m-0">{{ price.price }}</p>
                </li>
                <li class="list-group-item">
                  <strong>currency:</strong>
                  <p class="m-0">{{ price.currency }}</p>
                </li>
                <li class="list-group-item">
                  <strong>preferredLanguages:</strong>
                  <p class="m-0">{{ price.preferredLanguages?.join(', ') }}</p>
                </li>
              </ul>
            </li>
          </ul>
        </utility-body-card-component>
      </utility-card-component>
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <strong>configuration</strong>
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
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <strong>prepaymentPolicy</strong>
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
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <strong>service</strong>
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
    PopoverComponent
  ],
  providers: [
    ServiceRepository,
  ],
  standalone: true
})
export default class Index {

  public readonly repository = inject(ServiceRepository);
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly router = inject(Router);

  public readonly service$: Observable<Service.IService | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

  public languageVersions(languageVersion: any): ILanguageVersion[] {
    return Object.values(languageVersion);
  }

  public delete(id: string): void {
    this.repository.remove(id).then((result) => {
      if (result) {
        this.router.navigate(['/', 'service']);
      }
    });
  }

}
