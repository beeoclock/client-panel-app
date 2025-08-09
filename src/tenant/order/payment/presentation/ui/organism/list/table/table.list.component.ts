import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {TableColumn, TableColumnProp} from "@swimlane/ngx-datatable/lib/types/table-column.type";

import {TranslatePipe} from "@ngx-translate/core";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import {
	PaymentPresentationActions
} from "@tenant/order/payment/infrastructure/state/presentation/payment.presentation.actions";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";
import {
	AutoRefreshButtonComponent
} from "@tenant/order/payment/presentation/ui/molecule/button/auto-refresh/auto-refresh.button.component";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {CurrencyPipe} from "@angular/common";
import {
	PaymentStatusStyleDirective
} from "@shared/presentation/directives/payment-status-style/payment-status-style.directive";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {NoAvailable} from "@shared/presentation/component/no-available/no-available";
import {SynchronizationMolecule} from "@shared/presentation/component/synchronization/synchronization.molecule";

@Component({
	selector: 'payment-table-list-component',
	template: `
		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[currentVisible]="2"
			[columnList]="columnList()">


			<not-found-table-data-component
				class="block h-full"
				(clickListener)="openForm()"
				[showLinkToForm]="false"
				[label]="'keyword.capitalize.dataNotFound' | translate">
				<payment-auto-refresh-component [resetPage]="true" [resetParams]="true"/>
			</not-found-table-data-component>

		</app-table-ngx-datatable-smart-component>
		<ng-template #stateCellTemplate let-row="row">
			<div activeStyle [state]="row.state">
			</div>
		</ng-template>
		<ng-template #statusCellTemplate let-row="row">
			<div paymentStatusStyle [status]="row.status">
			</div>
		</ng-template>
		<ng-template #amountCellTemplate let-row="row">
			@if (row.amount <= 0) {
				{{ row.amount | currency: row.currency : undefined : '1.2-2' }}
			} @else {
				<no-available/>
			}
		</ng-template>
		<ng-template #payerCellTemplate let-row="row" let-value="value">
			@if (value === '-') {
				<no-available/>
			} @else {
				{{ value }}
			}
		</ng-template>
		<ng-template #idCellTemplate let-value="value">
			<div class="uppercase" [title]="value"><span class="text-neutral-400">...</span>{{ value.slice(-4) }}</div>
		</ng-template>
		<ng-template #syncedAtTemplate let-row="row">
			<synchronization-molecule [item]="row"/>
		</ng-template>
    `,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableNgxDatatableSmartComponent,
		TranslatePipe,
		NotFoundTableDataComponent,
		AutoRefreshButtonComponent,
		ActiveStyleDirective,
		PaymentStatusStyleDirective,
		NoAvailable,
		CurrencyPipe,
		SynchronizationMolecule
	],
	host: {
		class: 'h-[calc(100vh-210px)] md:h-[calc(100vh-80px)] block'
	},
})
export class TableListComponent extends TableComponent<EPayment> {

	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');
	public readonly statusCellTemplate = viewChild<TemplateRef<any>>('statusCellTemplate');
	public readonly amountCellTemplate = viewChild<TemplateRef<any>>('amountCellTemplate');
	public readonly payerCellTemplate = viewChild<TemplateRef<any>>('payerCellTemplate');
	public readonly idCellTemplate = viewChild<TemplateRef<any>>('idCellTemplate');
	public readonly syncedAtTemplate = viewChild<TemplateRef<any>>('syncedAtTemplate');

	public readonly columns = signal<TableColumn<EPayment>[]>([
		{
			name: '#',
			prop: '_id',
			minWidth: 80,
			width: 80,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.payer'),
			prop: 'payer',
			minWidth: 160,
			width: 160,
			sortable: false,
			$$valueGetter: (obj: EPayment, prop: TableColumnProp) => {
				return EPayment.fromRaw(obj).payerToString();
			}
		},
		{
			name: this.translateService.instant('keyword.capitalize.dateAndTime'),
			prop: 'paymentDate',
			minWidth: 160,
			width: 160,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.status'),
			prop: 'status',
			minWidth: 160,
			width: 160,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.paymentProviderType'),
			prop: 'providerType',
			minWidth: 160,
			width: 160,
			sortable: true,
			$$valueGetter: (obj: EPayment, prop: TableColumnProp) => {
				return this.translateService.instant(`payment.providerType.${obj.providerType}.label`);
			},
		},
		{
			name: this.translateService.instant('keyword.capitalize.currency'),
			prop: 'currency',
			minWidth: 100,
			width: 100,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.amount'),
			prop: 'amount',
			minWidth: 160,
			width: 160,
			sortable: true,
			// $$valueGetter: this.useMoneyConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.paymentMethod'),
			prop: 'method',
			minWidth: 160,
			width: 160,
			sortable: true,
			$$valueGetter: (obj: EPayment, prop: TableColumnProp) => {
				return this.translateService.instant(`payment.method.${obj.method}.label`);
			},
		},
		// {
		// 	name: this.translateService.instant('keyword.capitalize.active'),
		// 	prop: 'state',
		// 	minWidth: 100,
		// 	width: 100,
		// 	sortable: true,
		// },
		{
			name: this.translateService.instant('keyword.capitalize.createdAt'),
			prop: 'createdAt',
			minWidth: 200,
			width: 200,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.updatedAt'),
			prop: 'updatedAt',
			minWidth: 200,
			width: 200,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.synchronization'),
			prop: 'syncedAt',
			minWidth: 240,
			width: 240,
			sortable: false,
		},
	]);

	public readonly columnList = computed(() => {
		const columns = this.columns();

		const stateCellTemplate = this.stateCellTemplate();
		if (stateCellTemplate) {
			this.setCellTemplateRef(columns, 'state', stateCellTemplate);
		}

		const statusCellTemplate = this.statusCellTemplate();
		if (statusCellTemplate) {
			this.setCellTemplateRef(columns, 'status', statusCellTemplate);
		}

		const amountCellTemplate = this.amountCellTemplate();
		if (amountCellTemplate) {
			this.setCellTemplateRef(columns, 'amount', amountCellTemplate);
		}

		const payerCellTemplate = this.payerCellTemplate();
		if (payerCellTemplate) {
			this.setCellTemplateRef(columns, 'payer', payerCellTemplate);
		}

		const idCellTemplate = this.idCellTemplate();
		if (idCellTemplate) {
			this.setCellTemplateRef(columns, '_id', idCellTemplate);
		}

		const syncedAtTemplate = this.syncedAtTemplate();
		if (syncedAtTemplate) {
			this.setCellTemplateRef(columns, 'syncedAt', syncedAtTemplate);
		}

		return columns;

	});

	public activate($event: ActivateEvent<IPayment.EntityRaw>) {
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

	public override open(item: IPayment.EntityRaw) {
		this.store.dispatch(new PaymentPresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new PaymentPresentationActions.OpenForm();
	}

}
