import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {
	ListOfCardCollectionByDateComponent
} from "@tenant/event/presentation/ui/component/requsted/list-of-card-collection-by-date/list-of-card-collection-by-date.component";

@Component({
	selector: 'app-event-requested-page',
	templateUrl: './requested.event.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		ListOfCardCollectionByDateComponent,
	],
	standalone: true,
	providers: [
	]
})
export default class RequestedEventPage extends ListPage {

}
