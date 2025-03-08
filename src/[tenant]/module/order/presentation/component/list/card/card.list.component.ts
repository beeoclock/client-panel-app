import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardItemOrderComponent} from "@order/presentation/component/list/card/item/card.item.order.component";
import EOrder from "@core/business-logic/order/entity/e.order";

@Component({
	selector: 'app-order-card-list-component',
	template: `
		<div class="flex flex-col items-center justify-center gap-4 my-4"
			 [class.h-[calc(100vh-134px)]]="!tableState().items.length">
			@for (item of tableState().items; track item._id) {
				<app-card-item-order-component
					[showAction]="(tableService.showAction.state$ | async) ?? false"
					[showSelectedStatus]="(tableService.showSelectedStatus.state$ | async) ?? false"
					[selectedIds]="selectedIds"
					[orderDto]="item"/>
			}
		</div>
		<utility-table-state-pagination-component
			[mobileMode]="true"
			(page)="pageChange($event)"
			[tableState]="tableState()"/>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		TranslateModule,
		AsyncPipe,
		CardItemOrderComponent
	]
})
export class CardListComponent extends TableComponent<EOrder> {

}
