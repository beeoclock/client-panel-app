import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@tenant/service/presentation/ui/component/list/card/card.list.component";

import {FilterComponent} from "@tenant/service/presentation/ui/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";

@Component({
	selector: 'service-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardListComponent,
		TranslateModule,
		FilterComponent,
		NgClass
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {

	public readonly showButtonGoToForm = input(true);

	public readonly cardListComponents = viewChildren(CardListComponent);


}
