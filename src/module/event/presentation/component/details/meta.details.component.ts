import {Component, HostBinding, inject, input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IHistory, IHistoryV2} from "@utility/domain";
import {NgForOf, NgIf} from "@angular/common";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {DateTime} from "luxon";
import {
	ListFromToChronologyComponent
} from "@event/presentation/component/details/chronology/list.from-to.chronology.component";

@Component({
	selector: 'event-meta-details',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		NgForOf,
		NgIf,
		ListFromToChronologyComponent
	],
	template: `

		<div class="flex flex-col">

			<div class="font-bold">
				{{ 'event.keyword.capitalize.chronologyOfEventChanges' | translate }}
			</div>
			<div>
				{{ orderServiceDto()._id }}
			</div>

		</div>

<!--		<div class="flex flex-col">-->

<!--			<div>-->
<!--				{{ 'keyword.capitalize.lastUpdate' | translate }}:-->
<!--			</div>-->
<!--			<div>-->
<!--				{{ orderDro.updatedAt | dynamicDate }}-->
<!--			</div>-->

<!--		</div>-->

		<ol class="relative border-s border-gray-200 dark:border-gray-700 gap-4 flex flex-col">
			<li *ngFor="let chronology of chronologyList" class="ms-4">
				<div class="absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 border border-beeColor-400 bg-beeColor-300"></div>
				<time *ngIf="chronology.iso" class="mb-1 text-sm font-normal leading-none">
					{{ chronology.iso | dynamicDate }}
				</time>
				<div *ngIf="!chronology.iso" class="mb-1 text-sm font-normal leading-none">
					{{ 'keyword.capitalize.unknown' | translate }}
				</div>
				<h3 class="font-bold">
					{{ chronology.labelTranslateKey | translate }}
				</h3>
				<p class="" [innerHTML]="chronology.description"></p>
				<event-list-from-to-chronology
					*ngIf="chronology.valueWithFromToProperties"
					[valueWithFromToProperties]="chronology.valueWithFromToProperties"/>
			</li>
		</ol>

	`
})
export class MetaDetailsComponent implements OnChanges {

	public readonly orderDro = input.required<IOrderDto>();

	public readonly orderServiceDto = input.required<IOrderServiceDto>();

	@HostBinding()
	public class = 'flex flex-col gap-4 text-beeColor-500 p-4 text-sm';

	private readonly translateService = inject(TranslateService);

	public readonly chronologyList: {
		iso: string | null;
		labelTranslateKey: string;
		description: string;
		valueWithFromToProperties: string | null;
	}[] = [];

	public ngOnChanges(changes: SimpleChanges & { event: SimpleChange }) {

		this.prepareChronology();

	}

	public prepareChronology() {

		this.chronologyList.length = 0;

		this.chronologyList.push({
			iso: this.orderDro().createdAt,
			labelTranslateKey: 'keyword.capitalize.createdAt',
			description: DateTime.fromISO(this.orderDro().createdAt).toRelative({
				locale: this.translateService.currentLang
			}) ?? '',
			valueWithFromToProperties: null
		});

		const orderServiceDto = this.orderServiceDto();
  if (!orderServiceDto?.meta?.history?.length) {
			return;
		}

		orderServiceDto.meta.history.forEach((historyItem: IHistory | IHistoryV2) => {
			if ('_v' in historyItem) {
				switch (historyItem._v) {
					case 2:
						switch (historyItem.reason) {
							case 'update':
								this.chronologyList.push({
									iso: null,
									labelTranslateKey: 'keyword.capitalize.changes',
									description: '',
									valueWithFromToProperties: historyItem.value
								});
								return;
							case 'status':
								this.chronologyList.push({
									iso: historyItem.createdAt,
									labelTranslateKey: 'event.keyword.capitalize.statusChangedTo',
									description: this.translateService.instant('event.keyword.status.singular.' + historyItem.value),
									valueWithFromToProperties: null
								});
								return;
						}
						return;
				}
			}
			switch (historyItem.reason) {
				case 'update':
					this.chronologyList.push({
						iso: null,
						labelTranslateKey: 'keyword.capitalize.changes',
						description: '',
						valueWithFromToProperties: historyItem.value
					});
					return;
				case 'status':
					this.chronologyList.push({
						iso: null,
						labelTranslateKey: 'event.keyword.capitalize.statusChangedTo',
						description: this.translateService.instant('event.keyword.status.singular.' + historyItem.value),
						valueWithFromToProperties: null
					});
					return;
			}
		});

	}

}
