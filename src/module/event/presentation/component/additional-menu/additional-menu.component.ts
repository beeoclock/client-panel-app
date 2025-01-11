import {Component, HostBinding, inject, Input, input, OnInit, viewChild, ViewEncapsulation} from "@angular/core";
import {RIMember} from "@member/domain";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {Store} from "@ngxs/store";
import {OrderActions} from "@order/state/order/order.actions";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {
	SelectedMemberAdditionalMenuComponent
} from "@event/presentation/component/additional-menu/selected-member.additional-menu.component";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {
	SelectedDatetimeAdditionalMenuComponent
} from "@event/presentation/component/additional-menu/selected-datetime.additional-menu.component";
import {DateTime} from "luxon";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SelectServiceListComponent} from "@service/presentation/component/select-list/select-service-list.component";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {CustomerChipComponent} from "@src/component/smart/order/form/service/list/item/chip/customer.chip.component";
import {IonicModule} from "@ionic/angular";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

enum SegmentEnum {
	ORDERING = 'ordering',
	ABSENCE = 'absence'
}

@Component({
	selector: 'app-additional-menu',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		SelectedMemberAdditionalMenuComponent,
		NgIf,
		SelectedDatetimeAdditionalMenuComponent,
		DynamicDatePipe,
		DatePipe,
		SelectServiceListComponent,
		CustomerChipComponent,
		IonicModule,
		ReactiveFormsModule
	],
	providers: [CurrencyPipe, DurationVersionHtmlHelper],
	template: `
		<div class="flex flex-col gap-2 h-full p-2">
			<div class="flex flex-col gap-2">
				<div class="bg-white flex gap-2 justify-between rounded-xl w-full">
					@if (member) {
						<div class="text-beeColor-500">
							{{ member.firstName }}&nbsp;{{ member.lastName }}
						</div>
					}
					@if (datetimeISO) {
						<div class="text-beeColor-500">{{ datetimeISO | dynamicDate }}</div>
					}
				</div>

				<ion-segment [formControl]="segmentControl">

					@for (segment of segments; track segment) {

						<ion-segment-button [value]="segment">
							<ion-label>
								{{ 'keyword.capitalize.' + segment | translate }}
							</ion-label>
						</ion-segment-button>

					}

				</ion-segment>

			</div>

			@switch (segmentControl.value) {

				@case (SegmentEnum.ORDERING) {

					<div class="bg-white flex flex-col rounded-xl w-full">
						<div class="text-beeColor-500 text-sm">{{ 'keyword.capitalize.customer' | translate }}</div>
						<app-customer-chip-component
							id="ordering-customer-chip"
							class="flex flex-1 w-full"
						/>
					</div>

					<app-select-service-list-component class="flex-1" #selectServiceListComponent/>

					<div
						class="flex flex-col gap-2 items-center justify-between w-full">
						<div class="rounded-full p-3 bg-white min-h-[46px] flex items-center">
							<ul class="leading-tight flex gap-2">
								<li class="flex gap-1"><span>{{ selectServiceListComponent.selectedServices.length }}</span><i
									class="bi bi-cart"></i></li>
								<li><span class="text-nowrap whitespace-nowrap"
										  [innerHTML]="durationVersionHtmlHelper.getTotalPriceValueV2(selectServiceListComponent.selectedServices)"></span>
								</li>
								<li><span class="text-nowrap whitespace-nowrap"
										  [innerHTML]="durationVersionHtmlHelper.getTotalDurationValueV2(selectServiceListComponent.selectedServices)"></span>
								</li>
							</ul>
						</div>
						<button
							[disabled]="!selectServiceListComponent.selectedServices.length"
							class="border-2 border-slate-600 w-full bg-yellow-400 ps-4 gap-2 rounded-full flex  justify-between items-center"
							(click)="openOrderForm()">

							<div class="flex flex-col gap-1">
								<div class="flex">
								<span class="text-left leading-none">
									{{ 'keyword.capitalize.nextStep' | translate }}
								</span>
								</div>
							</div>
							<div class="rounded-full bg-yellow-500 min-w-[46px] min-h-[46px] flex items-center justify-center">
								<i class="bi bi-chevron-right"></i>
							</div>
						</button>
					</div>

				}

				@case (SegmentEnum.ABSENCE) {

					<div class="flex flex-col gap-2 mt-4">
						<div class="font-bold text-lg text-blue-950">
							<i class="bi bi-calendar-x"></i>
							{{ 'keyword.capitalize.break' | translate }}
						</div>
						<ng-container *ngIf="datetimeISO">
							<div class="flex flex-col gap-1">
								<div class="text-beeColor-500 flex justify-between">
									<div>{{ 'keyword.capitalize.from' | translate }}:</div>
									<div>{{ datetimeISO | dynamicDate }}</div>
								</div>
								<div class="grid grid-cols-4 gap-2 text-blue-950">
									<button type="button" (click)="openAbsenceForm(5, true)" [class]="classList.absence.button">
										<span class="text-2xl">5</span>
										<span class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
									</button>
									<button type="button" (click)="openAbsenceForm(10, true)" [class]="classList.absence.button">
										<span class="text-2xl">10</span>
										<span class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
									</button>
									<button type="button" (click)="openAbsenceForm(15, true)" [class]="classList.absence.button">
										<span class="text-2xl">15</span>
										<span class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
									</button>
									<button type="button" (click)="openAbsenceForm(30, true)" [class]="classList.absence.button">
										<span class="text-2xl">30</span>
										<span class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
									</button>
									<button type="button" (click)="openAbsenceForm(45, true)" [class]="classList.absence.button">
										<span class="text-2xl">45</span>
										<span class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
									</button>
									<button type="button" (click)="openAbsenceForm(60, true)" [class]="classList.absence.button">
										<span class="text-2xl">1</span>
										<span class="font-medium">{{ 'keyword.lowercase.short.hour' | translate }}</span>
									</button>
									<button type="button" (click)="openAbsenceForm(90, true)" [class]="classList.absence.button">
										<span class="text-2xl">1.5</span>
										<span class="font-medium">{{ 'keyword.lowercase.short.hour' | translate }}</span>
									</button>
									<button type="button" (click)="openAbsenceForm(120, true)" [class]="classList.absence.button">
										<span class="text-2xl">2</span>
										<span class="font-medium">{{ 'keyword.lowercase.short.hour' | translate }}</span>
									</button>
								</div>
							</div>
						</ng-container>
						<div class="flex flex-col gap-1 mt-4">
							<div class="text-beeColor-500 flex justify-between">
								<div>{{ 'keyword.capitalize.from' | translate }}: {{ 'keyword.lowercase.now' | translate }}</div>
								<div>{{ now | dynamicDate }}</div>
							</div>
							<div class="grid grid-cols-4 gap-2 text-blue-950">
								<button type="button" (click)="openAbsenceForm(5, false)" [class]="classList.absence.button">
									<span class="text-2xl">5</span><span
									class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
								</button>
								<button type="button" (click)="openAbsenceForm(10, false)" [class]="classList.absence.button">
									<span class="text-2xl">10</span><span
									class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
								</button>
								<button type="button" (click)="openAbsenceForm(15, false)" [class]="classList.absence.button">
									<span class="text-2xl">15</span><span
									class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
								</button>
								<button type="button" (click)="openAbsenceForm(30, false)" [class]="classList.absence.button">
									<span class="text-2xl">30</span><span
									class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
								</button>
								<button type="button" (click)="openAbsenceForm(45, false)" [class]="classList.absence.button">
									<span class="text-2xl">45</span><span
									class="font-medium">{{ 'keyword.lowercase.short.minutes' | translate }}</span>
								</button>
								<button type="button" (click)="openAbsenceForm(60, false)" [class]="classList.absence.button">
									<span class="text-2xl">1</span><span
									class="font-medium">{{ 'keyword.lowercase.short.hour' | translate }}</span>
								</button>
								<button type="button" (click)="openAbsenceForm(90, false)" [class]="classList.absence.button">
									<span class="text-2xl">1.5</span><span
									class="font-medium">{{ 'keyword.lowercase.short.hour' | translate }}</span>
								</button>
								<button type="button" (click)="openAbsenceForm(120, false)" [class]="classList.absence.button">
									<span class="text-2xl">2</span><span
									class="font-medium">{{ 'keyword.lowercase.short.hour' | translate }}</span>
								</button>
							</div>
						</div>
					</div>

				}

			}

		</div>
	`
})
export class AdditionalMenuComponent implements OnInit {

