import {Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {TableColumn, TableColumnProp} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {CurrencyPipe, NgClass} from "@angular/common";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {
	OrderServicePresentationActions
} from "@tenant/order/order-service/infrastructure/state/presentation/order-service.presentation.actions";
import {
	AutoRefreshButtonComponent
} from "@tenant/order/order-service/presentation/ui/molecule/button/auto-refresh/auto-refresh.button.component";
import {
	OrderServiceStatusIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/icon/order-service-status-icon.component";
import {OrderServiceStatusEnum} from "@tenant/order/order/domain/enum/order-service.status.enum";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";

@Component({
	selector: 'order-service-table-list-component',
	template: `
		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[currentVisible]="2"
			[columnList]="columnList()">


			<not-found-table-data-component
				class="block h-full"
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
				class="flex items-center gap-2 text-sm font-medium text-[#11141A] h-full">
				@for (specialist of row.orderAppointmentDetails.specialists; track specialist.member._id) {
					@if (specialist?.member?.avatar?.url?.length) {
						<img class="w-9 h-9 rounded-full object-cover"
							 [src]="specialist.member.avatar.url"
							 alt="Avatar">
					} @else {
						<div
							class="w-9 h-9 flex items-center justify-center bg-[#1F2937] text-[#FFFFFF] rounded-full text-xs font-semibold">
							{{ specialist?.member?.firstName?.charAt(0) }}
						</div>
					}
					{{ specialist.member.firstName }}
				}
			</div>
		</ng-template>

		<ng-template #customerCellTemplate let-row="row">
			<div
				class="inline-flex items-center gap-2 text-sm font-medium text-[#11141A]">

				@for (attendee of row.orderAppointmentDetails.attendees; track attendee.customer._id) {

					@let customerType = attendee.customer.customerType;

					@if (customerType === customerTypeEnum.anonymous) {

						<div
							class="rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-neutral-700">
							<i class="bi bi-person"></i>
						</div>

					} @else {

						@let firstName = attendee.customer.firstName ?? '';
						@let lastName = attendee.customer.lastName ?? '';

						<div
							class="rounded-full uppercase bg-gradient-to-r from-amber-100 to-amber-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-yellow-700">
							{{ firstName[0] }}{{ lastName[0] }}
						</div>

					}

					<div class="text-slate-900 text-sm font-normal">
						@switch (customerType) {
							@case (customerTypeEnum.unregistered) {
								{{ attendee.customer.firstName }}
							}
							@case (customerTypeEnum.regular) {
								{{ attendee.customer.firstName }} 📇
							}
							@case (customerTypeEnum.new) {
								{{ attendee.customer.firstName }} 🆕
							}
							@case (customerTypeEnum.anonymous) {
								{{ 'keyword.capitalize.anonymous' | translate }}
							}
						}
					</div>

				}

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
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-80px)] block'
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
	public readonly customerCellTemplate = viewChild<TemplateRef<any>>('customerCellTemplate');

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
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.customer'),
			prop: 'customer',
			minWidth: 160,
			width: 160,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.service'),
			prop: 'service',
			minWidth: 200,
			width: 200,
			sortable: false,
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
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.duration'),
			prop: 'duration',
			minWidth: 160,
			width: 160,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.start'),
			prop: 'orderAppointmentDetails.start',
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
			prop: 'orderAppointmentDetails.end',
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

		const customerCellTemplate = this.customerCellTemplate();
		if (customerCellTemplate) {
			this.setCellTemplateRef(columns, 'customer', customerCellTemplate);
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

	protected readonly orderServiceStatusEnum = OrderServiceStatusEnum;
	protected readonly customerTypeEnum = CustomerTypeEnum;
}
