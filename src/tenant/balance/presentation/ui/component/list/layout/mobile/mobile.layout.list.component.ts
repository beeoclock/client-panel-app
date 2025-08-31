import {Component, input, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@shared/layout.list.component";
import {FilterComponent} from "@tenant/balance/presentation/ui/component/filter/filter.component";
import {CardListComponent} from "@tenant/balance/presentation/ui/component/list/card/card.list.component";

@Component({
	selector: 'balance-mobile-layout-list-component',
	template: `
		<div class="flex flex-col max-w-full" [ngClass]="{
'overflow-x-auto h-[calc(100dvh-80px)] md:h-[calc(100vh-65px)]': isPage()
}">
			<balance-filter-component [showButtonGoToForm]="showButtonGoToForm()"/>
			<balance-card-list-component/>
		</div>
	`,
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


}
