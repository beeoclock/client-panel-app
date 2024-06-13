import {Component, inject, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, DOCUMENT, NgIf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {combineLatest, map, tap} from "rxjs";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {IonDatetime, IonicModule, ModalController} from "@ionic/angular";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {DateTime} from "luxon";
import {Reactive} from "@utility/cdk/reactive";

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
					<ion-datetime [firstDayOfWeek]="1" [locale]="locale" [max]="datetimeAttributes.max" id="datetime" presentation="date" [formControl]="dateControl"/>
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

				<span *ngIf="hint$ | async as translateKey" class="text-xs font-semibold">
					{{ translateKey | translate }}
				</span>

				<span class="text-xs" *ngIf="selectedDate$ | async as selectedDate">
					{{ selectedDate.toFormat('yyyy-MM-dd') }}
				</span>

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
		NgIf,
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

	@ViewChild(IonDatetime)
	public readonly ionDateTime!: IonDatetime;

	private readonly store = inject(Store);
	private readonly translateService = inject(TranslateService);
	private readonly document = inject(DOCUMENT);
	private readonly modalController = inject(ModalController);

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

	public ngOnInit() {
		this.dateControl.valueChanges.subscribe((start) => {

			this.store.dispatch(new CalendarWithSpecialistsAction.SetDate({
				start
			}));
			this.modalController.getTop().then((modal) => {
				modal && modal.dismiss().then();
			});

		})
	}

	public nextDate() {
		this.store.dispatch(new CalendarWithSpecialistsAction.NextDate());
	}

	public prevDate() {
		this.store.dispatch(new CalendarWithSpecialistsAction.PrevDate());
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
		const {firstElementChild} = shadowRoot as unknown as {firstElementChild: HTMLButtonElement};
		if (!firstElementChild) {
			return;
		}
		firstElementChild.click();
	}

	public async setToday() {
		const today = DateTime.now().toISODate() ?? this.dateControl.value;
		await this.ionDateTime.reset();
		setTimeout(() => {
			this.dateControl.setValue(today);
		}, 350)
	}

}
