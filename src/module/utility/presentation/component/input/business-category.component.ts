import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";

@Component({
  selector: 'business-category-select-component',
  standalone: true,
  template: `
    <label class="dark:text-beeDarkColor-300 block text-sm font-medium leading-6 text-beeColor-900 dark:text-white"
           [for]="id">{{ 'keyword.capitalize.businessCategory' | translate }}</label>
    <ng-select
      bindLabel="name"
      bindValue="code"
      [items]="businessCategoryList"
      [clearable]="false"
      [id]="id"
      [formControl]="control">
    </ng-select>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
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
