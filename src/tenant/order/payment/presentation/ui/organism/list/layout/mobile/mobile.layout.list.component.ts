import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {CardListComponent} from "@tenant/order/payment/presentation/ui/organism/list/card/card.list.component";

@Component({
	selector: 'payment-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
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

	public readonly cardListComponents = viewChildren(CardListComponent);


}
