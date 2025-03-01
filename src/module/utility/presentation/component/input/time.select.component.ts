import {Component, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {generateTimeOptions} from "@src/script/generate-time-options";
import {HumanizeDurationHelper} from "@utility/helper/humanize/humanize-duration.helper";
import {extractSecondsFrom_hh_mm_ss, secondsTo_hh_mm} from "@utility/domain/time";
import {is} from "@src/core/shared/checker";
import {filter, map} from "rxjs";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {NgIf} from "@angular/common";
import {DateTime} from "luxon";

@Component({
	selector: 'bee-time-select-component',
	standalone: true,
	template: `
		@if (showLabel) {

			<label default [for]="id">{{ label }}</label>
		}
		<ng-select
			isRequired
			invalidTooltip
			setRedBorderTo=".ng-select-container"
			placeholder="00:00"
			bindLabel="label"
			bindValue="value"
			class="min-h-[42px]"
			[addTagText]="'keyword.capitalize.addDuration' | translate"
			[addTag]="addTag.bind(this)"
			[items]="items"
			[clearable]="false"
			[id]="id"
			[formControl]="localControl">
		</ng-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective,
		IsRequiredDirective,
		InvalidTooltipDirective,
		NgIf
	],
})
export class TimeSelectComponent extends Reactive implements OnInit {

	@Input()
	public id = '';

	@Input()
	public label = '';

	@Input()
	public showLabel = true;

	@Input()
	public from = '00:00';

	@Input()
	public to = '23:59';

	@Input()
	public step = '00:01';

	@Input()
	public control = new FormControl();

	public localControl = new FormControl();

	private readonly logger = inject(NGXLogger);
	private readonly humanizeDurationHelper = inject(HumanizeDurationHelper);

	public readonly items = generateTimeOptions({
		from: this.from,
		to: this.to,
	}, this.step).map(({value}) => {
		return {
			label: DateTime.fromSeconds(value, {zone: 'UTC'}).toFormat('HH:mm'),
			value,
		};
	});

	constructor() {
		super();
	}

	public addTag(tag: string) {
		const result = extractSecondsFrom_hh_mm_ss(tag);
		if (isNaN(result)) {
			this.localControl.setErrors({durationFormatInvalid: true});
			return;
		}

		const label = this.humanizeDurationHelper.fromSeconds(result);

		this.items.push({
			label,
			value: result,
		});

		return {
			label,
			value: secondsTo_hh_mm(result),
		};
	}

	public ngOnInit(): void {
		this.initLocalControlValue();
		this.localControl.valueChanges.pipe(
			map((value) => {
				if (is.string(value)) {
					return extractSecondsFrom_hh_mm_ss(value);
				}
				return value;
			}),
			filter(is.number)
		).subscribe((value) => {
			this.logger.debug('DurationSelectComponent:localControl:valueChanges', value);
			this.control.patchValue(value);
		});
		this.control.valueChanges
			.pipe(
				this.takeUntil(),
				filter((value) => secondsTo_hh_mm(value) !== this.localControl.value),
			)
			.subscribe((value) => {
				this.logger.debug('DurationSelectComponent:control:valueChanges', value);
				this.localControl.patchValue(value, {
					emitEvent: false,
					onlySelf: true,
				});
			});
	}

	private initLocalControlValue() {
		const localControlValue = this.control.value;
		if (localControlValue) {
			const foundValue = this.items.some(({value}) => value === localControlValue);
			if (!foundValue) {
				this.items.push({
					label: this.humanizeDurationHelper.fromSeconds(localControlValue),
					value: localControlValue,
				});
			}
		}

		this
			.localControl
			.patchValue(localControlValue);
	}
}
