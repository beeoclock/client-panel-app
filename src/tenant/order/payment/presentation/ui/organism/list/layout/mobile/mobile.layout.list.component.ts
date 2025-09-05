import {Component, input, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {CardListComponent} from "@tenant/order/payment/presentation/ui/organism/list/card/card.list.component";

@Component({
	selector: 'payment-mobile-layout-list-component',
	template: `
		<div class="flex flex-col max-w-full" [ngClass]="{
'overflow-x-auto h-[calc(100dvh-80px)] md:h-[calc(100vh-65px)]': isPage()
}">
			<!--\t<payment-filter-component [showButtonGoToForm]="showButtonGoToForm()"/>-->
			<payment-card-list-component/>
		</div>

	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgClass,
		CardListComponent,
		CardListComponent,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {
	public readonly showButtonGoToForm = input(true);


}
