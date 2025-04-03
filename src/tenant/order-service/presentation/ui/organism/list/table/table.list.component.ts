import {Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {TableColumn, TableColumnProp} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {CurrencyPipe, NgClass} from "@angular/common";
import EOrderService from "@tenant/order-service/domain/entity/e.order-service";
import {IOrderService} from "@tenant/order-service/domain/interface/i.order-service.dto";
import {
	OrderServicePresentationActions
} from "@tenant/order-service/infrastructure/state/presentation/order-service.presentation.actions";
import {
	AutoRefreshButtonComponent
} from "@tenant/order-service/presentation/ui/molecule/button/auto-refresh/auto-refresh.button.component";
import {
	OrderServiceStatusIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/icon/order-service-status-icon.component";
import {OrderServiceStatusEnum} from "@tenant/order/domain/enum/order-service.status.enum";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";

@Component({
	selector: 'order-service-table-list-component',
	template: `
		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[currentVisible]="2"
			[columnList]="columnList()">


			<not-found-table-data-component
				class="block h-full"
				(clickListener)="openForm()"
				[showLinkToForm]="false"
				[linkLabel]="'order-service.button.create' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">
				<order-service-auto-refresh-component [resetPage]="true" [resetParams]="true"/>
			</not-found-table-data-component>

		</app-table-ngx-datatable-smart-component>

		<ng-template #priceCellTemplate let-row="row">
			<span class="truncate" [innerHTML]="durationVersionHtmlHelper.getPriceValue(row.serviceSnapshot)"></span>
		</ng-template>

		<ng-template #durationCellTemplate let-row="row">
			<span class="truncate" [innerHTML]="durationVersionHtmlHelper.getDurationValue(row.serviceSnapshot)"></span>
		</ng-template>

		<ng-template #stateCellTemplate let-row="row">
			<div activeStyle [state]="row.state">
			</div>
		</ng-template>

		<ng-template #specialistCellTemplate let-row="row">
			<div
				class="inline-flex items-center gap-2 text-sm font-medium text-[#11141A]">
				@if (row.orderAppointmentDetails.specialists[0].member.avatar.url) {
					<img class="w-[26px] h-[26px] rounded-full object-cover"
						 [src]="row.orderAppointmentDetails.specialists[0].member.avatar.url"
						 alt="Avatar">
				} @else {
					<div
						class="w-[26px] h-[26px] flex items-center justify-center bg-[#1F2937] text-[#FFFFFF] rounded-full text-xs font-semibold">
						{{ row.orderAppointmentDetails.specialists[0].member.firstName.charAt(0) }}
					</div>
				}
				{{ row.orderAppointmentDetails.specialists[0].member.firstName }}
			</div>
		</ng-template>
		<ng-template #statusCellTemplate let-row="row">

			<app-order-service-status-icon-component
				class="flex text-3xl"
				[ngClass]="{
						'text-red-600': row.status === orderServiceStatusEnum.cancelled,
						'text-blue-600': row.status === orderServiceStatusEnum.accepted,
						'text-green-600': row.status === orderServiceStatusEnum.done,
					}"
				[status]="row.status"/>

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
		AutoRefreshButtonComponent,
		OrderServiceStatusIconComponent,
		NgClass
	],
	providers: [
		DurationVersionHtmlHelper,
		CurrencyPipe,
	],
	host: {
		class: 'h-[calc(100dvh-80px)] md:h-screen block'
	},
})
export class TableListComponent extends TableComponent<EOrderService> {

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
	private readonly currencyPipe = inject(CurrencyPipe);

	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');
	public readonly statusCellTemplate = viewChild<TemplateRef<any>>('statusCellTemplate');
	public readonly durationCellTemplate = viewChild<TemplateRef<any>>('durationCellTemplate');
	public readonly priceCellTemplate = viewChild<TemplateRef<any>>('priceCellTemplate');
	public readonly specialistCellTemplate = viewChild<TemplateRef<any>>('specialistCellTemplate');

	public readonly useMoneyConvert = (obj: EOrderService, prop: TableColumnProp) => {
		return 1;
		// if (obj.amount <= 0) {
		// 	return '-';
		// }
		// return this.currencyPipe.transform(obj.amount, obj.currency, undefined, '1.2-2');
	};

	public readonly columns = signal<TableColumn<EOrderService>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.status'),
			prop: 'status',
			minWidth: 80,
			width: 80,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.specialist'),
			prop: 'specialist',
			minWidth: 160,
			width: 160,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.service'),
			prop: 'service',
			minWidth: 200,
			width: 200,
			sortable: true,
			$$valueGetter: (obj: IOrderService.EntityRaw, prop: TableColumnProp) => {
				const {0: languageVersion} = obj.serviceSnapshot.languageVersions;
				return languageVersion.title;
			},
		},
		{
			name: this.translateService.instant('keyword.capitalize.price'),
			prop: 'price',
			minWidth: 100,
			width: 100,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.duration'),
			prop: 'duration',
			minWidth: 160,
			width: 160,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.start'),
			prop: 'start',
			minWidth: 160,
			width: 160,
			sortable: true,
			$$valueGetter: (obj: IOrderService.EntityRaw, prop: TableColumnProp) => {
				const {start} = obj.orderAppointmentDetails;
				return this.datePipe.transform(start, 'short');
			}
		},
		{
			name: this.translateService.instant('keyword.capitalize.end'),
			prop: 'end',
			minWidth: 160,
			width: 160,
			sortable: true,
			$$valueGetter: (obj: IOrderService.EntityRaw, prop: TableColumnProp) => {
				const {end} = obj.orderAppointmentDetails;
				return this.datePipe.transform(end, 'short');
			}
		},
		{
			name: this.translateService.instant('keyword.capitalize.active'),
			prop: 'state',
			minWidth: 100,
			width: 100,
			sortable: true,
		},
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
	]);

	public readonly columnList = computed(() => {
		const columns = this.columns();

		const durationCellTemplate = this.durationCellTemplate();
		if (durationCellTemplate) {
			this.setCellTemplateRef(columns, 'duration', durationCellTemplate);
		}

		const priceCellTemplate = this.priceCellTemplate();
		if (priceCellTemplate) {
			this.setCellTemplateRef(columns, 'price', priceCellTemplate);
		}


		const stateCellTemplate = this.stateCellTemplate();
		if (stateCellTemplate) {
			this.setCellTemplateRef(columns, 'state', stateCellTemplate);
		}

		const statusCellTemplate = this.statusCellTemplate();
		if (statusCellTemplate) {
			this.setCellTemplateRef(columns, 'status', statusCellTemplate);
		}

		const specialistCellTemplate = this.specialistCellTemplate();
		if (specialistCellTemplate) {
			this.setCellTemplateRef(columns, 'specialist', specialistCellTemplate);
		}

		return columns;

	});

	public activate($event: ActivateEvent<IOrderService.EntityRaw>) {
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

	public override open(item: IOrderService.EntityRaw) {
		this.store.dispatch(new OrderServicePresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new OrderServicePresentationActions.OpenForm();
	}

	protected readonly orderServiceStatusEnum = OrderServiceStatusEnum;
}
