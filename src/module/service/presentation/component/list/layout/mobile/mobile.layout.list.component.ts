import {Component, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@service/presentation/component/list/card/card.list.component";
import {IService} from "@service/domain";
import {FilterComponent} from "@service/presentation/component/filter/filter.component";
import {LayoutListComponent} from "@utility/layout.list.component";

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
		FilterComponent
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<IService> {

	@ViewChildren(CardListComponent)
	public cardListComponents!: QueryList<CardListComponent>;

}
