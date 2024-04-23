import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {CardListComponent} from "@event/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@event/presentation/component/filter/filter.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {RMIEvent} from "@event/domain";
import {LayoutListComponent} from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@event/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {EventActions} from "@event/state/event/event.actions";

@Component({
	selector: 'event-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		CardListComponent,
		FilterComponent,
		NgIf,
		NotFoundTableDataComponent,
		TranslateModule,
		AutoRefreshButtonComponent
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<RMIEvent> {

	public openForm(): void {

		this.store.dispatch(new EventActions.OpenForm());

	}

}
