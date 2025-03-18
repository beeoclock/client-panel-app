import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@absence/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@absence/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";

@Component({
	selector: 'app-absence-mobile-layout-list-component',
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
