import {ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {HumanizeDurationHelper} from "@utility/helper/humanize/humanize-duration.helper";
import {SlotSettingsForm} from "@client/presentation/form/slot-settings.form";
import {SlotRetrievingStrategyEnum} from "@utility/domain/enum/slot-retrieving-strategy.enum";
import {NgIf} from "@angular/common";

@Component({
	selector: 'select-slot-retrieving-strategy-component',
	standalone: true,
	template: `
		<div class="relative">
			<label default [for]="id">
				{{ 'slotRetrievingStrategy.title' | translate }}
			</label>
			<ng-select
				bindLabel="label"
				bindValue="id"
				[items]="options"
				[clearable]="false"
				[id]="id"
				[formControl]="slotSettings.controls.slotRetrievingStrategy"/>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'slotRetrievingStrategy.hint' | translate }}
		</div>
		<div class="mt-2">
			<ng-container *ngIf="isIncludeRequested">
				{{ 'slotRetrievingStrategy.hists.byOption.IncludeRequested' | translate }}
				: <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{{ 'event.keyword.status.singular.requested' | translate }}</kbd>
				, <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{{ 'event.keyword.status.singular.booked' | translate }}</kbd>
			</ng-container>
			<ng-container *ngIf="isOnlyBooked">
				{{ 'slotRetrievingStrategy.hists.byOption.OnlyBooked' | translate }}
				: <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{{ 'event.keyword.status.singular.booked' | translate }}</kbd>
			</ng-container>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective,
		NgIf,
	],
	providers: [
		HumanizeDurationHelper,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectSlotRetrievingStrategyComponent implements OnInit {

	// TODO: add opportunity to change slot interval in seconds via addTag method in ng-select

	@Input()
	public id = '';

	@Input()
	public slotSettings = new SlotSettingsForm();

	public readonly options: {
		label: string;
		id: SlotRetrievingStrategyEnum;
	}[] = [];

	public readonly translateService = inject(TranslateService);
	public readonly humanizeDurationHelper = inject(HumanizeDurationHelper);

	public get isIncludeRequested(): boolean {
		return this.slotSettings.controls.slotRetrievingStrategy.value === SlotRetrievingStrategyEnum.IncludeRequested;
	}

	public get isOnlyBooked(): boolean {
		return this.slotSettings.controls.slotRetrievingStrategy.value === SlotRetrievingStrategyEnum.OnlyBooked;
	}

	public ngOnInit() {
		this.humanizeDurationHelper.useLongFormat();
		this.initOptions();
	}

	private initOptions(): void {
		this.options.push({
			label: this.translateService.instant('slotRetrievingStrategy.options.IncludeRequested'),
			id: SlotRetrievingStrategyEnum.IncludeRequested,
		});
		this.options.push({
			label: this.translateService.instant('slotRetrievingStrategy.options.OnlyBooked'),
			id: SlotRetrievingStrategyEnum.OnlyBooked,
		});
	}

}
