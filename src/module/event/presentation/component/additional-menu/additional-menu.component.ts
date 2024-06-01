import {Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {RIMember} from "@member/domain";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {Store} from "@ngxs/store";
import {OrderActions} from "@order/state/order/order.actions";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {
	SelectedMemberAdditionalMenuComponent
} from "@event/presentation/component/additional-menu/selected-member.additional-menu.component";
import {NgIf} from "@angular/common";
import {
	SelectedDatetimeAdditionalMenuComponent
} from "@event/presentation/component/additional-menu/selected-datetime.additional-menu.component";
import {DateTime} from "luxon";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";

@Component({
	selector: 'app-additional-menu',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		SelectedMemberAdditionalMenuComponent,
		NgIf,
		SelectedDatetimeAdditionalMenuComponent,
		DynamicDatePipe
	],
	template: `
		<div class="grid grid-cols-1 gap-2 p-2">
			<div class="flex gap-2">
				<app-selected-member-additional-menu class="flex-1" *ngIf="member" [member]="member"/>
				<app-selected-datetime-additional-menu class="flex-1" *ngIf="datetimeISO" [datetimeISO]="datetimeISO"/>
			</div>

			<div class="font-bold text-lg text-blue-950">
				<i class="bi bi-cart"></i>&nbsp;
				<span>{{ 'sidebar.order' | translate }}</span>
			</div>

			<button type="button" (click)="openOrderForm()"
							class="text-center bg-white border border-blue-950 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md transition-colors">
				<h3 class="text-lg font-semibold text-blue-950 flex items-center justify-center gap-2">
					<span>{{ 'event.additionalMenu.items.addNewOrder.title' | translate }}</span>
				</h3>
			</button>

			<p class="text-beeColor-500 text-sm px-2 italic">
				{{ 'event.additionalMenu.items.addNewOrder.hint' | translate }}
			</p>

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
						<button type="button" (click)="openAbsenceForm(120, false)" [class]="classList.absence.button">
							<span class="text-2xl">2</span><span
							class="font-medium">{{ 'keyword.lowercase.short.hour' | translate }}</span>
						</button>
					</div>
				</div>
			</div>
			<!--            <button type="button" (click)="openAbsenceForm()"-->
			<!--                    class="bg-white border border-blue-300 cursor-pointer duration-300 hover:bg-gray-100 p-4 rounded-md text-center transition-colors">-->
			<!--                <h3 class="text-lg font-semibold text-black mb-2">-->
			<!--                    <i class="w-6 h-6 me-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 bi bi-calendar2-x"></i>-->
			<!--                    {{ 'event.additionalMenu.items.addNewAbsence.title' | translate }}-->
			<!--                </h3>-->
			<!--                <p class="text-gray-600">-->
			<!--                    {{ 'event.additionalMenu.items.addNewAbsence.hint' | translate }}-->
			<!--                </p>-->
			<!--            </button>-->
		</div>
	`
})
export class AdditionalMenuComponent implements OnInit {

	@Input()
	public member: RIMember | undefined;

	@Input()
	public datetimeISO: string | undefined;

	@Input()
	public callback: (() => void) = () => {
	};

	@HostBinding()
	public class = 'bg-white'

	public readonly classList = {
		absence: {
			button: 'bg-white border border-blue-950 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors'
		}
	}

	public readonly now = new Date().toISOString();

	private readonly pushBoxService = inject(PushBoxService);
	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public ngOnInit() {
		this.ngxLogger.info('AdditionalMenuComponent initialized', this);
	}

	public openOrderForm() {
		this.store.dispatch(new OrderActions.OpenForm({
			componentInputs: {
				setupPartialData: {
					defaultAppointmentStartDateTimeIso: this.datetimeISO,
					defaultMemberForService: this.member
				}
			},
			pushBoxInputs: {
				callback: {
					on: {
						destroy: {
							before: this.callback
						}
					}
				}
			}
		}));
	}

	public openAbsenceForm(differenceInMinutes: number = 15, useDatetimeISO: boolean = true) {

		const item = {
			memberIds: [] as string[],
			start: DateTime.now().toJSDate().toISOString(),
			end: DateTime.now().plus({minutes: differenceInMinutes}).toJSDate().toISOString(),
		};

		if (this.member) {
			item.memberIds = [this.member._id];
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
							before: this.callback
						}
					}
				}
			}
		}));
	}

	public async closeSelf() {
		await this.pushBoxService.destroyComponent(AdditionalMenuComponent);
	}

}
