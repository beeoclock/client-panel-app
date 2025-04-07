import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	AutoRefreshButtonComponent
} from "@tenant/expense/expense/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";
import {IExpense} from "@tenant/expense/expense/domain";
import {
	ExpensePresentationActions
} from "@tenant/expense/expense/infrastructure/state/presentation/expense.presentation.actions";
import {
	RowActionButtonComponent
} from "@tenant/expense/expense/presentation/ui/component/row-action-button/row-action-button.component";

@Component({
	selector: 'expense-table-list-component',
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
				[linkLabel]="'expense.button.create' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">

				<expense-auto-refresh-component/>

			</not-found-table-data-component>

		</app-table-ngx-datatable-smart-component>
		<ng-template #actionCellTemplate let-row="row">
			<expense-row-action-button-component
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
		ActiveStyleDirective,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		TranslatePipe,
		AutoRefreshButtonComponent,
		RowActionButtonComponent
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-65px)] block'
	},
})
export class TableListComponent extends TableComponent<EExpense> {
	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');

	public readonly columns = signal<TableColumn<EExpense>[]>([
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

	public activate($event: ActivateEvent<IExpense.EntityRaw>) {
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

	public override open(item: IExpense.EntityRaw) {
		this.store.dispatch(new ExpensePresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new ExpensePresentationActions.OpenForm();
	}

}
