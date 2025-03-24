import {Component, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {OrderActions} from "@order/presentation/state/order/order.actions";
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
