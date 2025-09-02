import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@tenant/member/absence/presentation/ui/component/list/card/card.list.component";
import {FilterComponent} from "@tenant/member/absence/presentation/ui/component/filter/filter.component";
import LayoutListComponent from "@shared/layout.list.component";

@Component({
	selector: 'app-absence-mobile-layout-list-component',
	template: `
		<div class="flex flex-col max-w-full" [ngClass]="{
'overflow-x-auto h-[calc(100dvh-80px)] md:h-[calc(100vh-65px)]': isPage()
}">
			<app-absence-filter-component [showButtonGoToForm]="showButtonGoToForm()"/>
			<app-absence-card-list-component/>
		</div>
	`,
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
