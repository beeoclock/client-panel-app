import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'bee-service-provide-type-select-component',
	standalone: true,
	template: `
		<label default [for]="id">{{ 'keyword.capitalize.serviceProvideType' | translate }}</label>
		<ng-select
			isRequired
			invalidTooltip
			setRedBorderTo=".ng-select-container"
			bindLabel="name"
			bindValue="code"
			[placeholder]="'keyword.capitalize.placeholder.selectServiceProvideType' | translate"
			[items]="serviceProvideTypeList"
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
export class ServiceProvideTypeComponent {

	@Input()
	public id = '';

	@Input()
	public control = new FormControl();

	public readonly translateService = inject(TranslateService);

	public readonly serviceProvideTypeList: { name: string, code: ServiceProvideTypeEnum }[] = [];
	private readonly serviceProvideTypeTranslateMap!: Record<ServiceProvideTypeEnum, string>;

	constructor() {
		this.serviceProvideTypeTranslateMap = this.translateService.instant(`serviceProvideType`);
		this.serviceProvideTypeList = Object.values(ServiceProvideTypeEnum).map((serviceProvideType) => {
			return {
				name: this.serviceProvideTypeTranslateMap[serviceProvideType],
				code: serviceProvideType
			};
		});
	}

}
