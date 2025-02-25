import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BusinessIndustryEnum} from "@core/shared/enum/business-industry.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'bee-business-industry-select-component',
	standalone: true,
	template: `
		<label default [for]="id()">{{ 'keyword.capitalize.businessIndustry' | translate }}</label>
		<ng-select
			isRequired
			invalidTooltip
			setRedBorderTo=".ng-select-container"
			bindLabel="name"
			bindValue="code"
			[placeholder]="'keyword.capitalize.placeholder.selectBusinessIndustry' | translate"
			[items]="businessIndustryList"
			[clearable]="false"
			[id]="id()"
			[formControl]="control()">
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
export class BusinessIndustryComponent {

	public readonly id = input('');

	public readonly control = input(new FormControl());

	public readonly translateService = inject(TranslateService);

	public readonly businessIndustryList: { name: string, code: BusinessIndustryEnum }[] = [];
	private readonly businessIndustryTranslateMap!: Record<BusinessIndustryEnum, string>;

	constructor() {
		this.businessIndustryTranslateMap = this.translateService.instant(`businessIndustry`);
		this.businessIndustryList = Object.values(BusinessIndustryEnum).map((businessIndustry) => {
			return {
				name: this.businessIndustryTranslateMap[businessIndustry],
				code: businessIndustry
			};
		});
	}

}
