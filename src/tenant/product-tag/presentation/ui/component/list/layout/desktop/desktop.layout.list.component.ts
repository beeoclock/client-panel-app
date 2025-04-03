import {Component, ViewEncapsulation} from '@angular/core';
import LayoutListComponent from "@shared/layout.list.component";
import {
	ProductTagPresentationActions
} from "@tenant/product-tag/infrastructure/state/presentation/product-tag.presentation.actions";
import {TableListComponent} from "@tenant/product-tag/presentation/ui/component/list/table/table.list.component";
import {FilterComponent} from "@tenant/product-tag/presentation/ui/component/filter/filter.component";

@Component({
	selector: 'product-tag-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		TableListComponent,
		TableListComponent,
		FilterComponent,
	],
	template: `
		<product-tag-filter-component/>
		<product-tag-table-list-component/>
	`,
})
export class DesktopLayoutListComponent extends LayoutListComponent {

	public openForm(): void {
		this.store.dispatch(new ProductTagPresentationActions.OpenForm());
	}
}
