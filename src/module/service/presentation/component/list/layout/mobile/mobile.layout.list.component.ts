import {Component, Input, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@service/presentation/component/list/card/card.list.component";
import {IService} from "@service/domain";
import {FilterComponent} from "@service/presentation/component/filter/filter.component";
import {LayoutListComponent} from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {ServiceActions} from "@service/state/service/service.actions";

@Component({
	selector: 'service-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		CardListComponent,
		NgIf,
		NotFoundTableDataComponent,
		TranslateModule,
		FilterComponent,
		AutoRefreshButtonComponent,
		NgClass
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<IService> {

	@Input()
	public showButtonGoToForm = true;

	@ViewChildren(CardListComponent)
	public cardListComponents!: QueryList<CardListComponent>;
	openForm() {
		this.store.dispatch(new ServiceActions.OpenForm());
	}

}
