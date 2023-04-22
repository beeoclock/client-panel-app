import {Component, Input, ViewEncapsulation} from '@angular/core';
import {PricesForm} from '@service/form/service.form';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {NgForOf} from '@angular/common';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {PriceFormComponent} from '@service/presentation/component/form/price.form.component';

@Component({
  selector: 'service-prices-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputErrorComponent,
    NgSelectModule,
    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective,
    NgForOf,
    PriceFormComponent
  ],
  template: `
    <service-price-form-component
      *ngFor="let control of form.controls; let index = index"
      (removeEvent)="form.remove(index)"
      [showRemoveButton]="index > 0"
      [index]="index"
      [form]="control">
    </service-price-form-component>
    <hr>
    <button class="btn btn-primary" (click)="form.pushNewPriceForm()">Add new price</button>
  `
})
export class PricesFormComponent {

  @Input()
  public form: PricesForm = new PricesForm();

}
