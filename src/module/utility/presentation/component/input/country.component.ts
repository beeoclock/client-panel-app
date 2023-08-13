import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/directives/has-error/has-error.directive";
import {NgxMaskDirective} from "ngx-mask";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CountryEnum} from "@utility/domain/enum/country.enum";

@Component({
  selector: 'country-select-component',
  standalone: true,
  template: `
    <label class="dark:text-beeDarkColor-300" [for]="id">
      {{ 'keyword.capitalize.country' | translate }}
    </label>
    <div class="mt-2">
      <ng-select
        bindLabel="name"
        bindValue="code"
        [items]="countryList"
        [clearable]="false"
        [id]="id"
        [formControl]="control">
      </ng-select>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    InvalidTooltipDirective,
    HasErrorDirective,
    NgxMaskDirective,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceAndCurrencyComponent {

  @Input()
  public id: string = '';

  @Input()
  public control = new FormControl();

  public readonly translateService = inject(TranslateService);

  public readonly countryList = Object.keys(CountryEnum).map((countryCode) => {
    return {
      name: this.translateService.instant(`country.${countryCode}`),
      code: countryCode
    };
  });

}
