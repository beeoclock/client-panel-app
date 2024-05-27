import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {IsOrganizerEnum, OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {DateTime} from "luxon";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {IAttendee_V2, IEvent_V2} from "@event/domain";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {PagedOrderApiAdapter} from "@order/external/adapter/api/paged.order.api.adapter";
import {PagedAbsenceApiAdapter} from "@absence/external/adapter/api/paged.order.api.adapter";

export interface ICalendarWithSpecialist {
    params: {
        start: string;
        end: string;
        page: number;
        pageSize: number;
        orderBy: OrderByEnum;
        orderDir: OrderDirEnum;
    };
    data: IEvent_V2[];
    loader: boolean;
}

@State<ICalendarWithSpecialist>({
    name: 'calendarWithSpecialists',
    defaults: {
        params: {
            start: DateTime.now().startOf('day').toJSDate().toISOString(),
            end: DateTime.now().endOf('day').toJSDate().toISOString(),
            page: 1,
            pageSize: 1000,
            orderBy: OrderByEnum.CREATED_AT,
            orderDir: OrderDirEnum.DESC,
        },
        data: [],
        loader: false,
    },
})
@Injectable()
export class CalendarWithSpecialistsState {

    private readonly ngxLogger = inject(NGXLogger);
    private readonly pagedOrderApiAdapter = inject(PagedOrderApiAdapter);
    private readonly pagedAbsenceApiAdapter = inject(PagedAbsenceApiAdapter);
    private readonly router = inject(Router);

    @Action(CalendarWithSpecialistsAction.GetItems)
    public async getItems(ctx: StateContext<ICalendarWithSpecialist>) {

        const {params, loader} = ctx.getState();

        if (loader) {
            this.ngxLogger.warn('CalendarWithSpecialistsState.getItems', 'Loader is already active', params);
            return;
        }

        ctx.patchState({
            loader: true,
        });

        const {0: orderPaged, 1: absencePaged} = await Promise.all([
            this.pagedOrderApiAdapter.executeAsync({
                page: params.page,
                pageSize: params.pageSize,
                orderBy: params.orderBy,
                orderDir: params.orderDir,
                start: params.start,
                end: params.end,
            }),
            this.pagedAbsenceApiAdapter.executeAsync({
                page: params.page,
                pageSize: params.pageSize,
                orderBy: params.orderBy,
                orderDir: params.orderDir,
                start: params.start,
                end: params.end,
            }),
        ]);

        const data: IEvent_V2[] = [
            ...orderPaged.items.reduce((acc, order) => {
                if (order.services.length === 0) {
                    return acc;
                }

                order.services.forEach((service) => {

                    const attendees = service.orderServiceDetails.specialists.map((specialist) => {
                        return {
                            _id: specialist.member._id,
                            isOrganizer: IsOrganizerEnum.NO,
                            is: 'specialist',
                            originalData: specialist,
                        } as IAttendee_V2;
                    });

                    service.orderServiceDetails.attendees.forEach((attendee) => {
                        attendees.push({
                            _id: attendee._id,
                            isOrganizer: IsOrganizerEnum.NO,
                            is: 'customer',
                            originalData: attendee,
                        } as IAttendee_V2);
                    });

                    acc.push({
                        is: 'order',
                        _id: service._id,
                        updatedAt: order.updatedAt,
                        createdAt: order.createdAt,
                        start: service.orderServiceDetails.start,
                        end: service.orderServiceDetails.end,
                        note: service.customerNote,
                        entireBusiness: false,
                        attendees,
                        originalData: {order, service},
                    } as IEvent_V2);
                });

                return acc;

            }, [] as IEvent_V2[]),
            ...absencePaged.items.map((absence) => {
                return {
                    is: 'absence',
                    _id: absence._id,
                    updatedAt: absence.updatedAt,
                    createdAt: absence.createdAt,
                    start: absence.start,
                    end: absence.end,
                    note: absence.note,
                    entireBusiness: absence.entireBusiness,
                    attendees: absence.memberIds.map((attendee) => {
                        return {
                            isOrganizer: IsOrganizerEnum.NO,
                            is: 'specialist',
                            originalData: attendee,
                            _id: attendee
                        } as IAttendee_V2;
                    }),
                    originalData: absence,
                } as IEvent_V2;
            })
        ];

        ctx.patchState({
            loader: false,
            data,
        });

    }

    @Action(CalendarWithSpecialistsAction.NextDate)
    public async nextDate(ctx: StateContext<ICalendarWithSpecialist>) {

        const {params} = ctx.getState();

        ctx.dispatch(new CalendarWithSpecialistsAction.SetDate({
            date: DateTime.fromISO(params.start).plus({days: 1}).startOf('day').toJSDate().toISOString()
        }));

    }

    @Action(CalendarWithSpecialistsAction.PrevDate)
    public async prevDate(ctx: StateContext<ICalendarWithSpecialist>) {

        const {params} = ctx.getState();

        ctx.dispatch(new CalendarWithSpecialistsAction.SetDate({
            date: DateTime.fromISO(params.start).minus({days: 1}).startOf('day').toJSDate().toISOString()
        }));

    }

    @Action(CalendarWithSpecialistsAction.SetDate)
    public async setDate(ctx: StateContext<ICalendarWithSpecialist>, {payload}: CalendarWithSpecialistsAction.SetDate) {

        const {date} = payload;

        const {params} = ctx.getState();

        // Check if it is a new date
        if (DateTime.fromISO(date).hasSame(DateTime.fromISO(params.start), 'day')) {
            this.ngxLogger.warn('CalendarWithSpecialistsState.setDate', 'Same date', date, params.start);
            ctx.dispatch(new CalendarWithSpecialistsAction.GetItems());
            return;
        }

        ctx.patchState({
            params: {
                ...params,
                start: DateTime.fromISO(date).startOf('day').toJSDate().toISOString(),
                end: DateTime.fromISO(date).endOf('day').toJSDate().toISOString(),
            }
        });

        await this.router.navigate([], {
            queryParams: {
                date,
            },
            replaceUrl: true,
        });

        ctx.dispatch(new CalendarWithSpecialistsAction.GetItems());

    }

}
