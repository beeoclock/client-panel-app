import {AfterViewInit, ChangeDetectionStrategy, Component, inject, input} from "@angular/core";
import {IonSelectWrapperComponent} from "@shared/presentation/ui/component/input/ion/ion-select-wrapper.component";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {IonPopover} from "@ionic/angular/standalone";
import {Reactive} from "@core/cdk/reactive";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {VisibilityService} from "@core/cdk/visibility.service";
import {IonSelectMemberComponent} from "@shared/presentation/ui/component/input/ion/ion-select-member.component";
import {DateControlWeekCalendarComponent} from "../../../filter/date-control/date-control.week-calendar.component";
import {WeekCalendarAction} from "@src/tenant/event/infrastructure/state/week-calendar/week-calendar.action";

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
		DateControlWeekCalendarComponent,
		IonSelectWrapperComponent,
		IonPopover,
		TranslateModule,
		IonSelectMemberComponent
	],
	template: `
		<div
			class="overflow-x-auto overflow-y-hidden p-1 flex justify-between gap-2 items-center bg-white border-b border-beeColor-200">

			<div class="overflow-x-auto flex gap-2">
				<event-date-control-week-calendar-component/>
				<button
					id="week-calendar-settings-button"
					class="border border-beeColor-300 flex items-center p-3 rounded-2xl transition-all hover:bg-beeColor-100">
					<i class="bi bi-gear"></i>
				</button>
				<ion-popover trigger="week-calendar-settings-button">
					<ng-template>
						<div class="p-2 flex flex-col gap-2">
							<div>
								<label for="" class="text-sm">
									{{ 'keyword.capitalize.statuses' | translate }}
								</label>
								<ion-select-wrapper
									class="max-w-xs"
									id="week-calendar-filter-order-service-status"
									[multiple]="true"
									[options]="orderServiceStatusOptions"
									[control]="orderServiceStatusesControl()"/>
							</div>
						</div>
					</ng-template>
				</ion-popover>
				<ion-select-member [control]="memberListControl()"/>
			</div>

		</div>
	`
})
export class FilterCalendarWithSpecialistComponent extends Reactive implements AfterViewInit {

	public readonly orderServiceStatusesControl = input.required<FormControl<OrderServiceStatusEnum[]>>();
	public readonly memberListControl = input.required<FormControl<string[]>>();
	public orderServiceStatusOptions: {
		value: OrderServiceStatusEnum;
		label: string;
	}[] = [];
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
		[OrderServiceStatusEnum.done, OrderServiceStatusEnum.accepted, OrderServiceStatusEnum.requested].forEach((status) => {
			this.orderServiceStatusOptions.push({
				value: status,
				label: this.translateService.instant(`event.keyword.status.singular.${status}`)
			});
		});
	}

	@Dispatch()
	public async forceRefresh() {
		return new WeekCalendarAction.GetItems();
	}

}
