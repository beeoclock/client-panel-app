import {Component, Input, ViewEncapsulation} from '@angular/core';
import {PriceForm} from '@service/presentation/form/service.form';

import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/presentation/directives/input/input.directive';
import {NgForOf, NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {PriceAndCurrencyComponent} from "@utility/presentation/component/input/price-and-currency.component";
import {LanguageCodeEnum} from "@utility/domain/enum";

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
    InvalidTooltipDirective,
    PriceAndCurrencyComponent
  ],
  template: `
    <form [formGroup]="form">
      <price-and-currency-component
        [currencyControl]="form.controls.currency"
        [priceControl]="form.controls.price"
        [prefix]="prefix">
      </price-and-currency-component>

      <!--      <div class="col-12 mt-2 position-relative">-->
      <!--        <label [for]="prefix + 'preferredLanguages'">Preferred languages</label>-->
      <!--        <ng-select-->
      <!--          [items]="languageList"-->
      <!--          [multiple]="true"-->
      <!--          [id]="prefix + 'preferredLanguages'"-->
      <!--          bindLabel="name"-->
      <!--          bindValue="id"-->
      <!--          formControlName="preferredLanguages">-->
      <!--        </ng-select>-->
      <!--      </div>-->

    </form>
  `
})
export class PriceFormComponent {

  @Input()
  public showRemoveButton = false;

  @Input()
  public form: PriceForm = new PriceForm();

  public readonly prefix = 'service-price-form-component-';

  public readonly languageList = Object.values(LanguageCodeEnum).map((language) => ({
    id: language,
    name: language
  }));

}
