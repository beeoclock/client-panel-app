import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {CardListComponent} from "@tenant/member/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@tenant/member/presentation/component/filter/filter.component";

@Component({
	selector: 'member-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgClass,
		CardListComponent,
		FilterComponent,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {
	public readonly showButtonGoToForm = input(true);

	public readonly cardListComponents = viewChildren(CardListComponent);


}
