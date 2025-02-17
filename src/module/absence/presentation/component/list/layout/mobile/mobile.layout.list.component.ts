import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
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
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ITableState} from "@utility/domain/table.state";

@Component({
	selector: 'app-absence-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardListComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		FilterComponent,
		AutoRefreshButtonComponent,
		NgClass,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<IAbsence.Entity> {
	public override readonly tableState = input.required<ITableState<IAbsence.Entity> | null>();
	public readonly showButtonGoToForm = input(true);

	readonly cardListComponents = viewChildren(CardListComponent);

	@Dispatch()
	public openForm() {
		return new AbsenceActions.OpenForm();
	}

	protected readonly open = open;
}
