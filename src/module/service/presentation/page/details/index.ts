import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ServiceFormRepository} from '@service/repository/service.form.repository';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Service from '@service/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';

@Component({
  selector: 'service-detail-page',
  template: `
    <ng-container *ngIf="service$ | async as service; else LoadingTemplate">
      <div class="d-flex justify-content-between">
        <utility-back-link-component url="../../"></utility-back-link-component>
        <a class="btn btn-primary" [routerLink]="['../../', 'form', docId]">
          <i class="bi bi-pencil-fill me-3"></i>
          Edit
        </a>
      </div>
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <strong>languageVersions</strong>
          <ul *ngFor="let languageVersion of service.languageVersions" class="list-group">
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
              <p class="m-0">{{ service.configuration?.earliestDateTime }}</p>
            </li>
            <li class="list-group-item">
              <strong>latestDateTime:</strong>
              <p class="m-0">{{ service.configuration?.latestDateTime }}</p>
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
              <p class="m-0">{{ service.prepaymentPolicy?.isRequired }}</p>
            </li>
            <li class="list-group-item">
              <strong>isPercentage:</strong>
              <p class="m-0">{{ service.prepaymentPolicy?.isPercentage }}</p>
            </li>
            <li class="list-group-item">
              <strong>value:</strong>
              <p class="m-0">{{ service.prepaymentPolicy?.value }}</p>
            </li>
            <li class="list-group-item">
              <strong>minimalCancelTime:</strong>
              <p class="m-0">{{ service.prepaymentPolicy?.minimalCancelTime }}</p>
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
    NgForOf
  ],
  providers: [
    ServiceFormRepository,
  ],
  standalone: true
})
export default class Index {
  public docId!: string;

  public readonly repository: ServiceFormRepository = inject(ServiceFormRepository);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly service$: Observable<Service.IService | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      this.docId = id;
      const doc = await this.repository.item(this.docId);
      return doc.data();
    }),
  );

}
