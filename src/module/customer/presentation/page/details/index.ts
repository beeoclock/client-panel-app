import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerRepository} from '@customer/repository/customer.repository';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Customer from '@customer/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {PopoverComponent} from "@utility/presentation/component/popover/popover.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
  selector: 'customer-detail-page',
  template: `
    <utility-back-link-component url="../../"></utility-back-link-component>
    <ng-container *ngIf="customer$ | async as customer; else LoadingTemplate">
      <div class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
        <div class="lg:flex lg:items-center lg:justify-between">
          <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {{ customer.firstName }}&nbsp;{{ customer.lastName }}
            </h2>
            <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div class="mt-2 flex items-center text-sm text-gray-500">
                <i class="bi bi-at"></i>
                {{ customer.email || 'No data' }}
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500">
                <i class="bi bi-phone"></i>
                {{ customer.phone || 'No data' }}
              </div>
            </div>
          </div>
          <div class="mt-5 flex lg:ml-4 lg:mt-0">
            <span class="hidden sm:block">
              <a type="button"
                      [routerLink]="['../../', 'form', customer._id]"
                      class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <i class="bi bi-pencil me-2"></i>
                Edit
              </a>
            </span>

            <span class="ml-3 hidden sm:block">
              <button type="button"
                      (click)="repository.delete(customer._id)"
                      class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <i class="bi bi-trash me-2"></i>
                Delete
              </button>
            </span>

            <!-- Dropdown -->
            <div class="relative ml-3 sm:hidden">
              <button type="button"
                      class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                      id="mobile-menu-button" aria-expanded="false" aria-haspopup="true">
                More
                <svg class="-mr-1 ml-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                     aria-hidden="true">
                  <path fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"/>
                </svg>
              </button>
              <div
                class="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button"
                tabindex="-1">
                <!-- Active: "bg-gray-100", Not Active: "" -->
                <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1"
                   id="mobile-menu-item-0">Edit</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1"
                   id="mobile-menu-item-1">View</a>
              </div>
            </div>
          </div>
        </div>
        <hr class="my-6">
        <strong>Note</strong>
        <p>
          {{ customer.note || 'No data' }}
        </p>
      </div>
    </ng-container>
    <ng-template #LoadingTemplate>
      <utility-loader-component></utility-loader-component>
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
    PopoverComponent,
    LoaderComponent
  ],
  standalone: true
})
export default class Index {

  public readonly repository = inject(CustomerRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly customer$: Observable<Customer.ICustomer | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

}
