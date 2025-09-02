import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {CardListComponent} from "@tenant/order/order-service/presentation/ui/organism/list/card/card.list.component";
import {FilterComponent} from "@tenant/order/order-service/presentation/ui/organism/filter/filter.component";

@Component({
	selector: 'order-service-mobile-layout-list-component',
	template: `
		<div class="flex flex-col max-w-full" [ngClass]="{
			'overflow-x-auto h-[calc(100dvh-80px)] md:h-[calc(100vh-65px)]': isPage()
		}">
			<order-service-filter-component/>
			<order-service-card-list-component/>
		</div>

	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgClass,
		CardListComponent,
		FilterComponent,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {
	public readonly showButtonGoToForm = input(true);
	public readonly cardListComponents = viewChildren(CardListComponent);
}
