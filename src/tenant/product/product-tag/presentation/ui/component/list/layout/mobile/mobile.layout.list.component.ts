import {Component, input, ViewEncapsulation,} from '@angular/core';
import LayoutListComponent from "@shared/layout.list.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NgClass} from "@angular/common";
import {CardListComponent} from "@tenant/product/product-tag/presentation/ui/component/list/card/card.list.component";
import {FilterComponent} from "@tenant/product/product-tag/presentation/ui/component/filter/filter.component";
import {
	ProductTagPresentationActions
} from "@tenant/product/product-tag/infrastructure/state/presentation/product-tag.presentation.actions";

@Component({
	selector: 'product-tag-mobile-layout-list-component',
	template: `
		<div class="flex flex-col max-w-full" [ngClass]="{
'overflow-x-auto h-[calc(100dvh-80px)] md:h-[calc(100vh-65px)]': isPage()
}">
			<product-tag-filter-component [showButtonGoToForm]="showButtonGoToForm()"/>
			<product-tag-card-list-component/>
		</div>

	`,
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
