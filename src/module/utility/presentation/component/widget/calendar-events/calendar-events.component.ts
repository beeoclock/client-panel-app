import {AfterViewInit, Component, inject, ViewChild, ViewEncapsulation} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IonDatetime, IonicModule} from "@ionic/angular";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalendarEventsListApiAdapter} from "@event/adapter/external/widget/calendar-events.list.api.adapter";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {Reactive} from "@utility/cdk/reactive";
import {RIEvent} from "@event/domain";
import {BooleanState} from "@utility/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {
	IonSelectEventStatusComponent
} from "@utility/presentation/component/input/ion/ion-select-event-status.component";
import {DynamicDateHelper} from "@utility/presentation/pipes/dynamic-date/dynamic-date.helper";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";

@Component({
	selector: 'utility-widget-calendar-events',
	templateUrl: 'calendar-events.component.html',
	encapsulation: ViewEncapsulation.None,
	// changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		TranslateModule,
		IonicModule,
		NgForOf,
		ReactiveFormsModule,
		FormsModule,
		PrimaryLinkButtonDirective,
		NgIf,
		LoaderComponent,
		EventStatusStyleDirective,
		IonSelectEventStatusComponent,
		DynamicDatePipe,
	]
})
export class CalendarEventsComponent extends Reactive implements AfterViewInit {

	@ViewChild(IonDatetime)
	public readonly ionDatetime!: IonDatetime;

	private readonly calendarEventsListApiAdapter = inject(CalendarEventsListApiAdapter);
	private readonly router = inject(Router);
	private readonly translateService = inject(TranslateService);
	private readonly dynamicDateHelper = inject(DynamicDateHelper);
	public readonly returnUrl = this.router.url;
	public readonly todayStr = new Date().toLocaleDateString("sv");
	public readonly form = new FormGroup({
		start: new FormControl(this.todayStr),
		end: new FormControl(this.todayStr),
		status: new FormControl(EventStatusEnum.booked),
		orderBy: new FormControl('start'),
		orderDir: new FormControl('asc'),
		pageSize: new FormControl(50)
	});
	public items: RIEvent[] = [];
	public readonly loading = new BooleanState(false);

	constructor() {
		super();
		this.form.valueChanges.subscribe((params) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
			this.loading.switchOn();
			this.ionDatetime.disabled = this.loading.isOn;
			const newStart = new Date(params.start as string);
			newStart.setHours(0);
			newStart.setMinutes(0);
			newStart.setSeconds(0);
			params.start = newStart.toISOString();

			newStart.setDate(newStart.getDate() + 1);
			params.end = newStart.toISOString();
			if (!params.status) {
				delete params.status;
			}
			this.calendarEventsListApiAdapter.executeAsync(params).then((data) => {
				this.items = data.items;
				this.loading.switchOff();
				this.form.enable({
					emitEvent: false,
					onlySelf: true
				});
				this.ionDatetime.disabled = this.loading.isOn;
			});
		});
	}

	public ngAfterViewInit() {
		this.ionDatetime.locale = this.translateService.currentLang;
		this.translateService.onLangChange.pipe(this.takeUntil()).subscribe((lang) => {
			this.ionDatetime.locale = lang.lang;
		});
		this.toDay();
	}

	public toDay(): void {
		this.form.controls.start.setValue(this.todayStr);
	}

	public dynamicDate(value: string | null): string {
		return this.dynamicDateHelper.transform(value ?? '', 'shortDate');
	}
}
