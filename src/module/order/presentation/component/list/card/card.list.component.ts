import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@order/presentation/component/row-action-button/row-action-button.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {CardItemOrderComponent} from "@order/presentation/component/list/card/item/card.item.order.component";

@Component({
	selector: 'app-order-card-list-component',
	template: `
		<div class="flex flex-col items-center justify-center gap-4 my-4" [class.h-[calc(100vh-134px)]]="!tableState.items.length">
			<app-card-item-order-component
				*ngFor="let item of tableState.items; trackBy: trackById"
				[showAction]="(tableService.showAction.state$ | async) ?? false"
				[showSelectedStatus]="(tableService.showSelectedStatus.state$ | async) ?? false"
				[selectedIds]="selectedIds"
				[item]="item" />
		</div>
		<utility-table-state-pagination-component
			[mobileMode]="true"
			(page)="pageChange($event)"
			[tableState]="tableState"/>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		RouterLink,
		ActiveStyleDirective,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		EventStatusStyleDirective,
		CurrencyPipe,
		HumanizeDurationPipe,
		CardComponent,
		NgIf,
		NoDataPipe,
		RowActionButtonComponent,
		AsyncPipe,
		CardItemOrderComponent
	]
})
export class CardListComponent extends TableComponent<IOrderDto> {

}
