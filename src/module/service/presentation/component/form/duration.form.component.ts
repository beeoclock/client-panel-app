import {Component, Input, ViewEncapsulation} from '@angular/core';
import {DurationVersionForm} from '@service/form/service.form';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {InputDirective} from '@utility/directives/input/input.directive';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {NgForOf} from '@angular/common';
import {LanguageCodeEnum} from '@utility/domain/enum';

@Component({
  selector: 'service-duration-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputErrorComponent,
    NgSelectModule,
    ReactiveFormsModule,
    InputDirective,
    HasErrorModule,
    NgForOf
  ],
  template: `
    <form [formGroup]="form">

      <div class="col-12 mt-2 position-relative">
        <label for="service-form-break">Break</label>
        <div class="input-group">
          <input
            beeoclock
            type="number"
            hasError
            placeholder="Write title of service"
            id="service-form-break"
            formControlName="break">
          <span class="input-group-text" id="basic-addon2">minute</span>
        </div>
        <utility-input-error-component
          [control]="form.controls.break"></utility-input-error-component>
      </div>

      <div class="col-12 mt-2 position-relative">
        <label for="service-form-duration">Duration</label>
        <div class="input-group">
          <input
            beeoclock
            hasError
            type="number"
            placeholder="Write title of service"
            id="service-form-duration"
            formControlName="duration">
          <span class="input-group-text" id="basic-addon2">minute</span>
        </div>
        <utility-input-error-component
          [control]="form.controls.duration"></utility-input-error-component>
      </div>

      <ng-container formArrayName="prices">

        <ng-container *ngFor="let priceControl of form.controls.prices.controls; let index = index">

          <ng-container [formGroupName]="index">

            <div class="col-12 position-relative">
              <label for="service-form-price">Price</label>
              <div class="input-group">
                <input
                  beeoclock
                  hasError
                  placeholder="Write price"
                  id="service-form-price"
                  formControlName="price">
                <ng-select [items]="currencyList"
                           [clearable]="false"
                           style="width: 100px"
                           id="service-form-currency"
                           bindLabel="name"
                           bindValue="id"
                           formControlName="currency">
                </ng-select>
              </div>
              <utility-input-error-component
                [control]="priceControl.controls.price"></utility-input-error-component>
              <utility-input-error-component
                [control]="priceControl.controls.currency"></utility-input-error-component>
            </div>

            <div class="col-12 mt-2 position-relative">
              <label for="service-form-preferredLanguages">Preferred languages</label>
              <ng-select [items]="languageList"
                         [multiple]="true"
                         id="service-form-preferredLanguages"
                         bindLabel="name"
                         bindValue="id"
                         formControlName="preferredLanguages">
              </ng-select>
              <utility-input-error-component [control]="priceControl.controls.preferredLanguages"></utility-input-error-component>
            </div>

          </ng-container>

        </ng-container>

      </ng-container>

    </form>
  `
})
export class DurationFormComponent {

  @Input()
  public form: DurationVersionForm = new DurationVersionForm();

  public readonly currencyList = Object.values(CurrencyCodeEnum).map((currency) => ({
    id: currency,
    name: currency
  }));

  public readonly languageList = Object.values(LanguageCodeEnum).map((language) => ({
    id: language,
    name: language
  }));

}
