import {Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import EService from "@tenant/service/domain/entity/e.service";
import {
	RowActionButtonComponent
} from "@tenant/service/presentation/ui/component/row-action-button/row-action-button.component";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import {ServiceActions} from "@tenant/service/infrastructure/state/service/service.actions";
import {IService} from "@tenant/service/domain/interface/i.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	AutoRefreshButtonComponent
} from "@tenant/service/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {toSignal} from "@angular/core/rxjs-interop";
import {LanguageCodeEnum} from "@core/shared/enum";
import {NoAvailable} from "@shared/presentation/component/no-available/no-available";
import {SynchronizationMolecule} from "@shared/presentation/component/synchronization/synchronization.molecule";
import {ActivateEvent, TableColumn, TableColumnProp} from "@swimlane/ngx-datatable";
import {IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";

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
				<service-auto-refresh-component/>
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

		<ng-template #bannersCellTemplate let-row="row">

			<div class="flex gap-1 items-center">
				@if (row.presentation?.banners?.length) {
					@let banner = row.presentation?.banners[0] ;
					<img [src]="banner.url" alt="" class="rounded-lg size-10">
					@if (row.presentation?.banners.length > 1) {
						<div class="rounded-lg bg-neutral-200 text-neutral-500 flex items-center justify-center size-10">
							+{{ row.presentation?.banners.length - 1 }}
						</div>
					}
				} @else {
					<no-available/>
				}
			</div>

		</ng-template>
		<ng-template #stateCellTemplate let-row="row">
			<div activeStyle [state]="row.state">
			</div>
		</ng-template>
		<ng-template #syncedAtTemplate let-row="row">
			<synchronization-molecule [item]="row"/>
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
		NoAvailable,
		SynchronizationMolecule,
	],
	host: {
		class: 'h-[calc(100vh-210px)] md:h-[calc(100vh-80px)] block'
	},
})
export class TableListComponent extends TableComponent<EService> {

	public readonly availableLanguages = toSignal(this.store.select(BusinessProfileState.availableLanguages));

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');
	public readonly durationCellTemplate = viewChild<TemplateRef<any>>('durationCellTemplate');
	public readonly priceCellTemplate = viewChild<TemplateRef<any>>('priceCellTemplate');
	public readonly bannersCellTemplate = viewChild<TemplateRef<any>>('bannersCellTemplate');
	public readonly colorCellTemplate = viewChild<TemplateRef<any>>('colorCellTemplate');
	public readonly syncedAtTemplate = viewChild<TemplateRef<any>>('syncedAtTemplate');

	public readonly columns = signal<(TableColumn<EService> & {
		$$valueGetter?: (obj: IBaseEntityRaw<string>, prop: TableColumnProp) => string | null
	})[]>([
		{
			name: this.translateService.instant('keyword.capitalize.color'),
			prop: 'color',
			minWidth: 60,
			width: 60,
			sortable: false
		},
		{
			name: this.translateService.instant('keyword.capitalize.banners'),
			prop: 'banners',
			minWidth: 120,
			width: 120,
			sortable: false,
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

		const durationCellTemplate = this.durationCellTemplate();
		if (durationCellTemplate) {
			this.setCellTemplateRef(columns, 'duration', durationCellTemplate);
		}

		const priceCellTemplate = this.priceCellTemplate();
		if (priceCellTemplate) {
			this.setCellTemplateRef(columns, 'price', priceCellTemplate);
		}

		const colorCellTemplate = this.colorCellTemplate();
		if (colorCellTemplate) {
			this.setCellTemplateRef(columns, 'color', colorCellTemplate);
		}
		const stateCellTemplate = this.stateCellTemplate();
		if (stateCellTemplate) {
			this.setCellTemplateRef(columns, 'state', stateCellTemplate);
		}

		const availableLanguages = this.availableLanguages();
		if (availableLanguages?.length) {
			this.setTitlesColumnsByAvailableLanguages(columns, availableLanguages);
		}

		const bannersCellTemplate = this.bannersCellTemplate();
		if (bannersCellTemplate) {
			this.setCellTemplateRef(columns, 'banners', bannersCellTemplate);
		}

		const syncedAtTemplate = this.syncedAtTemplate();
		if (syncedAtTemplate) {
			this.setCellTemplateRef(columns, 'syncedAt', syncedAtTemplate);
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

	private setTitlesColumnsByAvailableLanguages(columns: (TableColumn<EService> & {
		$$valueGetter?: any
	})[], availableLanguages: LanguageCodeEnum[]) {

		const pushAfterIndex = columns.findIndex(({prop}) => prop === 'banners') + 1;
		const name = this.translateService.instant('keyword.capitalize.title');

		if (availableLanguages.length < 2) {

			const language = availableLanguages[0];

			columns.splice(pushAfterIndex, 0, {
				name: name,
				prop: 'title',
				minWidth: 280,
				width: 280,
				sortable: false,
				$$valueGetter: (row: EService) => this.getTitleForLanguage(row, language)
			})

		} else {

			for (const language of availableLanguages) {

				columns.splice(pushAfterIndex, 0, {
					name: `${name} (${language})`,
					prop: `title-${language}`,
					minWidth: 280,
					width: 280,
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
