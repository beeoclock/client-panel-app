import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryLinkButtonDirective} from "@shared/presentation/directives/button/primary.link.button.directive";
import {CalendarEventsComponent} from "@shared/presentation/component/widget/calendar-events/calendar-events.component";

@Component({
	selector: 'utility-dashboard-page',
	templateUrl: './index.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		RouterLink,
		CardComponent,
		TranslateModule,
		PrimaryLinkButtonDirective,
		CalendarEventsComponent
	]
})
export default class Index {
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;
}
