import {AfterViewInit, ChangeDetectionStrategy, Component, inject, input} from "@angular/core";
import {
	DateControlCalendarWithSpecialistsComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/filter/date-control/date-control.calendar-with-specialists.component";
import {IonSelectWrapperComponent} from "@shared/presentation/component/input/ion/ion-select-wrapper.component";
import {
	SettingsComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/settings/settings.component";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import CalendarWithSpecialistLocaStateService
	from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/calendar-with-specialist.loca.state.service";
import {IonPopover} from "@ionic/angular/standalone";
import {Reactive} from "@core/cdk/reactive";
import {
	CalendarWithSpecialistsAction
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {VisibilityService} from "@core/cdk/visibility.service";
import { IonSelectMemberComponent } from "@shared/presentation/component/input/ion/ion-select-member.component";

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
    DateControlCalendarWithSpecialistsComponent,
    IonSelectWrapperComponent,
    SettingsComponent,
    IonPopover,
    TranslateModule,
    IonSelectMemberComponent
],
	template: `
		<div
			class="overflow-x-auto overflow-y-hidden p-1 flex justify-between gap-2 items-center bg-white border-b border-beeColor-200">

			<div class="overflow-x-auto flex gap-2">
				<event-date-control-calendar-with-specialists-component/>
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

							<div>
								<label for="" class="text-sm">
									{{ 'keyword.capitalize.statuses' | translate }}
								</label>
								<ion-select-wrapper
									class="max-w-xs"
									id="calendar-with-specialists-filter-order-service-status"
									[multiple]="true"
									[options]="orderServiceStatusOptions"
									[control]="orderServiceStatusesControl()"/>
							</div>
						</div>
					</ng-template>
				</ion-popover>
				<ion-select-member/>
			</div>

		</div>
	`
})
export class FilterCalendarWithSpecialistComponent extends Reactive implements AfterViewInit {

	public readonly orderServiceStatusesControl = input.required<FormControl<OrderServiceStatusEnum[]>>();
	public orderServiceStatusOptions: {
		value: any;
		label: string;
	}[] = [];
	protected readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	private readonly translateService = inject(TranslateService);
	private readonly visibilityService = inject(VisibilityService);

	public ngAfterViewInit() {
		this.initEventStatusList();
		this.visibilityService.visibility$.pipe(
			this.takeUntil()
		).subscribe((visible) => {
			if (visible) {
				this.forceRefresh().then();
			}
		});
	}

	private initEventStatusList() {
		// Object.keys(OrderServiceStatusEnum)
		[OrderServiceStatusEnum.done, OrderServiceStatusEnum.accepted, OrderServiceStatusEnum.requested].forEach((status) => {
			this.orderServiceStatusOptions.push({
				value: status,
				label: this.translateService.instant(`event.keyword.status.singular.${status}`)
			});
		});
	}

	@Dispatch()
	public async forceRefresh() {
		return new CalendarWithSpecialistsAction.GetItems();
	}

}
