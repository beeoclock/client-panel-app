import {Component, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'app-order-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
	]
})
export class DesktopLayoutListComponent extends LayoutListComponent {

	@Dispatch()
	public openForm() {
		return new OrderActions.OpenForm();
	}

}
