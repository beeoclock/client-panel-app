import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {RIMember} from "@member/domain";
import {RowActionButtonComponent} from "@member/presentation/component/row-action-button/row-action-button.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
	selector: 'member-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		TranslateModule,
		AsyncPipe,
		RowActionButtonComponent,
		CardComponent,
	]
})
export class CardListComponent extends TableComponent<RIMember> {

	// public override readonly actions = MemberActions;
	//
	// public showAction = new BooleanStreamState(true);
	//
	// public showSelectedStatus = new BooleanStreamState(false);

}
