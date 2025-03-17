// import {Component, inject, input, ViewEncapsulation} from "@angular/core";
// import {CurrencyPipe, DatePipe} from "@angular/common";
// import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
// import {
// 	TableStatePaginationComponent
// } from "@utility/presentation/component/pagination/table-state-pagination.component";
// import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
// import {TranslateModule} from "@ngx-translate/core";
// import {TableComponent} from "@utility/table.component";
// import {ILanguageVersion} from "@core/business-logic/service";
// import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
// import {LanguageCodeEnum} from "@core/shared/enum";
// import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
// import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
// import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
// import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
// import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
// import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
// import {ITableState} from "@utility/domain/table.state";
// import {IService} from "@core/business-logic/service/interface/i.service";
// import EService from "@core/business-logic/service/entity/e.service";
//
// @Component({
// 	selector: 'service-table-list-component',
// 	templateUrl: './table.list.component.html',
// 	standalone: true,
// 	encapsulation: ViewEncapsulation.None,
// 	imports: [
// 		ActiveStyleDirective,
// 		TableStatePaginationComponent,
// 		SortIndicatorComponent,
// 		TranslateModule,
// 		BodyTableFlexDirective,
// 		ColumnTableFlexDirective,
// 		RowTableFlexDirective,
// 		TableTableFlexDirective,
// 		RowActionButtonComponent,
// 		DatePipe,
// 	],
// 	providers: [
// 		CurrencyPipe,
// 		DurationVersionHtmlHelper,
// 	]
// })
// export class TableListComponent extends TableComponent<EService> {
//
// 	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
// 	public override readonly tableState = input.required<ITableState<EService>>();
//
// 	public get currentLanguageCode(): LanguageCodeEnum {
// 		return this.translateService.getDefaultLang() as LanguageCodeEnum;
// 	}
//
// 	public getFirstLanguageVersion(languageVersions: ILanguageVersion[] = []): ILanguageVersion {
// 		const firstOption = languageVersions.find(({language}) => language === this.currentLanguageCode);
// 		return firstOption ?? languageVersions[0];
// 	}
//
// 	public readonly tableConfiguration = {
// 		columns: {
// 			title: {
// 				style: {
// 					minWidth: '400px',
// 					flexGrow: 1,
// 				},
// 			},
// 			active: {
// 				style: {
// 					minWidth: '120px',
// 				},
// 			},
// 			price: {
// 				style: {
// 					minWidth: '150px',
// 				},
// 			},
// 			order: {
// 				style: {
// 					minWidth: '126px',
// 				},
// 			},
// 			duration: {
// 				style: {
// 					minWidth: '150px',
// 				},
// 			},
// 			createdAt: {
// 				style: {
// 					minWidth: '180px',
// 				},
// 			},
// 			updatedAt: {
// 				style: {
// 					minWidth: '180px',
// 				},
// 			},
// 			action: {
// 				classList: ['bg-white', 'justify-center'],
// 				style: {
// 					minWidth: '75px',
// 				},
// 			},
// 		},
// 	}
//
// 	public override open(item: IService.DTO) {
// 		this.store.dispatch(new ServiceActions.OpenDetails(item));
// 	}
// //
// }


import {Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {CurrencyPipe, DatePipe} from "@angular/common";
import EService from "@core/business-logic/service/entity/e.service";
import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {IService} from "@core/business-logic/service/interface/i.service";
import {LanguageCodeEnum} from "@core/shared/enum";

@Component({
	selector: 'service-table-list-component',
	template: `
		<app-table-ngx-datatable-smart-component
			[columnList]="columnList()"
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
		RowActionButtonComponent
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

	public get currentLanguageCode(): LanguageCodeEnum {
		return this.translateService.getDefaultLang() as LanguageCodeEnum;
	}

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

	public loadData(page: number, pageSize: number, orderBy: string, orderDir: string) {


		return this.sharedUow.service.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
		});

	}

	public override open(item: IService.DTO) {
		this.store.dispatch(new ServiceActions.OpenDetails(item));
	}

}
