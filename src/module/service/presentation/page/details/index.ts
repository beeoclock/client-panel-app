import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ServiceFormRepository} from '@service/repository/service.form.repository';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
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
          <ul class="list-group">
            <li class="list-group-item">
              <strong>First name:</strong>
              <p class="m-0">TODO</p>
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
    RouterLink
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
