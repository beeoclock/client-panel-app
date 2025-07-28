import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {BalanceActionTypeEnum, IBalance} from "@tenant/balance/domain";
import {
	BalancePresentationActions
} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.actions";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {CurrencyPipe} from "@angular/common";
import {
	AutoRefreshButtonComponent
} from "@tenant/balance/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";

@Component({
	selector: 'balance-table-list-component',
	template: `
		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[columnList]="columnList()">

			<not-found-table-data-component
				class="block h-full"
				(clickListener)="openForm()"
				[showLinkToForm]="true"
				[linkLabel]="'balance.button.create' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">

				<balance-auto-refresh-component/>

			</not-found-table-data-component>

		</app-table-ngx-datatable-smart-component>

		<ng-template #actionTypeCellTemplate let-row="row">
			@switch (row.action.type) {
				@case (balanceActionTypeEnum.income) {
					<div class="rounded-full flex justify-center items-center w-8 h-8 min-w-8 min-h-8 bg-green-100 text-green-500 p-1">
						<i class="bi bi-arrow-down-left"></i>
					</div>
				}
				@case (balanceActionTypeEnum.outcome) {
					<div class="rounded-full flex justify-center items-center w-8 h-8 min-w-8 min-h-8 bg-red-100 text-red-500 p-1">
						<i class="bi bi-arrow-up-right"></i>
					</div>
				}
			}
		</ng-template>

		<ng-template #actionAmountCellTemplate let-row="row">
			{{ row.action.amount | currency: row.action.currency : 'symbol-narrow' }}
		</ng-template>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableNgxDatatableSmartComponent,
		NotFoundTableDataComponent,
		TranslatePipe,
		CurrencyPipe,
		AutoRefreshButtonComponent,
	],
	host: {
		class: 'h-[calc(100vh-210px)] md:h-[calc(100vh-65px)] block'
	},
})
export class TableListComponent extends TableComponent<EBalance> {
	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');
	public readonly actionTypeCellTemplate = viewChild<TemplateRef<any>>('actionTypeCellTemplate');
	public readonly actionAmountCellTemplate = viewChild<TemplateRef<any>>('actionAmountCellTemplate');

	public readonly balanceActionTypeEnum = BalanceActionTypeEnum;

	public readonly columns = signal<TableColumn<EBalance>[]>([
		{
			name: this.translateService.instant('balance.field.action.type.label'),
			prop: 'action.type',
			minWidth: 80,
			width: 80,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.amount'),
			prop: 'action.amount',
			minWidth: 240,
			width: 240,
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
		// {
		// 	name: this.translateService.instant('keyword.capitalize.updatedAt'),
		// 	prop: 'updatedAt',
		// 	minWidth: 240,
		// 	width: 240,
		// 	sortable: true,
		// 	$$valueGetter: this.anyDateConvert,
		// },
	]);

	public readonly columnList = computed(() => {
		const columns = this.columns();


		const actionTypeCellTemplate = this.actionTypeCellTemplate();
		if (actionTypeCellTemplate) {
			this.setCellTemplateRef(columns, 'action.type', actionTypeCellTemplate);
		}

		const actionAmountCellTemplate = this.actionAmountCellTemplate();
		if (actionAmountCellTemplate) {
			this.setCellTemplateRef(columns, 'action.amount', actionAmountCellTemplate);
		}

		return columns;

	});

	public activate($event: ActivateEvent<IBalance.EntityRaw>) {
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

	public override open(item: IBalance.EntityRaw) {
		this.store.dispatch(new BalancePresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new BalancePresentationActions.OpenForm();
	}

}
