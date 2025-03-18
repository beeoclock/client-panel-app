import {Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartComponent
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {CurrencyPipe, DatePipe} from "@angular/common";
import EService from "@core/business-logic/service/entity/e.service";
import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {IService} from "@core/business-logic/service/interface/i.service";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'service-table-list-component',
	template: `

		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[columnList]="columnList()"
			[filters]="filters()"
			[loadData]="this.loadData.bind(this)"
			[rowHeight]="50"
			[actionColumn]="{
				name: '',
				cellTemplate: actionCellTemplate,
				sortable: false,
				frozenRight: true,
				minWidth: 56,
				width: 56
			}"/>

		<ng-template #actionCellTemplate let-row="row">
			<service-row-action-button-component
				[item]="row"
				[id]="row._id"/>
		</ng-template>

		<ng-template #priceCellTemplate let-row="row">
			<span class="truncate" [innerHTML]="durationVersionHtmlHelper.getPriceValue(row)"></span>
		</ng-template>

		<ng-template #durationCellTemplate let-row="row">
			<span class="truncate" [innerHTML]="durationVersionHtmlHelper.getDurationValue(row)"></span>
		</ng-template>

		<ng-template #colorCellTemplate let-row="row">

			@if (row.presentation?.color) {


				<div class="h-10 w-10 rounded-full"
					 [style.background-color]="row.presentation?.color ?? ''"></div>

			} @else {


				<div class="h-10 w-10 rounded-full flex justify-center items-center bg-gray-100">
					❓
				</div>

			}
		</ng-template>

		<ng-template #titleCellTemplate let-row="row">

			{{ row.languageVersions[0].title }}

		</ng-template>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableNgxDatatableSmartComponent,
		RowActionButtonComponent,
	],
	providers: [
		DatePipe,
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-65px)] block'
	},
})
export class TableListComponent extends TableComponent<EService> {

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public readonly durationCellTemplate = viewChild<TemplateRef<any>>('durationCellTemplate');
	public readonly priceCellTemplate = viewChild<TemplateRef<any>>('priceCellTemplate');
	public readonly titleCellTemplate = viewChild<TemplateRef<any>>('titleCellTemplate');
	public readonly colorCellTemplate = viewChild<TemplateRef<any>>('colorCellTemplate');

	public readonly columns = signal<TableColumn<EService>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.title'),
			prop: 'title',
			minWidth: 200,
			width: 200,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.price'),
			prop: 'price',
			minWidth: 160,
			width: 160,
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
			name: this.translateService.instant('keyword.capitalize.order'),
			prop: 'order',
			minWidth: 160,
			width: 160,
			sortable: false,
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

		const durationCellTemplate = this.durationCellTemplate();
		if (durationCellTemplate) {
			this.setCellTemplateRef(columns, 'duration', durationCellTemplate);
		}

		const colorCellTemplate = this.colorCellTemplate();
		if (colorCellTemplate) {
			this.setCellTemplateRef(columns, 'color', colorCellTemplate);
		}

		const titleCellTemplate = this.titleCellTemplate();
		if (titleCellTemplate) {
			this.setCellTemplateRef(columns, 'title', titleCellTemplate);
		}

		const priceCellTemplate = this.priceCellTemplate();
		if (priceCellTemplate) {
			this.setCellTemplateRef(columns, 'price', priceCellTemplate);
		}

		return columns;

	});

	public loadData({page, pageSize, orderBy, orderDir, filters}: AsyncLoadDataFunctionParams) {

		return this.sharedUow.service.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
			...filters,
		});

	}

	public activate($event: ActivateEvent<EService>) {
		switch ($event.type) {
			case "checkbox":
				break;
			case "click":
				break;
			case "dblclick":
				this.open($event.row);
				break;
			case "keydown":
				break;
			case "mouseenter":
				break;
		}
	}

	public override open(item: IService.DTO) {
		this.store.dispatch(new ServiceActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new ServiceActions.OpenForm();
	}

}
