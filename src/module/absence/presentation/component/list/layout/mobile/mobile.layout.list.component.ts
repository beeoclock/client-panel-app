import {Component, Input, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@absence/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@absence/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@absence/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";

@Component({
	selector: 'app-absence-mobile-layout-list-component',
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
		NgClass,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<IAbsenceDto> {

	@Input()
	public showButtonGoToForm = true;

	@ViewChildren(CardListComponent)
	public cardListComponents!: QueryList<CardListComponent>;

	public openForm(): void {
		this.store.dispatch(new AbsenceActions.OpenForm());
	}

	protected readonly open = open;
}
