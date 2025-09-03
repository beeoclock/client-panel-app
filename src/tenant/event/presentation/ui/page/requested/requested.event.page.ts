import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {
	ListOfCardCollectionByDateComponent
} from "@tenant/event/presentation/ui/component/requsted/list-of-card-collection-by-date/list-of-card-collection-by-date.component";

@Component({
	selector: 'app-event-requested-page',
	template: `
		@if (initialized()) {
			<event-list-of-card-collection-by-date-component/>
		} @else {
			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}

	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		ListOfCardCollectionByDateComponent,
	],
	standalone: true,
})
export default class RequestedEventPage extends ListPage {

}
