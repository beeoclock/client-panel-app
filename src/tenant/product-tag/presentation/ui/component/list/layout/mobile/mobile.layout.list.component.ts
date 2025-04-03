import {Component, input, ViewEncapsulation,} from '@angular/core';
import LayoutListComponent from "@shared/layout.list.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NgClass} from "@angular/common";
import {CardListComponent} from "@tenant/product-tag/presentation/ui/component/list/card/card.list.component";
import {FilterComponent} from "@tenant/product-tag/presentation/ui/component/filter/filter.component";
import {
	ProductTagPresentationActions
} from "@tenant/product-tag/infrastructure/state/presentation/product-tag.presentation.actions";

@Component({
	selector: 'product-tag-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgClass,
		FilterComponent,
		CardListComponent,
		CardListComponent,
		FilterComponent
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {
	public readonly showButtonGoToForm = input(true);

	@Dispatch()
	public openForm() {
		return new ProductTagPresentationActions.OpenForm();
	}
}
