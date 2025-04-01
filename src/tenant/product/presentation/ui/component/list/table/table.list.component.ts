import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from '@angular/core';
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	TableNgxDatatableSmartComponent
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {TranslatePipe} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import EProduct from "@tenant/product/domain/entity/e.product";
import {IProduct} from "@tenant/product/domain";
import {
	RowActionButtonComponent
} from "@tenant/product/presentation/ui/component/row-action-button/row-action-button.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/product/presentation/ui/component/auto-refresh/auto-refresh.button.component";

@Component({
	selector: 'product-table-list-component',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ActiveStyleDirective,
		NotFoundTableDataComponent,
		TableNgxDatatableSmartComponent,
		TranslatePipe,
		RowActionButtonComponent,
		AutoRefreshButtonComponent
	],
})
export class TableListComponent extends TableComponent<EProduct> {
	// public readonly tableConfiguration = {
	// 	columns: {
	// 		sku: {
	// 			style: {
	// 				minWidth: '200px',
	// 				maxWidth: '200px',
	// 			}
	// 		},
	// 		productName: {
	// 			style: {
	// 				minWidth: '250px',
	// 				flexGrow: 1
	// 			},
	// 		},
	// 		price: {
	// 			style: {
	// 				minWidth: '100px',
	// 			},
	// 		},
	// 		tags: {
	// 			style: {
	// 				minWidth: '200px',
	// 				maxWidth: '200px',
	// 			},
	// 		},
	// 		order: {
	// 			style: {
	// 				minWidth: '100px'
	// 			},
	// 		},
	// 		active: {
	// 			style: {
	// 				minWidth: '150px'
	// 			},
	// 		},
	// 		createdAt: {
	// 			style: {
	// 				minWidth: '200px',
	// 			},
	// 		},
	// 		updatedAt: {
	// 			style: {
	// 				minWidth: '200px',
	// 			},
	// 		},
	// 		action: {
	// 			classList: ['bg-white', 'justify-center'],
	// 			style: {
	// 				minWidth: '75px',
	// 			},
	// 		},
	// 	},
	// };
	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');

	public readonly columns = signal<TableColumn<EProduct>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.firstName'),
			prop: 'firstName',
			minWidth: 140,
			width: 140,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.lastName'),
			prop: 'lastName',
			minWidth: 140,
			width: 140,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.email'),
			prop: 'email',
			minWidth: 300,
			width: 300,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.phone'),
			prop: 'phone',
			minWidth: 160,
			width: 160,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.note'),
			prop: 'note',
			minWidth: 160,
			width: 160,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.active'),
			prop: 'state',
			minWidth: 160,
			width: 160,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.createdAt'),
			prop: 'createdAt',
			minWidth: 240,
			width: 240,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.updatedAt'),
			prop: 'updatedAt',
			minWidth: 240,
			width: 240,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
	]);

	public readonly columnList = computed(() => {
		const columns = this.columns();

		const stateCellTemplate = this.stateCellTemplate();
		if (stateCellTemplate) {
			this.setCellTemplateRef(columns, 'state', stateCellTemplate);
		}

		return columns;

	});

	public activate($event: ActivateEvent<IProduct.EntityRaw>) {
		switch ($event.type) {
			case "checkbox":
				break;
			case "click":
				this.open($event.row);
				break;
			case "dblclick":
				break;
			case "keydown":
				break;
			case "mouseenter":
				break;
		}
	}

	public override open(item: IProduct.EntityRaw) {
		// this.store.dispatch(new CustomerPresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new CustomerPresentationActions.OpenForm();
	}
}
