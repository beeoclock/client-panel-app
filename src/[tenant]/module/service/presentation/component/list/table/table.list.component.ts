import {Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import EService from "@core/business-logic/service/entity/e.service";
import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {IService} from "@core/business-logic/service/interface/i.service";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";
import {toSignal} from "@angular/core/rxjs-interop";
import {LanguageCodeEnum} from "@core/shared/enum";

@Component({
	selector: 'service-table-list-component',
	template: `

		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[columnList]="columnList()"
			[rowHeight]="50"
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
				[linkLabel]="'keyword.capitalize.add-service' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">
				<service-auto-refresh-component [resetPage]="true" [resetParams]="true"/>
			</not-found-table-data-component>
		</app-table-ngx-datatable-smart-component>

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
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		TranslatePipe,
		ActiveStyleDirective,
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-65px)] block'
	},
})
export class TableListComponent extends TableComponent<EService> {

	public readonly availableLanguages = toSignal(this.store.select(BusinessProfileState.availableLanguages));

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');
	public readonly durationCellTemplate = viewChild<TemplateRef<any>>('durationCellTemplate');
	public readonly priceCellTemplate = viewChild<TemplateRef<any>>('priceCellTemplate');
	public readonly colorCellTemplate = viewChild<TemplateRef<any>>('colorCellTemplate');

	public readonly columns = signal<TableColumn<EService>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.color'),
			prop: 'color',
			minWidth: 50,
			width: 50,
			sortable: false
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
			name: this.translateService.instant('keyword.capitalize.status'),
			prop: 'state',
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

		const priceCellTemplate = this.priceCellTemplate();
		if (priceCellTemplate) {
			this.setCellTemplateRef(columns, 'price', priceCellTemplate);
		}

		const stateCellTemplate = this.stateCellTemplate();
		if (stateCellTemplate) {
			this.setCellTemplateRef(columns, 'state', stateCellTemplate);
		}

		const availableLanguages = this.availableLanguages();
		if (availableLanguages?.length) {
			this.setTitlesColumnsByAvailableLanguages(columns, availableLanguages);
		}

		return columns;

	});

	public activate($event: ActivateEvent<EService>) {
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

	public override open(item: IService.DTO) {
		this.store.dispatch(new ServiceActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new ServiceActions.OpenForm();
	}

	private setTitlesColumnsByAvailableLanguages(columns: TableColumn<EService>[], availableLanguages: LanguageCodeEnum[]) {

		const pushAfterIndex = columns.findIndex(({prop}) => prop === 'color') + 1;
		const name = this.translateService.instant('keyword.capitalize.title');

		if (availableLanguages.length < 2) {

			const language = availableLanguages[0];

			columns.splice(pushAfterIndex, 0, {
				name: name,
				prop: 'title',
				minWidth: 240,
				width: 240,
				sortable: false,
				$$valueGetter: (row: EService) => this.getTitleForLanguage(row, language)
			})

		} else {

			for (const language of availableLanguages) {

				columns.splice(pushAfterIndex, 0, {
					name: `${name} (${language})`,
					prop: `title-${language}`,
					minWidth: 240,
					width: 240,
					sortable: false,
					$$valueGetter: (row: EService) => this.getTitleForLanguage(row, language)
				})

			}

		}

	}

	public getTitleForLanguage(row: EService, languageCode: LanguageCodeEnum): string {

		let title = '-';
		const languageVersion = row.languageVersions.find(({language}) => language === languageCode);
		if (languageVersion) {
			title = languageVersion.title;
		}

		return title;

	}

}
