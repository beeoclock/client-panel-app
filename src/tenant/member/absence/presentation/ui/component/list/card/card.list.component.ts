import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/member/absence/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {
	CardIonListSmartComponent
} from "@shared/presentation/component/smart/card-ion-list/card-ion-list.smart.component";
import {TranslatePipe} from "@ngx-translate/core";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {
	StateStatusComponent
} from "@tenant/member/absence/presentation/ui/component/state-status/state-status.component";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {
	AbsencePresentationActions
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.actions";

@Component({
	selector: 'app-absence-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NotFoundTableDataComponent,
		AutoRefreshButtonComponent,
		CardIonListSmartComponent,
		TranslatePipe,
		DynamicDatePipe,
		NoDataPipe,
		StateStatusComponent,
		CardComponent,
	],
	host: {
		class: 'block flex-1'
	},
})
export class CardListComponent extends TableComponent<EAbsence> {

	public override open(item: IAbsence.DTO) {
		const entity = EAbsence.fromDTO(item);
		this.store.dispatch(new AbsencePresentationActions.OpenDetails(entity));
	}

	@Dispatch()
	public openForm() {
		return new AbsencePresentationActions.OpenForm();
	}
}
