import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@tenant/customer/presentation/ui/component/list/card/card.list.component";
import {FilterComponent} from "@tenant/customer/presentation/ui/component/filter/filter.component";
import LayoutListComponent from "@shared/layout.list.component";

@Component({
	selector: 'customer-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		FilterComponent,
		NgClass,
		CardListComponent,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {

	public readonly showButtonGoToForm = input(true);
	readonly cardListComponents = viewChildren(CardListComponent);


}
