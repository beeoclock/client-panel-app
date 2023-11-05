import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {generateTimeOptions} from "@src/script/generate-time-options";
import {HumanizeDurationHelper} from "@utility/helper/humanize/humanize-duration.helper";

@Component({
	selector: 'bee-duration-select-component',
	standalone: true,
	template: `
		<label default [for]="id">{{ label }}</label>
		<ng-select
			isRequired
			invalidTooltip
			setRedBorderTo=".ng-select-container"
			placeholder="00:00"
			bindLabel="label"
			bindValue="value"
			[items]="items"
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
export class DurationSelectComponent {

	@Input()
	public id = '';

	@Input()
	public label = '';

	@Input()
	public from = '00:00';

	@Input()
	public to = '23:59';

	@Input()
	public step = '00:15';

	@Input()
	public control = new FormControl();

	private readonly humanizeDurationHelper = inject(HumanizeDurationHelper);

	public readonly items = generateTimeOptions({
		from: this.from,
		to: this.to,
	}, this.step).map(({value}) => {
		return {
			label: this.humanizeDurationHelper.fromSeconds(value),
			value,
		};
	});

}
