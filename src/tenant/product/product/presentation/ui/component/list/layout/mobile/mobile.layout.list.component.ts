import {Component, input, ViewEncapsulation,} from '@angular/core';
import LayoutListComponent from "@shared/layout.list.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NgClass} from "@angular/common";
import {FilterComponent} from "@tenant/product/product/presentation/ui/component/filter/filter.component";
import {CardListComponent} from "@tenant/product/product/presentation/ui/component/list/card/card.list.component";
import {
	ProductPresentationActions
} from "@tenant/product/product/infrastructure/state/presentation/product.presentation.actions";

@Component({
	selector: 'product-mobile-layout-list-component',
	template: `
		<div class="flex flex-col max-w-full" [ngClass]="{
			'overflow-x-auto h-[calc(100dvh-80px)] md:h-[calc(100vh-65px)]': isPage()
		}">
			<product-filter-component [showButtonGoToForm]="showButtonGoToForm()"/>
			<product-card-list-component/>
		</div>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgClass,
		FilterComponent,
		CardListComponent
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {
	public readonly showButtonGoToForm = input(true);

	@Dispatch()
	public openForm() {
		return new ProductPresentationActions.OpenForm();
	}
}
