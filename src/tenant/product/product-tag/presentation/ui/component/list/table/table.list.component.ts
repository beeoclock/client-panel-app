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
import {
	AutoRefreshButtonComponent
} from "@tenant/product/product/presentation/ui/component/auto-refresh/auto-refresh.button.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {
	RowActionButtonComponent
} from "@tenant/product/product-tag/presentation/ui/component/row-action-button/row-action-button.component";
import EProductTag from "@tenant/product/product-tag/domain/entity/e.product-tag";
import {IProductTag} from "@tenant/product/product-tag/domain";
import {
	ProductTagPresentationActions
} from "@tenant/product/product-tag/infrastructure/state/presentation/product-tag.presentation.actions";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";

@Component({
	selector: 'product-tag-table-list-component',
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
		RowActionButtonComponent
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-65px)] block'
	},
})
export class TableListComponent extends TableComponent<EProductTag> {

	public readonly availableLanguages = toSignal(this.store.select(BusinessProfileState.availableLanguages));

	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');

	public readonly columns = signal<TableColumn<EProductTag>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.title'),
			prop: 'name',
			minWidth: 200,
			width: 200,
			sortable: true,
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

		return columns;

	});

	public activate($event: ActivateEvent<IProductTag.EntityRaw>) {
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

	public override open(item: IProductTag.EntityRaw) {
		const entity = EProductTag.fromRaw(item);
		const action = new ProductTagPresentationActions.OpenDetails(entity);
		this.store.dispatch(action);
	}

	@Dispatch()
	public openForm() {
		return new ProductTagPresentationActions.OpenForm();
	}

}
