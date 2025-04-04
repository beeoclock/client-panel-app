import {ChangeDetectionStrategy, Component, inject, input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {HumanizeDurationHelper} from "@shared/helper/humanize/humanize-duration.helper";
import {SlotSettingsForm} from "@tenant/client/presentation/form/slot-settings.form";
import {SlotRetrievingStrategyEnum} from "@core/shared/enum/slot-retrieving-strategy.enum";

@Component({
	selector: 'select-slot-retrieving-strategy-component',
	standalone: true,
	template: `
		<div class="relative">
			<label default [for]="id()">
				{{ 'slotRetrievingStrategy.title' | translate }}
			</label>
			<ng-select
				bindLabel="label"
				bindValue="id"
				[items]="options"
				[clearable]="false"
				[id]="id()"
				[formControl]="slotSettings().controls.slotRetrievingStrategy"/>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'slotRetrievingStrategy.hint' | translate }}
		</div>
		<div class="mt-2">
			@if (isIncludeRequested) {

				{{ 'slotRetrievingStrategy.hists.byOption.IncludeRequested' | translate }}
				: <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{{ 'event.keyword.status.singular.requested' | translate }}</kbd>
				, <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{{ 'event.keyword.status.singular.confirmed' | translate }}</kbd>
			}
			@if (isOnlyBooked) {

				{{ 'slotRetrievingStrategy.hists.byOption.OnlyBooked' | translate }}
				: <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{{ 'event.keyword.status.singular.confirmed' | translate }}</kbd>
			}
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
export class SelectSlotRetrievingStrategyComponent implements OnInit {

	// TODO: add opportunity to change slot interval in seconds via addTag method in ng-select

	public readonly id = input('');

	public readonly slotSettings = input(new SlotSettingsForm());

	public readonly options: {
		label: string;
		id: SlotRetrievingStrategyEnum;
	}[] = [];

	public readonly translateService = inject(TranslateService);
	public readonly humanizeDurationHelper = inject(HumanizeDurationHelper);

	public get isIncludeRequested(): boolean {
		return this.slotSettings().controls.slotRetrievingStrategy.value === SlotRetrievingStrategyEnum.IncludeRequested;
	}

	public get isOnlyBooked(): boolean {
		return this.slotSettings().controls.slotRetrievingStrategy.value === SlotRetrievingStrategyEnum.OnlyBooked;
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
