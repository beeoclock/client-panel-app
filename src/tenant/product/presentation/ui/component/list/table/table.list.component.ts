import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from '@angular/core';
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import EProduct from "@tenant/product/domain/entity/e.product";
import {IProduct} from "@tenant/product/domain";
import {
	RowActionButtonComponent
} from "@tenant/product/presentation/ui/component/row-action-button/row-action-button.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/product/presentation/ui/component/auto-refresh/auto-refresh.button.component";
import {
	ProductPresentationActions
} from "@tenant/product/infrastructure/state/presentation/product.presentation.actions";
import {LanguageCodeEnum} from "@core/shared/enum";
import {toSignal} from "@angular/core/rxjs-interop";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";

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
		AutoRefreshButtonComponent
	],
})
export class TableListComponent extends TableComponent<EProduct> {

	public readonly availableLanguages = toSignal(this.store.select(BusinessProfileState.availableLanguages));

	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');

	public readonly columns = signal<TableColumn<EProduct>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.firstName'),
			prop: 'sku',
			minWidth: 200,
			width: 200,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.lastName'),
			prop: 'productName',
			minWidth: 140,
			width: 140,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.email'),
			prop: 'price',
			minWidth: 300,
			width: 300,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.phone'),
			prop: 'tags',
			minWidth: 160,
			width: 160,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.note'),
			prop: 'order',
			minWidth: 160,
			width: 160,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.active'),
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
	]);

	public readonly columnList = computed(() => {
		const columns = this.columns();

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

	private setTitlesColumnsByAvailableLanguages(columns: TableColumn<EProduct>[], availableLanguages: LanguageCodeEnum[]) {

		const pushAfterIndex = columns.findIndex(({prop}) => prop === 'sku') + 1;
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
