import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {ICustomer} from "@tenant/customer/domain";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {
	RowActionButtonComponent
} from "@tenant/customer/presentation/ui/component/row-action-button/row-action-button.component";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {
	AutoRefreshButtonComponent
} from "@tenant/customer/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";

@Component({
	selector: 'customer-table-list-component',
	template: `
		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[columnList]="columnList()"
			[actionColumn]="{
				name: '',
				cellTemplate: actionCellTemplate,
				sortable: false,
				frozenRight: true,
				minWidth: 56,
				width: 56
			}">

			<not-found-table-data-component
				class="block h-full"
				(clickListener)="openForm()"
				[showLinkToForm]="true"
				[linkLabel]="'customer.button.create' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">

				<customer-auto-refresh-component/>

			</not-found-table-data-component>

		</app-table-ngx-datatable-smart-component>
		<ng-template #actionCellTemplate let-row="row">
			<customer-row-action-button-component
				[item]="row"
				[id]="row._id"/>
		</ng-template>
		<ng-template #stateCellTemplate let-row="row">
			<div activeStyle [state]="row.state">
			</div>
		</ng-template>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableNgxDatatableSmartComponent,
		RowActionButtonComponent,
		ActiveStyleDirective,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		TranslatePipe,
		AutoRefreshButtonComponent
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-65px)] block'
	},
})
export class TableListComponent extends TableComponent<ECustomer> {
	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');

	public readonly columns = signal<TableColumn<ECustomer>[]>([
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

	public activate($event: ActivateEvent<ICustomer.EntityRaw>) {
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

	public override open(item: ICustomer.EntityRaw) {
		this.store.dispatch(new CustomerPresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new CustomerPresentationActions.OpenForm();
	}

}
