import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Component({
	selector: 'member-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		TranslateModule,
		AsyncPipe,
		CardComponent,
	]
})
export class CardListComponent extends TableComponent<IMember.Entity> {

	public override open(item: IMember.Entity) {
		this.store.dispatch(new MemberActions.OpenDetails(item));
	}

}
