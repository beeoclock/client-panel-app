import {Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation} from '@angular/core';
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/ui/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import EProduct from "@tenant/product/product/domain/entity/e.product";
import {IProduct} from "@tenant/product/product/domain";
import {
	RowActionButtonComponent
} from "@tenant/product/product/presentation/ui/component/row-action-button/row-action-button.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/product/product/presentation/ui/component/auto-refresh/auto-refresh.button.component";
import {
	ProductPresentationActions
} from "@tenant/product/product/infrastructure/state/presentation/product.presentation.actions";
import {LanguageCodeEnum} from "@core/shared/enum";
import {toSignal} from "@angular/core/rxjs-interop";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {CurrencyPipe} from "@angular/common";
import {NoAvailable} from "@shared/presentation/ui/component/no-available/no-available";
import {SynchronizationMolecule} from "@shared/presentation/ui/component/synchronization/synchronization.molecule";
import {ActivateEvent, TableColumn} from "@swimlane/ngx-datatable";

@Component({
	selector: 'product-table-list-component',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ActiveStyleDirective,
		NotFoundTableDataComponent,
		TableNgxDatatableSmartComponent,
		TranslatePipe,
		RowActionButtonComponent,
		AutoRefreshButtonComponent,
		NoAvailable,
		SynchronizationMolecule
	],
	providers: [
		CurrencyPipe,
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-80px)] block flex flex-1 flex-col'
	}
})
export class TableListComponent extends TableComponent<EProduct> {

	private readonly currencyPipe = inject(CurrencyPipe)

	public readonly availableLanguages = toSignal(this.store.select(BusinessProfileState.availableLanguages));

	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');
	public readonly imagesCellTemplate = viewChild<TemplateRef<any>>('imagesCellTemplate');
	public readonly syncedAtTemplate = viewChild<TemplateRef<any>>('syncedAtTemplate');

	public readonly columns = signal<(TableColumn<EProduct> & {
		$$valueGetter?: any,
		$$cellTemplate?: TemplateRef<any>,
	})[]>([
		{
			name: this.translateService.instant('keyword.capitalize.sku'),
			prop: 'sku',
			minWidth: 200,
			width: 200,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.image'),
			prop: 'images',
			minWidth: 120,
			width: 120,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.price'),
			prop: 'price',
			minWidth: 300,
			width: 300,
			sortable: true,
			$$valueGetter: (row: EProduct) => {
				const {value, currency} = row.price;
				return this.currencyPipe.transform(value, currency, 'symbol-narrow');
			}
		},
		{
			name: this.translateService.instant('keyword.capitalize.tags'),
			prop: 'tags',
			minWidth: 160,
			width: 160,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.order'),
			prop: 'order',
			minWidth: 160,
			width: 160,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.state'),
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

		const imagesCellTemplate = this.imagesCellTemplate();
		if (imagesCellTemplate) {
			this.setCellTemplateRef(columns, 'images', imagesCellTemplate);
		}

		const availableLanguages = this.availableLanguages();
		if (availableLanguages?.length) {
			this.setTitlesColumnsByAvailableLanguages(columns, availableLanguages);
		}

		const syncedAtTemplate = this.syncedAtTemplate();
		if (syncedAtTemplate) {
			this.setCellTemplateRef(columns, 'syncedAt', syncedAtTemplate);
		}

		return columns;

	});

	public activate($event: ActivateEvent<IProduct.EntityRaw>) {
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

	public override open(item: IProduct.EntityRaw) {
		const entity = EProduct.fromRaw(item);
		const action = new ProductPresentationActions.OpenDetails(entity);
		this.store.dispatch(action);
	}

	@Dispatch()
	public openForm() {
		return new ProductPresentationActions.OpenForm();
	}

	private setTitlesColumnsByAvailableLanguages(columns: (TableColumn<EProduct> & {
		$$valueGetter?: any,
		$$cellTemplate?: TemplateRef<any>,
	})[], availableLanguages: LanguageCodeEnum[]) {

		const pushAfterIndex = columns.findIndex(({prop}) => prop === 'images') + 1;
		const name = this.translateService.instant('keyword.capitalize.title');

		if (availableLanguages.length < 2) {

			const language = availableLanguages[0];

			columns.splice(pushAfterIndex, 0, {
				name: name,
				prop: 'title',
				minWidth: 240,
				width: 240,
				sortable: false,
				$$valueGetter: (row: EProduct) => this.getTitleForLanguage(row, language)
			})

		} else {

			for (const language of availableLanguages) {

				columns.splice(pushAfterIndex, 0, {
					name: `${name} (${language})`,
					prop: `title-${language}`,
					minWidth: 240,
					width: 240,
					sortable: false,
					$$valueGetter: (row: EProduct) => this.getTitleForLanguage(row, language)
				})

			}

		}

	}

	public getTitleForLanguage(row: EProduct, languageCode: LanguageCodeEnum): string {

		let title = '-';
		const languageVersion = row.languageVersions.find(({language}) => language === languageCode);
		if (languageVersion) {
			title = languageVersion.title;
		}

		return title;

	}
}
