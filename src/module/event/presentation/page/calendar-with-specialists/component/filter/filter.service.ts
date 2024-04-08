import {inject, Injectable} from "@angular/core";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";
import {
	DateControlCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/filter/date-control/date-control.calendar-with-specialists.service";
import {BehaviorSubject, filter} from "rxjs";
import {RIEvent} from "@event/domain";
import {Reactive} from "@utility/cdk/reactive";
import {ActivatedRoute, Router} from "@angular/router";
import {is} from "thiis";
import {DateTime} from "luxon";

@Injectable()
export class FilterService extends Reactive {

	private readonly dateControlCalendarWithSpecialistsService = inject(DateControlCalendarWithSpecialistsService);
	private readonly listMergedEventApiAdapter = inject(ListMergedEventApiAdapter);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly router = inject(Router);

	public readonly loader = new BooleanStreamState(false);

	public readonly events$ = new BehaviorSubject<RIEvent[]>([]);

	public initHandler() {

		this.activatedRoute.queryParams.pipe(this.takeUntil(), filter(is.object_not_empty<{date: string;}>)).subscribe((params) => {
			const {date} = params;
			if (date) {
				this.dateControlCalendarWithSpecialistsService.setDateTime(DateTime.fromISO(date));
			}
		});

		this.dateControlCalendarWithSpecialistsService.selectedDate$.pipe(this.takeUntil()).subscribe(() => {

			this.forceRefresh();

		});

	}

	public forceRefresh() {

		this.loader.doTrue();
		this.events$.next([]);

		const selectedDate = this.dateControlCalendarWithSpecialistsService.selectedDate;

		this.router.navigate([], {
			queryParams: {
				date: selectedDate.toUTC().toISO(),
			},
			replaceUrl: true,
		});

		const params: TableState_BackendFormat = {
			start: selectedDate.startOf('day').toJSDate().toISOString(),
			end: selectedDate.endOf('day').toJSDate().toISOString(),
			page: 1,
			pageSize: 1000,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		};

		this.listMergedEventApiAdapter.execute$(params).subscribe((result) => {

			this.events$.next(result.items);

			this.loader.doFalse();

		});

	}

}
