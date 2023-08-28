import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {TagsComponent} from "@service/presentation/component/form/v2/details/tags.component";
import {SpecialistsComponent} from "@service/presentation/component/form/v2/prices/specialists.component";
import {PriceAndCurrencyComponent} from "@utility/presentation/component/input/price-and-currency.component";
import {InputBadgeComponent} from "@utility/presentation/component/input/input-badge.component";
import {PriceForm} from "@service/presentation/form/service.form";

@Component({
  selector: 'service-form-price-block-component',
  standalone: true,
  template: `
    <div class="flex flex-col gap-3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <form-badge-input
          mask="00:00"
          [control]="durationControl"
          placeholder="00:00"
          [label]="'keyword.capitalize.duration' | translate"
          [badge]="'keyword.capitalize.priceTimeFormatPrompt' | translate">
        </form-badge-input>
        <price-and-currency-component
          [priceControl]="priceForm.controls.price"
          [currencyControl]="priceForm.controls.currency">
        </price-and-currency-component>
      </div>
      <!--      <service-form-prices-specialists-component [label]="'Specialists' | translate"></service-form-prices-specialists-component>-->
    </div>
  `,
  imports: [
    NgIf,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    TagsComponent,
    SpecialistsComponent,
    PriceAndCurrencyComponent,
    InputBadgeComponent,
  ]
})
export class PriceBlockComponent {

  @Input()
  public durationControl = new FormControl();

  @Input()
  public priceForm = new PriceForm();

}
