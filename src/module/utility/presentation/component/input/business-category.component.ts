import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/directives/has-error/has-error.directive";
import {NgxMaskDirective} from "ngx-mask";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";

@Component({
  selector: 'business-category-component',
  standalone: true,
  template: `
    <label class="dark:text-beeDarkColor-300" [for]="id">{{ 'keyword.capitalize.businessCategory' | translate }}</label>
    <div class="mt-2">
      <ng-select
        bindLabel="name"
        bindValue="code"
        [items]="businessCategoryList"
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

  public readonly businessCategoryList = Object.values(BusinessCategoryEnum).map((businessCategory) => {
    return {
      name: this.translateService.instant(`businessCategory.${businessCategory}`),
      code: businessCategory
    };
  });

}
