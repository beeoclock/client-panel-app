import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@order/presentation/component/list/card/card.list.component";
import LayoutListComponent from "@utility/layout.list.component";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NgClass} from "@angular/common";

@Component({
	selector: 'app-order-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgClass,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {

	public readonly showButtonGoToForm = input(true);

	/**
	 * Used external
	 */
	public readonly cardListComponents = viewChildren(CardListComponent);

	@Dispatch()
	public openForm() {
		return new OrderActions.OpenForm();
	}

}
