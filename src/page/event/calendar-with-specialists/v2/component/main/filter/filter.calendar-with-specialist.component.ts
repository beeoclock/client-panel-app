import {AfterViewInit, ChangeDetectionStrategy, Component, inject, Input} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {
	DateControlCalendarWithSpecialistsComponent
} from "@page/event/calendar-with-specialists/v2/filter/date-control/date-control.calendar-with-specialists.component";
import {IonSelectWrapperComponent} from "@utility/presentation/component/input/ion/ion-select-wrapper.component";
import {SettingsComponent} from "@page/event/calendar-with-specialists/v2/settings/settings.component";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {TranslateService} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import CalendarWithSpecialistLocaStateService
	from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Store} from "@ngxs/store";
import {OrderStatusEnum} from "@order/domain/enum/order.status.enum";
import {IonPopover} from "@ionic/angular/standalone";

@Component({
	selector: 'filter-calendar-with-specialist',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [
		`
			ion-popover {
				--width: auto;
				--max-height: 400px
			}
		`
	],
	imports: [
		AsyncPipe,
		AutoRefreshComponent,
		DateControlCalendarWithSpecialistsComponent,
		IonSelectWrapperComponent,
		SettingsComponent,
		IonPopover
	],
	template: `
		<div
			class="overflow-x-auto overflow-y-hidden p-2 flex justify-between gap-2 items-center bg-white border-b border-beeColor-200">

			<div class="overflow-x-auto flex gap-2">
				<event-date-control-calendar-with-specialists-component/>
				<utility-auto-refresh-component
					id="event-calendar-with-specialist-filter-auto-refresh"
					(emitter)="forceRefresh()"
					[isLoading]="(loader$ | async) ?? false"/>
				<button
					id="calendar-with-specialists-settings-button"
					class="border border-beeColor-300 flex items-center p-3 rounded-2xl transition-all hover:bg-beeColor-100">
					<i class="bi bi-gear"></i>
				</button>
				<ion-popover trigger="calendar-with-specialists-settings-button">
					<ng-template>
						<div class="p-2 flex flex-col gap-2">
							<settings-component
								[control]="calendarWithSpecialistLocaStateService.movementInMinutesControl"/>

							<ion-select-wrapper
								class="p-3 max-w-xs"
								id="calendar-with-specialists-filter-order-service-status"
								[multiple]="true"
								[options]="orderServiceStatusOptions"
								[control]="orderServiceStatusesControl"/>
						</div>
					</ng-template>
				</ion-popover>
			</div>

		</div>
	`
})
export class FilterCalendarWithSpecialistComponent implements AfterViewInit {

	@Input({required: true})
	public orderServiceStatusesControl!: FormControl<OrderServiceStatusEnum[]>;

	private readonly translateService = inject(TranslateService);
	private readonly store = inject(Store);
	protected readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);

	public orderServiceStatusOptions: {
		value: any;
		label: string;
	}[] = [];

	public readonly loader$ = this.store.select(CalendarWithSpecialistsQueries.loader);

	private initEventStatusList() {
		Object.keys(OrderStatusEnum).forEach((status) => {
			this.orderServiceStatusOptions.push({
				value: status,
				label: this.translateService.instant(`order.enum.status.singular.${status}`)
			});
		});
	}

	public ngAfterViewInit() {
		this.initEventStatusList();
	}

	@Dispatch()
	public async forceRefresh() {
		return new CalendarWithSpecialistsAction.GetItems();
	}

}
