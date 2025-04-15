import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {FilterComponent} from "@tenant/balance/presentation/ui/component/filter/filter.component";
import {CardListComponent} from "@tenant/balance/presentation/ui/component/list/card/card.list.component";

@Component({
	selector: 'balance-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		FilterComponent,
		NgClass,
		FilterComponent,
		CardListComponent,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {

	public readonly showButtonGoToForm = input(true);
	readonly cardListComponents = viewChildren(CardListComponent);


}
