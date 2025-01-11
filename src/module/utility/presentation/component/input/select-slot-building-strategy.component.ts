import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation, input} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {SlotBuildingStrategyEnum} from "@client/domain/enum/slot-building-strategy.enum";
import {HumanizeDurationHelper} from "@utility/helper/humanize/humanize-duration.helper";
import {SECONDS_TEN_MINUTES} from "@utility/domain/const/c.time";
import {HALF_HOUR_IN_SECONDS, ONE_HOUR_IN_SECONDS} from "@utility/domain/time";
import {SlotSettingsForm} from "@client/presentation/form/slot-settings.form";

@Component({
	selector: 'select-slot-building-strategy-component',
	standalone: true,
	template: `
		<div class="relative">
			<label default [for]="id()">
				{{ 'slotBuildingStrategy.title' | translate }}
			</label>
			<ng-select
				bindValue="id"
				[items]="options"
				[clearable]="false"
				[id]="id()"
				[formControl]="localControl"/>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'slotBuildingStrategy.hint' | translate }}
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective,
	],
	providers: [
		HumanizeDurationHelper,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectSlotBuildingStrategyComponent implements OnInit {

	// TODO: add opportunity to change slot interval in seconds via addTag method in ng-select

	public readonly id = input('');

	public readonly slotSettings = input(new SlotSettingsForm());

	public readonly localControl = new FormControl();
	public readonly options: {
		id: number;
		label: string;
		type: SlotBuildingStrategyEnum;
		value: number;
	}[] = [];

	public readonly translateService = inject(TranslateService);
	public readonly humanizeDurationHelper = inject(HumanizeDurationHelper);

	public ngOnInit() {
		this.humanizeDurationHelper.useLongFormat();
		this.initOptions();
		this.initLocalControlValue();
	}

	private initLocalControlValue(): void {
		const {id} = this.options.find(option => {
			const typeValid = option.type === this.slotSettings().controls.slotBuildingStrategy.value;
			const valueValid = option.value === this.slotSettings().controls.slotIntervalInSeconds.value;
			return typeValid && valueValid;
		}) ?? {};
		if (id) {
			this.localControl.setValue(id);
		}
		this.localControl.valueChanges.subscribe((id) => {
			const option = this.options.find(option => id === option.id);
			if (option) {
				this.slotSettings().controls.slotBuildingStrategy.setValue(option.type);
				this.slotSettings().controls.slotIntervalInSeconds.setValue(option.value);
			}
		});
	}

	private initOptions(): void {
		this.options.push({
			id: 1,
			label: this.translateService.instant('slotBuildingStrategy.options.accordingToAService'),
			type: SlotBuildingStrategyEnum.ByService,
			value: 0,
		});
		this.options.push({
			id: 2,
			label: this.humanizeDurationHelper.fromSeconds(SECONDS_TEN_MINUTES),
			type: SlotBuildingStrategyEnum.ByInterval,
			value: SECONDS_TEN_MINUTES,
		});
		this.options.push({
			id: 3,
			label: this.humanizeDurationHelper.fromSeconds(HALF_HOUR_IN_SECONDS),
			type: SlotBuildingStrategyEnum.ByInterval,
			value: HALF_HOUR_IN_SECONDS,
		});
		this.options.push({
			id: 4,
			label: this.humanizeDurationHelper.fromSeconds(ONE_HOUR_IN_SECONDS),
			type: SlotBuildingStrategyEnum.ByInterval,
			value: ONE_HOUR_IN_SECONDS,
		});
	}

}
