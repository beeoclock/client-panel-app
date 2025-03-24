import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {EventRequestedState} from "@event/presentation/state/event-requested/event-requested.state";
import {Store} from "@ngxs/store";
import {MEvent, RIEvent} from "@event/domain";
import {AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe, NgForOf} from "@angular/common";
import {map} from "rxjs";
import {DateTime} from "luxon";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {debounce} from "typescript-debounce-decorator";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {
	AttendeeCardComponent
} from "@event/presentation/component/requsted/list-of-card-collection-by-date/attendee-card/attendee.card.component";
import {ActivatedRoute, Router} from "@angular/router";
import {FilterComponent} from "@event/presentation/component/filter/requested-filter.component";

@Component({
	selector: 'event-list-of-card-collection-by-date-component',
	templateUrl: './list-of-card-collection-by-date.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgForOf,
		AsyncPipe,
		KeyValuePipe,
		CardComponent,
		ActionComponent,
		CurrencyPipe,
		DatePipe,
		EventStatusStyleDirective,
		HumanizeDurationPipe,
		NoDataPipe,
		TranslateModule,
		AttendeeCardComponent,
		FilterComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
})
export class ListOfCardCollectionByDateComponent {

	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly store = inject(Store);
	private readonly translateService = inject(TranslateService);

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public readonly tableState$ = this.store.select(EventRequestedState.tableState);

	public readonly items$ = this.tableState$.pipe(
		// startWith({items: []}),
		map((tableState) => tableState.items),
		map((items: RIEvent[]) => {

			// Step #1 group by date
			// Step #2 group by time
			// Step #3 sort by date and time

			return items.reduce((acc, item) => {
				const dateTime = DateTime.fromISO(item.start);
				const dateKey = dateTime.toFormat('yyyy-MM-dd');
				const timeKey = dateTime.toFormat('HH:mm');
				const dateGroup = acc[dateKey] ?? {};
				const timeGroup = dateGroup[timeKey] ?? [];
				timeGroup.push(item);
				dateGroup[timeKey] = timeGroup;
				acc[dateKey] = dateGroup;
				return acc;
			}, {} as { [key: string]: { [key: string]: RIEvent[] } });

		}),
	);

	public toEventListType(list: unknown): MEvent[] {
		return Array.isArray(list) ? list.map(MEvent.create) : [];
	}

	public getDayNameByDate(date: string) {
		return DateTime.fromISO(date).toFormat('EEE', {
			locale: this.translateService.currentLang,
		});
	}

	public sameYear(start: string | undefined): boolean {
		return start ? new Date(start).getFullYear() === new Date().getFullYear() : false;
	}

	public getDateCorrectFormat(date: string) {
		// If the same year, then we don't need to show the year
		if (this.sameYear(date)) {
			return DateTime.fromISO(date).toFormat('dd MMMM', {
				locale: this.translateService.currentLang,
			});
		}
		return DateTime.fromISO(date).toFormat('dd MMMM yyyy', {
			locale: this.translateService.currentLang,
		});
	}

	public getOffsetOfDays(date: string) {
		// Round to the nearest day
		const today = DateTime.local().startOf('day');
		const start = DateTime.fromISO(date).startOf('day');
		const diff = start.diff(today, 'days').toObject();
		return diff.days;
	}

	@debounce(300)
	public singleClick(item: RIEvent) {
		this.router.navigate(['../', item._id], {
			relativeTo: this.activatedRoute,
			queryParams: {
				returnUrl: this.router.url
			}
		}).then();
	}

}
