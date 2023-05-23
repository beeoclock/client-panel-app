import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {PriceForm} from '@service/form/service.form';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {InputDirective} from '@utility/directives/input/input.directive';
import {NgForOf, NgIf} from '@angular/common';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';

@Component({
  selector: 'service-price-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputErrorComponent,
    NgSelectModule,
    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective,
    NgForOf,
    NgIf
  ],
  template: `
    <ul class="list-group mt-3">
      <li class="list-group-item list-group-item-secondary border d-flex justify-content-between">
        <strong>Price</strong>
        <button class="btn btn-link text-danger py-0" (click)="removeEvent.emit()" *ngIf="showRemoveButton">
          <i class="bi bi-trash"></i>
        </button>
      </li>
      <li class="list-group-item pb-3">

        <form [formGroup]="form" class="mt-2">

          <div class="col-12 position-relative">
            <label [for]="prefix + 'price'">Price</label>
            <div class="input-group">
              <input
                beeoclock
                hasError
                placeholder="Write price"
                [id]="prefix + 'price'"
                formControlName="price">
              <ng-select
                [items]="currencyList"
                [clearable]="false"
                style="width: 100px"
                [id]="prefix + 'currency'"
                bindLabel="name"
                bindValue="id"
                formControlName="currency">
              </ng-select>
            </div>
            <utility-input-error-component
              [control]="form.controls.price"></utility-input-error-component>
            <utility-input-error-component
              [control]="form.controls.currency"></utility-input-error-component>
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
            <utility-input-error-component
              [control]="form.controls.preferredLanguages"></utility-input-error-component>
          </div>

        </form>

      </li>
    </ul>
  `
})
export class PriceFormComponent {

  @Input()
  public showRemoveButton = false;

  @Input()
  public index = 0;

  @Output()
  public removeEvent: EventEmitter<void> = new EventEmitter<void>();

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
