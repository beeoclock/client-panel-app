import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ActiveStyleDirective } from '@utility/presentation/directives/active-style/active-style.directive';
import { TableStatePaginationComponent } from '@utility/presentation/component/pagination/table-state-pagination.component';
import { DynamicDatePipe } from '@utility/presentation/pipes/dynamic-date/dynamic-date.pipe';
import { SortIndicatorComponent } from '@utility/presentation/component/pagination/sort.indicator.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent } from '@utility/table.component';
import { BodyTableFlexDirective } from '@utility/presentation/directives/talbe/flex/body.table.flex.directive';
import { ColumnTableFlexDirective } from '@utility/presentation/directives/talbe/flex/column.table.flex.directive';
import { RowTableFlexDirective } from '@utility/presentation/directives/talbe/flex/row.table.flex.directive';
import { TableTableFlexDirective } from '@utility/presentation/directives/talbe/flex/table.table.flex.directive';
import { NoDataPipe } from '@utility/presentation/pipes/no-data.pipe';
import { IProduct } from '@product/domain';
import { CurrencyPipe, NgFor } from '@angular/common';
import { RowActionButtonComponent } from '@product/presentation/component/row-action-button/row-action-button.component';
import { IonChip, IonLabel } from '@ionic/angular/standalone';
import * as Product from "@product/domain";
import { ProductActions } from '@src/module/product/state/product/product.actions';

@Component({
	selector: 'product-table-list-component',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ActiveStyleDirective,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowTableFlexDirective,
		TableTableFlexDirective,
		NoDataPipe,
		CurrencyPipe,
		RowActionButtonComponent,
		IonChip,
		IonLabel,
		NgFor,
	],
})
export class TableListComponent extends TableComponent<IProduct> {
	public readonly tableConfiguration = {
		columns: {
			sku: {
				style: {
					minWidth: '150px'
				},
			},
			price: {
				style: {
					minWidth: '100px',
					maxWidth: '150px',
				},
			},
			tags: {
				style: {
					minWidth: '150px',
					flexGrow: 1,
				},
			},
			active: {
				style: {
					minWidth: '150px'
				},
			},
			createdAt: {
				style: {
					minWidth: '200px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '200px',
				},
			},
			action: {
				classList: ['bg-white', 'justify-center'],
				style: {
					minWidth: '75px',
				},
			},
		},
	};

	public override open(item: Product.IProduct) {
		this.store.dispatch(new ProductActions.OpenDetails(item));
	}
}
