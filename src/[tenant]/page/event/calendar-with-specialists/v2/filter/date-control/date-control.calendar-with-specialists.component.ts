import {Component, inject, OnInit, viewChild, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, DOCUMENT} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {
	CalendarWithSpecialistsQueries
} from "@event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {combineLatest, map, switchMap, tap} from "rxjs";
import {
	CalendarWithSpecialistsAction
} from "@event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {IonDatetime, IonicModule, ModalController} from "@ionic/angular";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {DateTime} from "luxon";
import {Reactive} from "@utility/cdk/reactive";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'event-date-control-calendar-with-specialists-component',
	template: `
		<div class="relative flex rounded-2xl bg-white shadow-sm items-stretch">

			<button
				(click)="prevDate()"
				[disabled]="loader$ | async"
				type="button"
				class="flex h-12 items-center justify-center rounded-l-2xl border-y border-l border-beeColor-300 text-beeColor-400 hover:text-beeColor-500 focus:relative w-9 pr-0 hover:bg-beeColor-100">
				<i class="bi bi-chevron-left"></i>
			</button>

			<ion-datetime-button id="hidden-ion-datetime-button" [hidden]="true" datetime="datetime"/>

			<ion-modal [keepContentsMounted]="true">
				<ng-template>
					<ion-datetime [firstDayOfWeek]="1" [locale]="locale" [max]="datetimeAttributes.max" id="datetime"
								  presentation="date" [formControl]="dateControl"/>
					<ion-list [inset]="true">
						<ion-item [button]="true" (click)="setToday()" detail="false" color="light">
							<ion-label class="text-center">
								{{ 'keyword.capitalize.today' | translate }}
							</ion-label>
						</ion-item>
					</ion-list>
				</ng-template>
			</ion-modal>

			<button (click)="openDateModal()"
					[disabled]="loader$ | async"
					id="open-modal"
					class="border-y border-beeColor-300 text-nowrap px-3.5 text-beeColor-900 flex flex-col justify-center items-center cursor-pointer hover:bg-beeColor-100 transition-all">

				@if (hint$ | async; as translateKey) {
					<span class="text-sm font-semibold">
						{{ translateKey | translate }}
					</span>
				}

				@if (selectedDate$ | async; as selectedDate) {
					<span class="text-xs">
						{{ selectedDate.toFormat('yyyy-MM-dd') }}
					</span>
				}

			</button>

			<button
				(click)="nextDate()"
				[disabled]="loader$ | async"
				type="button"
				class="flex h-12 items-center justify-center rounded-r-2xl border-y border-r border-beeColor-300 text-beeColor-400 hover:text-beeColor-500 focus:relative w-9 pl-0 hover:bg-beeColor-100">
				<i class="bi bi-chevron-right"></i>
			</button>

		</div>
	`,
	standalone: true,
	imports: [
		TranslateModule,
		AsyncPipe,
		IonicModule,
		ReactiveFormsModule
	],
	encapsulation: ViewEncapsulation.None
})
export class DateControlCalendarWithSpecialistsComponent extends Reactive implements OnInit {

	public readonly dateControl: FormControl<string> = new FormControl((new Date()).toISOString(), {
		nonNullable: true
	});

	public readonly datetimeAttributes = {
		max: DateTime.now().plus({years: 3}).toISODate() ?? ''
	};

	readonly ionDateTime = viewChild.required(IonDatetime);
	private readonly store = inject(Store);
	public readonly loader$ = this.store.select(CalendarWithSpecialistsQueries.loader);
	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start).pipe(
		this.takeUntil(),
		tap((selectedDatetime) => {
			if (!selectedDatetime) {
				return;
			}
			if (this.dateControl.value === selectedDatetime.toJSDate().toISOString()) {
				return;
			}
			this.dateControl.setValue(selectedDatetime.toISODate() ?? '', {emitEvent: false});
		})
	);
	public readonly isTodayOrTomorrowStreams$ = combineLatest([
		this.store.select(CalendarWithSpecialistsQueries.isToday),
		this.store.select(CalendarWithSpecialistsQueries.isTomorrow)
	]);
	public readonly isTodayOrTomorrow$ = this.isTodayOrTomorrowStreams$.pipe(
		map(([isToday, isTomorrow]) => isToday || isTomorrow)
	);
	private readonly translateService = inject(TranslateService);
	public readonly hint$ = combineLatest([
		this.isTodayOrTomorrowStreams$,
		this.selectedDate$
	]).pipe(
		map(({0: {0: isToday, 1: isTomorrow}, 1: selectedDate}) => {
			switch (true) {
				case isToday:
					return 'keyword.capitalize.today';
				case isTomorrow:
					return 'keyword.capitalize.tomorrow';
				default:
					// return name of the day
					return selectedDate.setLocale(this.translateService.currentLang).toFormat('cccc');
			}
		})
	);
	public readonly locale = this.translateService.currentLang;
	private readonly document = inject(DOCUMENT);
	private readonly modalController = inject(ModalController);

	public ngOnInit() {
		this.dateControl.valueChanges.pipe(
			this.takeUntil(),
			switchMap((start) => {
				return this.store.dispatch(new CalendarWithSpecialistsAction.SetDate({
					start
				}))
			}),
			switchMap(() => {
				return this.store.dispatch(new CalendarWithSpecialistsAction.GetItems())
			}),
		).subscribe(() => {
			this.modalController.getTop().then((modal) => {
				modal && modal.dismiss().then();
			});

		})
	}

	@Dispatch()
	public nextDate() {
		return new CalendarWithSpecialistsAction.NextDate();
	}

	@Dispatch()
	public prevDate() {
		return new CalendarWithSpecialistsAction.PrevDate();
	}

	public openDateModal() {
		const button = this.document.getElementById('hidden-ion-datetime-button');
		if (!button) {
			return;
		}
		const {shadowRoot} = button;
		if (!shadowRoot) {
			return;
		}
		const {firstElementChild} = shadowRoot as unknown as { firstElementChild: HTMLButtonElement };
		if (!firstElementChild) {
			return;
		}
		firstElementChild.click();
	}

	public async setToday() {
		const today = DateTime.now().toISODate() ?? this.dateControl.value;
		await this.ionDateTime().reset();
		setTimeout(() => {
			this.dateControl.setValue(today);
		}, 350)
	}

}
