import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {DateTime} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {CardListComponent} from "@order/presentation/component/list/card/card.list.component";
import {CardItemOrderComponent} from "@order/presentation/component/list/card/item/card.item.order.component";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";

@Component({
	standalone: true,
	selector: 'order-list-of-card-collection-by-date-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		KeyValuePipe,
		TranslateModule,
		CardListComponent,
		AsyncPipe,
		CardItemOrderComponent,
		NgIf,
		TableStatePaginationComponent
	],
	template: `
		@for (dateItem of (items | keyvalue); track dateItem.key) {
			<div class="flex flex-col">
				<div class="ps-8 p-4 bg-beeColor-200 text-beeColor-600 sticky top-0">
					<div class="flex gap-4 items-center">
						<div class="text-xl font-bold flex-1">{{ getDateCorrectFormat(dateItem.key) }}
							, {{ getDayNameByDate(dateItem.key) }}
						</div>
						<div class="flex flex-wrap">
							<div>
								{{ todayOrAgo(dateItem.key) }}
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-col pb-8 pt-4">
					@for (timeItem of (dateItem.value | keyvalue); track timeItem.key) {
						<div>
							<div class="text-sm px-4 text-beeColor-600 flex justify-start gap-2 overflow-x-auto">
								<div class="font-bold bg-neutral-200 rounded-xl p-2 px-4">
									{{ timeItem.key }} ({{ toEventListType(timeItem?.value ?? [])?.length ?? 0 }})
								</div>
							</div>
							<div class="p-4 flex gap-4 overflow-x-auto">
								@for (item of toEventListType(timeItem.value); track item._id) {
									<app-card-item-order-component
										[showAction]="(showAction.state$ | async) ?? false"
										[showSelectedStatus]="(showSelectedStatus.state$ | async) ?? false"
										[selectedIds]="selectedIds"
										[item]="item"/>
								}
							</div>
						</div>
					}
				</div>
			</div>
		}
		<utility-table-state-pagination-component
			[mobileMode]="true"
			(page)="pageChange($event)"
			[tableState]="tableState"/>

	`
})
export class ListOfCardCollectionByDateComponent extends TableComponent<IOrderDto> {

	@Input({required: true})
	public items: {
		[key: string]: {
			[key: string]: IOrderDto[]
		}
	} = {};

	// public override readonly actions = OrderActions;
	public readonly showAction = new BooleanStreamState(true);
	public readonly showSelectedStatus = new BooleanStreamState(false);

	private readonly translateService = inject(TranslateService);

	@HostBinding()
	public class = 'flex flex-col';

	public toEventListType(list: unknown): IOrderDto[] {
		return list as IOrderDto[];
	}

	public getDayNameByDate(date: string) {
		return DateTime.fromISO(date).toFormat('EEE', {
			locale: this.translateService.currentLang,
		});
	}

	public sameYear(start: string | undefined): boolean {
		return start ? new Date(start).getFullYear() === new Date().getFullYear() : false;
	}

	public getDateCorrectFormat(date: string) {
		// If the same year, then we don't need to show the year
		if (this.sameYear(date)) {
			return DateTime.fromISO(date).toFormat('dd MMMM', {
				locale: this.translateService.currentLang,
			});
		}
		return DateTime.fromISO(date).toFormat('dd MMMM yyyy', {
			locale: this.translateService.currentLang,
		});
	}

	public todayOrAgo(date: string) {
		// Round to the nearest day
		const today = DateTime.local().startOf('day');
		const target = DateTime.fromISO(date).startOf('day');

		if (target.hasSame(today, 'day')) {
			return this.translateService.instant('keyword.capitalize.today');
		}

		if (target.hasSame(today.minus({days: 1}), 'day')) {
			return this.translateService.instant('keyword.capitalize.yesterday');
		}

		return target.toRelative({locale: this.translateService.currentLang});

	}

}
