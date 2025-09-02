import {Component, input, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NgClass} from "@angular/common";
import {
	CardListOrderComponent
} from "@tenant/order/order/presentation/ui/component/list/card/card.list.order.component";

@Component({
	selector: 'app-order-mobile-layout-list-component',
	template: `
		<div class="flex flex-col max-w-full h-full" [ngClass]="{
'overflow-x-auto h-[calc(100dvh-80px)] md:h-[calc(100vh-65px)]': isPage()
}">
			<!--\t<member-filter-component [showButtonGoToForm]="showButtonGoToForm()"/>-->
			<order-card-list-component/>
		</div>
	`,
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
