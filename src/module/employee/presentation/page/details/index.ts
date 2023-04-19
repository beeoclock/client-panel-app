import {Component, inject, ViewEncapsulation} from '@angular/core';
import {EmployeeFormRepository} from '@employee/repository/employee.form.repository';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Employee from '@employee/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';

@Component({
  selector: 'employee-detail-page',
  template: `
    <ng-container *ngIf="employee$ | async as employee; else LoadingTemplate">
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
              <p class="m-0">{{ employee.firstName }}</p>
            </li>
            <li class="list-group-item">
              <strong>Last name:</strong>
              <p class="m-0">{{ employee.lastName }}</p>
            </li>
            <li class="list-group-item">
              <strong>E-mail:</strong>
              <p class="m-0">{{ employee.email }}</p>
            </li>
            <li class="list-group-item">
              <strong>Phone:</strong>
              <p class="m-0">{{ employee.phone }}</p>
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

  public readonly repository: EmployeeFormRepository = inject(EmployeeFormRepository);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly employee$: Observable<Employee.IEmployee | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      this.docId = id;
      const doc = await this.repository.item(this.docId);
      return doc.data();
    }),
  );

}
