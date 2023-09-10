import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";
import {NgForOf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CalendarEventsListApiAdapter} from "@event/adapter/external/widget/calendar-events.list.api.adapter";

@Component({
	selector: 'utility-widget-calendar-events',
	templateUrl: 'calendar-events.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		TranslateModule,
		IonicModule,
		NgForOf,
		ReactiveFormsModule
	]
})
export class CalendarEventsComponent {
	private readonly calendarEventsListApiAdapter = inject(CalendarEventsListApiAdapter);
	private readonly router = inject(Router);
	private readonly translateService = inject(TranslateService);
	public readonly returnUrl = this.router.url;
	public readonly eventStatusList = Object.keys(EventStatusEnum).map((status) => ({
		id: status,
		label: this.translateService.instant(`event.keyword.status.plural.${status}`)
	}));
	public readonly statusControl = new FormControl(EventStatusEnum.booked);
}
