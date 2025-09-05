import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {CardListComponent} from "@tenant/member/member/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@tenant/member/member/presentation/component/filter/filter.component";

@Component({
	selector: 'member-mobile-layout-list-component',
	template: `
		<div class="flex flex-col max-w-full" [ngClass]="{
'overflow-x-auto h-[calc(100dvh-80px)] md:h-[calc(100vh-65px)]': isPage()
}">
			<member-filter-component [showButtonGoToForm]="showButtonGoToForm()"/>
			<member-card-list-component/>
		</div>

	`,
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
