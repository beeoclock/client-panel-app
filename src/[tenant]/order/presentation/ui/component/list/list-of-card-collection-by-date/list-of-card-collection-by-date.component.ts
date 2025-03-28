import {ChangeDetectionStrategy, Component, HostBinding, inject, input, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {DateTime} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe} from "@angular/common";
import {
	CardItemOrderComponent
} from "@[tenant]/order/presentation/ui/component/list/card/item/card.item.order.component";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import EOrder from "@core/business-logic/order/entity/e.order";

@Component({
	standalone: true,
	selector: 'order-list-of-card-collection-by-date-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		AsyncPipe,
		CardItemOrderComponent,
		TableStatePaginationComponent
	],
	template: `
		@for (dateItem of itemsWithDate(); track dateItem[0]) {
			<div class="flex flex-col">
				<div class="ps-8 p-4 bg-beeColor-200 text-beeColor-600 sticky top-0">
					<div class="flex gap-4 items-center">
						<div class="text-xl font-bold flex-1">{{ getDateCorrectFormat(dateItem[0]) }}
							, {{ getDayNameByDate(dateItem[0]) }}
						</div>
						<div class="flex flex-wrap">
							<div>
								{{ todayOrAgo(dateItem[0]) }}
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-wrap p-4 pb-8 pt-4 gap-4">
					@for (item of dateItem[1]; track item._id) {
						<app-card-item-order-component
							[showAction]="(showAction.state$ | async) ?? false"
							[showSelectedStatus]="(showSelectedStatus.state$ | async) ?? false"
							[selectedIds]="selectedIds"
							[orderDto]="item"/>
					}
				</div>
			</div>
		}
		<utility-table-state-pagination-component
			[mobileMode]="true"
			(page)="pageChange($event)"
			[tableState]="tableState()"/>

	`
})
export class ListOfCardCollectionByDateComponent extends TableComponent<EOrder> {

	public readonly itemsWithDate = input.required<[
		string,
		IOrder.DTO[]
	][]>();

	public readonly showAction = new BooleanStreamState(true);
	public readonly showSelectedStatus = new BooleanStreamState(false);

	private readonly translateService = inject(TranslateService);

	@HostBinding()
	public class = 'flex flex-col';

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
