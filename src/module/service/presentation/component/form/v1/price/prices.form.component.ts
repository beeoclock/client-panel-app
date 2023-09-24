import {Component, Input, ViewEncapsulation} from '@angular/core';
import {PricesForm} from '@service/presentation/form/service.form';

import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {PriceFormComponent} from "@service/presentation/component/form/v1/price/price.form.component";

@Component({
  selector: 'service-prices-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    HasErrorDirective,
    NgForOf,
    PriceFormComponent,
    NgIf
  ],
  template: `
    Duration versions section

    <div
      *ngFor="let control of form.controls; let index = index"
      class="border border-beeColor-200 rounded-2xl dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 dark:text-white mt-4">
      <div
        class="
          justify-between
          flex
          w-full
          px-4
          py-2
          bg-beeColor-100
          border-b
          border-beeColor-200
          rounded-t-2xl
          cursor-pointer
          dark:bg-beeDarkColor-800
          dark:border-beeDarkColor-600">
        Price #{{ index + 1 }}
        <button type="button" class="text-red-500" (click)="form.remove(index)" *ngIf="index > 0">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <div class="p-4">
        <service-price-form-component
          [form]="control"/>
      </div>
    </div>

    <hr class="my-4">

    <button type="button" class="border rounded px-4 py-2" (click)="form.pushNewPriceForm()">
      <i class="bi bi-plus-lg me-2"></i>
      Add new price
    </button>
  `
})
export class PricesFormComponent {

  @Input()
  public form: PricesForm = new PricesForm();

}
