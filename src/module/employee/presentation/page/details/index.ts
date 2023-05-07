import {Component, inject, ViewEncapsulation} from '@angular/core';
import {EmployeeRepository} from '@employee/repository/employee.repository';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Employee from '@employee/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {PopoverComponent} from "@utility/presentation/component/popover/popover.component";

@Component({
  selector: 'employee-detail-page',
  template: `
    <ng-container *ngIf="employee$ | async as employee; else LoadingTemplate">
      <div class="d-flex justify-content-between">
        <utility-back-link-component url="../../"></utility-back-link-component>
        <utility-popover id="list-menu">
          <i button class="bi bi-three-dots-vertical"></i>
          <ul content class="list-group border-0">
            <li
              [routerLink]="['../../', 'form', employee._id]"
              close-on-self-click
              class="list-group-item list-group-item-action cursor-pointer border-0">
              <i class="bi bi-pencil"></i>
              Edit
            </li>
            <li
              (click)="delete(employee._id)"
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
    RouterLink,
    PopoverComponent
  ],
  standalone: true
})
export default class Index {

  public readonly repository = inject(EmployeeRepository);
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly router = inject(Router);

  public readonly employee$: Observable<Employee.IEmployee | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

  public delete(id: string): void {
    this.repository.remove(id).then((result) => {
      if (result) {
        this.router.navigate(['/', 'employee']);
      }
    });
  }

}
