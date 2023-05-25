import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {EmployeeRepository} from '@employee/repository/employee.repository';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Employee from '@employee/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
  selector: 'employee-detail-page',
  template: `
    <utility-back-link-component url="../../"></utility-back-link-component>
    <ng-container *ngIf="employee$ | async as employe; else LoadingTemplate">
      <div
        class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
        <div class="lg:flex lg:items-center lg:justify-between">
          <div class="min-w-0 flex-1">
            <h2
              class="text-2xl font-bold leading-7 text-neutral-900 dark:text-neutral-200 sm:truncate sm:text-3xl sm:tracking-tight">
              {{ employe.firstName }}&nbsp;{{ employe.lastName }}
            </h2>
            <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div class="mt-2 flex items-center text-sm text-neutral-500">
                <i class="bi bi-at"></i>
                {{ employe.email || 'No data' }}
              </div>
              <div class="mt-2 flex items-center text-sm text-neutral-500">
                <i class="bi bi-phone"></i>
                {{ employe.phone || 'No data' }}
              </div>
            </div>
          </div>
          <div class="mt-5 flex lg:ml-4 lg:mt-0">
            <span class="hidden sm:block">
              <a type="button"
                 [routerLink]="['../../', 'form', employe._id]"
                 class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">
                <i class="bi bi-pencil me-2"></i>
                Edit
              </a>
            </span>

            <span class="ml-3 hidden sm:block">
              <button type="button"
                      (click)="repository.delete(employe._id)"
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
                      ring-neutral-300
                      hover:bg-neutral-50">
                <i class="bi bi-trash me-2"></i>
                Delete
              </button>
            </span>

            <utility-dropdown [smHidden]="true">
              <ng-container content>
                <a [routerLink]="['../../', 'form', employe._id]" class="block px-4 py-2 text-sm text-neutral-700"
                   role="menuitem" tabindex="-1"
                   id="mobile-menu-item-0">
                  <i class="bi bi-pencil me-2"></i>
                  Edit
                </a>
                <button (click)="repository.delete(employe._id)" class="block px-4 py-2 text-sm text-red-500"
                        role="menuitem" tabindex="-1"
                        id="mobile-menu-item-1">
                  <i class="bi bi-trash me-2"></i>
                  Delete
                </button>
              </ng-container>
            </utility-dropdown>
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
    DropdownComponent,
    LoaderComponent
  ],
  standalone: true
})
export default class Index {

  public readonly repository = inject(EmployeeRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  @HostBinding()
  public readonly class = 'p-4 block';

  public readonly employee$: Observable<Employee.IEmployee | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

}