	@Input()
	public member: RIMember | undefined;

	@Input()
	public datetimeISO: string | undefined;

	public readonly callback = input<(() => void)>(() => {
});

	@HostBinding()
	public class = 'bg-white'

	readonly selectServiceListComponent = viewChild.required(SelectServiceListComponent);

	readonly customerChipComponent = viewChild.required(CustomerChipComponent);

	public readonly segmentControl = new FormControl<SegmentEnum>(SegmentEnum.ORDERING, {
		nonNullable: true
	});

	public readonly SegmentEnum = SegmentEnum;

	public readonly segments = [SegmentEnum.ORDERING, SegmentEnum.ABSENCE];

	public readonly classList = {
		absence: {
			button: 'bg-white border border-blue-950 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors'
		}
	}

	public readonly now = new Date().toISOString();

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public ngOnInit() {
		this.ngxLogger.info('AdditionalMenuComponent initialized', this);
	}

	public getDatetimeISOPlusMinutes(minutes: number) {
		if (!this.datetimeISO) {
			return DateTime.now().plus({minutes}).toJSDate().toISOString();
		}
		return DateTime.fromISO(this.datetimeISO).plus({minutes}).toJSDate().toISOString();
	}

	public openOrderForm(minutes: number = 0) {

		let defaultAppointmentStartDateTimeIso = this.datetimeISO || DateTime.now().toJSDate().toISOString();
		if (minutes) {
			defaultAppointmentStartDateTimeIso = DateTime.fromISO(defaultAppointmentStartDateTimeIso).plus({minutes}).toJSDate().toISOString();
		}

		this.store.dispatch(new OrderActions.OpenForm({
			componentInputs: {
				setupPartialData: {
					serviceList: this.selectServiceListComponent().selectedServices,
					defaultAppointmentStartDateTimeIso,
					defaultMemberForService: this.member,
					customer: this.customerChipComponent().customerForm.getRawValue()
				}
			},
			pushBoxInputs: {
				callback: {
					on: {
						destroy: {
							before: this.callback()
						}
					}
				}
			}
		}));
	}

	public openAbsenceForm(differenceInMinutes: number = 15, useDatetimeISO: boolean = true) {

		const item = {
			members: [] as RIMember[],
			start: DateTime.now().toJSDate().toISOString(),
			end: DateTime.now().plus({minutes: differenceInMinutes}).toJSDate().toISOString(),
		};

		if (this.member) {
			item.members = [this.member];
		}

		if (useDatetimeISO && this.datetimeISO) {
			item.start = this.datetimeISO;
			item.end = DateTime.fromISO(this.datetimeISO).plus({minutes: differenceInMinutes}).toJSDate().toISOString();
		}

		this.ngxLogger.info('AdditionalMenuComponent.openAbsenceForm', item);

		this.store.dispatch(new AbsenceActions.OpenForm({
			componentInputs: {
				item
			},
			pushBoxInputs: {
				callback: {
					on: {
						destroy: {
							before: this.callback()
						}
					}
				}
			}
		}));
	}

	public async closeSelf() {
		await this.whacAMaleProvider.destroyComponent(AdditionalMenuComponent);
	}

}
