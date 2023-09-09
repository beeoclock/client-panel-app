import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";

@Component({
  selector: 'business-category-select-component',
  standalone: true,
  template: `
    <label default
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
		TranslateModule,
		DefaultLabelDirective
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
