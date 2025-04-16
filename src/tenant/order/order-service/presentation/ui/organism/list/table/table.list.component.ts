import {Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {TableColumn, TableColumnProp} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
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
import {MemberListChipComponent} from "@shared/presentation/component/chip/member/list/member.list.chip";
import {ISpecialist} from "@src/tenant/service/domain/interface/i.specialist";
import {IMember} from "@tenant/member/member/domain";
import {MemberListService} from "@shared/presentation/component/chip/member/list/member.list.service";
import {CustomerChip} from "@shared/presentation/component/chip/customer/customer.chip";

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

		<ng-template #specialistCellTemplate let-row="row">
			@if (row.orderAppointmentDetails.specialists.length) {
				<member-list-chip [showRestMembers]="true" [members]="specialistsToMembers(row.orderAppointmentDetails.specialists)"/>
			}
		</ng-template>

		<ng-template #customerCellTemplate let-row="row">
			@for (attendee of row.orderAppointmentDetails.attendees; track attendee.customer._id) {

				<customer-chip [customer]="attendee.customer"/>

			}
		</ng-template>
		<ng-template #statusCellTemplate let-row="row">

			<app-order-service-status-icon-component
				class="flex items-center gap-1"
				iconClass="text-xl flex items-center"
				labelCLass="text-sm"
				[showLabel]="true"
				[ngClass]="{
						'text-red-600': row.status === orderServiceStatusEnum.cancelled,
						'text-red-700': row.status === orderServiceStatusEnum.deleted,
						'text-red-800': row.status === orderServiceStatusEnum.rejected,
						'text-neutral-600': row.status === orderServiceStatusEnum.accepted,
						'text-blue-600': row.status === orderServiceStatusEnum.requested,
						'text-green-600': row.status === orderServiceStatusEnum.done,
						'text-yellow-600': row.status === orderServiceStatusEnum.inProgress,
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
		AutoRefreshButtonComponent,
		OrderServiceStatusIconComponent,
		NgClass,
		MemberListChipComponent,
		CustomerChip
	],
	providers: [
		DurationVersionHtmlHelper,
		CurrencyPipe,
		MemberListService,
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-80px)] block'
	},
})
export class TableListComponent extends TableComponent<EOrderService> {

	public specialistsToMembers(specialists: ISpecialist[]): IMember.EntityRaw[] {
		return specialists.map(({member}) => member);
	}

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');
	public readonly statusCellTemplate = viewChild<TemplateRef<any>>('statusCellTemplate');
	public readonly durationCellTemplate = viewChild<TemplateRef<any>>('durationCellTemplate');
	public readonly priceCellTemplate = viewChild<TemplateRef<any>>('priceCellTemplate');
	public readonly specialistCellTemplate = viewChild<TemplateRef<any>>('specialistCellTemplate');
	public readonly customerCellTemplate = viewChild<TemplateRef<any>>('customerCellTemplate');

	public readonly columns = signal<TableColumn<EOrderService>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.status'),
			prop: 'status',
			minWidth: 120,
			width: 120,
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
