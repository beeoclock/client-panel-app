import {Component, input, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {OrderActions} from "@tenant/order/infrastructure/state/order/order.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NgClass} from "@angular/common";
import {CardListOrderComponent} from "@tenant/order/presentation/ui/component/list/card/card.list.order.component";

@Component({
	selector: 'app-order-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgClass,
		CardListOrderComponent,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {

	public readonly showButtonGoToForm = input(true);

	@Dispatch()
	public openForm() {
		return new OrderActions.OpenForm();
	}

}
