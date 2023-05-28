import {Component, Input, ViewEncapsulation} from '@angular/core';
import {PriceForm} from '@service/form/service.form';

import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {InputDirective} from '@utility/directives/input/input.directive';
import {NgForOf, NgIf} from '@angular/common';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'service-price-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [

    NgSelectModule,
    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective,
    NgForOf,
    NgIf,
    InvalidTooltipDirective
  ],
  template: `
    <form [formGroup]="form">
      <div>
        <label [for]="prefix + 'price'">Price</label>
        <div class="flex">
          <input
            type="text"
            id="website-admin"
            hasError
            invalidTooltip
            placeholder="Write price"
            [id]="prefix + 'price'"
            formControlName="price"
            class="
            rounded-none
            rounded-l
            border
            text-beeColor-900
            focus:ring-blue-500
            focus:border-blue-500
            block
            flex-1
            min-w-0
            w-full
            text-sm
            border-beeColor-300
            py-2
            px-3
            dark:bg-beeDarkColor-700
            dark:border-beeDarkColor-600
            dark:placeholder-beeDarkColor-400
            dark:text-white
            dark:focus:ring-blue-500
            dark:focus:border-blue-500">
          <span class="
            inline-flex
            items-center
            text-sm
            text-beeColor-900
            bg-beeColor-200
            border
            border-l-0
            border-beeColor-300
            rounded-r
            dark:bg-beeDarkColor-600
            dark:text-beeDarkColor-400
            dark:border-beeDarkColor-600">
          <ng-select
            [items]="currencyList"
            [clearable]="false"
            style="width: 100px"
            class="border-0"
            [id]="prefix + 'currency'"
            bindLabel="name"
            bindValue="id"
            formControlName="currency">
          </ng-select>
        </span>
        </div>
      </div>

      <div class="col-12 mt-2 position-relative">
        <label [for]="prefix + 'preferredLanguages'">Preferred languages</label>
        <ng-select
          [items]="languageList"
          [multiple]="true"
          [id]="prefix + 'preferredLanguages'"
          bindLabel="name"
          bindValue="id"
          formControlName="preferredLanguages">
        </ng-select>
      </div>

    </form>
  `
})
export class PriceFormComponent {

  @Input()
  public showRemoveButton = false;

  @Input()
  public form: PriceForm = new PriceForm();

  public readonly prefix = 'service-price-form-component-';

  public readonly currencyList = Object.values(CurrencyCodeEnum).map((currency) => ({
    id: currency,
    name: currency
  }));

  public readonly languageList = Object.values(LanguageCodeEnum).map((language) => ({
    id: language,
    name: language
  }));

}
