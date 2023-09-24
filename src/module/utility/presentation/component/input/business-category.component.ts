import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'bee-business-category-select-component',
	standalone: true,
	template: `
		<label default [for]="id">{{ 'keyword.capitalize.businessCategory' | translate }}</label>
		<ng-select
			isRequired
			invalidTooltip
			setRedBorderTo=".ng-select-container"
			bindLabel="name"
			bindValue="code"
			[placeholder]="'keyword.capitalize.placeholder.selectBusinessCategory' | translate"
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
		DefaultLabelDirective,
		IsRequiredDirective,
		InvalidTooltipDirective
	],
})
export class PriceAndCurrencyComponent {

	@Input()
	public id = '';

	@Input()
	public control = new FormControl();

	public readonly translateService = inject(TranslateService);

	public readonly businessCategoryList: { name: string, code: BusinessCategoryEnum }[] = [];
	private readonly businessCategoryTranslateMap!: Record<BusinessCategoryEnum, string>;

	constructor() {
		this.businessCategoryTranslateMap = this.translateService.instant(`businessCategory`);
		this.businessCategoryList = Object.values(BusinessCategoryEnum).map((businessCategory) => {
			return {
				name: this.businessCategoryTranslateMap[businessCategory],
				code: businessCategory
			};
		});
	}

}
